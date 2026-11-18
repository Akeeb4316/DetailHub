"use server";

import { redirect } from "next/navigation";
import { authenticate, currentAccount, endSession, register, saveServiceProfile, startSession } from "../server/accounts";
import { bookingDestination, homeFor } from "../server/paths";

export type FormState = { error?: string };

function field(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
}

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  const email = field(form, "email").trim().toLowerCase();
  const password = field(form, "password");
  const account = email.length <= 254 && password.length <= 128 ? await authenticate(email, password) : null;
  if (!account) return { error: "That email and password didn’t match." };
  await startSession(account.id);
  redirect((account.role === "customer" && bookingDestination(form.get("next"))) || homeFor(account.role));
}

export async function createAccount(_: FormState, form: FormData): Promise<FormState> {
  const role = field(form, "role");
  const name = field(form, "name").trim();
  const email = field(form, "email").trim().toLowerCase();
  const password = field(form, "password");
  if (role !== "customer" && role !== "business") return { error: "Choose an account type." };
  if (!name || name.length > 80) return { error: "Enter a name of up to 80 characters." };
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  if (password.length < 12 || password.length > 128) return { error: "Use a password between 12 and 128 characters." };
  const id = await register(name, email, password, role);
  if (!id) return { error: "Couldn’t create the account. If you already have one, sign in." };
  await startSession(id);
  const next = bookingDestination(form.get("next"));
  const service = next.split("?service=")[1];
  redirect(role === "customer" && service ? `/customer?next=${service}` : homeFor(role));
}

export async function signOut() {
  await endSession();
  redirect("/");
}

export async function updateBusiness(_: FormState, form: FormData): Promise<FormState> {
  const account = await currentAccount();
  if (account?.role !== "business") redirect("/sign-in");
  const name = field(form, "businessName").trim();
  const area = field(form, "serviceArea").trim();
  if (!name || !area || name.length > 100 || area.length > 160) {
    return { error: "Enter a business name and service area within the field limits." };
  }
  saveServiceProfile(account.id, name, area);
  redirect("/business?saved=1");
}
