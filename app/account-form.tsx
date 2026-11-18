"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createAccount, signIn } from "./account-actions";

export default function AccountForm({ mode, next }: { mode: "sign-in" | "create"; next: string }) {
  const creating = mode === "create";
  const [state, action, pending] = useActionState(creating ? createAccount : signIn, {});
  return (
    <form className="account-form" action={action}>
      <input type="hidden" name="next" value={next} />
      {creating && (
        <>
          <fieldset className="role-options">
            <legend>How will you use Task Signal?</legend>
            <label className="opt"><span><input type="radio" name="role" value="customer" required defaultChecked /> Customer<small>Browse and book services.</small></span></label>
            <label className="opt"><span><input type="radio" name="role" value="business" required /> Business<small>Set up your business to offer services.</small></span></label>
          </fieldset>
          <label className="f">Full name<input name="name" type="text" autoComplete="name" required maxLength={80} /></label>
        </>
      )}
      <label className="f">Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      <label className="f">Password<input name="password" type="password" required minLength={creating ? 12 : undefined}
        maxLength={128} autoComplete={creating ? "new-password" : "current-password"} /></label>
      {creating && <p className="field-hint">Use at least 12 characters.</p>}
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button disabled={pending}>{pending ? "Working…" : creating ? "Create account" : "Sign in"}</button>
      <p>{creating ? "Already have an account? " : "New to Task Signal? "}
        <Link href={`${creating ? "/sign-in" : "/create-account"}${next ? "?next=" + encodeURIComponent(next) : ""}`}>
          {creating ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
