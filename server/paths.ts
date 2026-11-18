import type { Role } from "./accounts";

export function homeFor(role: Role) {
  return role === "business" ? "/business" : "/customer";
}

export function bookingDestination(value: unknown) {
  return typeof value === "string" && /^\/book(?:\?service=(?:interior|exterior|full))?$/.test(value)
    ? value : "";
}
