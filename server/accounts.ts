import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { promisify } from "node:util";
import { cookies } from "next/headers";

export type Role = "customer" | "business";
export type Account = { id: number; name: string; email: string; role: Role };

const cookieName = "detailhub_session";
const sessionAge = 60 * 60 * 24 * 7;
const deriveKey = promisify(scrypt);
let database: DatabaseSync | undefined;

function db() {
  if (database) return database;
  const directory = join(process.cwd(), ".detailhub");
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const connection = new DatabaseSync(join(directory, "accounts.sqlite"));
  connection.exec(`
    PRAGMA busy_timeout = 5000;
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('customer', 'business'))
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY, account_id INTEGER NOT NULL REFERENCES accounts(id),
      expires INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS service_profiles (
      account_id INTEGER PRIMARY KEY REFERENCES accounts(id),
      business_name TEXT NOT NULL, service_area TEXT NOT NULL
    );
  `);
  database = connection;
  return connection;
}

function digest(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function register(name: string, email: string, password: string, role: Role) {
  const salt = randomBytes(16).toString("hex");
  const key = await deriveKey(password, salt, 64) as Buffer;
  const result = db().prepare(
    "INSERT INTO accounts (name, email, password, role) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO NOTHING",
  ).run(name, email, `${salt}:${key.toString("hex")}`, role);
  return result.changes ? Number(result.lastInsertRowid) : null;
}

export async function authenticate(email: string, password: string) {
  const account = db().prepare("SELECT id, password, role FROM accounts WHERE email = ?").get(email) as
    { id: number; password: string; role: Role } | undefined;
  const [salt, hash] = account?.password.split(":") ?? ["detailhub-missing-account", "0".repeat(128)];
  const key = await deriveKey(password, salt, 64) as Buffer;
  return timingSafeEqual(Buffer.from(hash, "hex"), key) && account ? account : null;
}

export async function currentAccount() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  return (db().prepare(`
    SELECT a.id, a.name, a.email, a.role FROM accounts a
    JOIN sessions s ON s.account_id = a.id WHERE s.token = ? AND s.expires > ?
  `).get(digest(token), Date.now()) as Account | undefined) ?? null;
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) db().prepare("DELETE FROM sessions WHERE token = ?").run(digest(token));
  jar.delete(cookieName);
}

export async function startSession(accountId: number) {
  await endSession();
  const token = randomBytes(32).toString("hex");
  db().prepare("DELETE FROM sessions WHERE expires <= ?").run(Date.now());
  db().prepare("INSERT INTO sessions VALUES (?, ?, ?)").run(digest(token), accountId, Date.now() + sessionAge * 1000);
  (await cookies()).set(cookieName, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: sessionAge,
  });
}

export function getServiceProfile(accountId: number) {
  return db().prepare("SELECT business_name, service_area FROM service_profiles WHERE account_id = ?").get(accountId) as
    { business_name: string; service_area: string } | undefined;
}

export function saveServiceProfile(accountId: number, businessName: string, serviceArea: string) {
  db().prepare(`
    INSERT INTO service_profiles VALUES (?, ?, ?)
    ON CONFLICT(account_id) DO UPDATE SET business_name = excluded.business_name, service_area = excluded.service_area
  `).run(accountId, businessName, serviceArea);
}
