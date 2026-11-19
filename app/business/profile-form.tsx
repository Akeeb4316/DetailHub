"use client";

import { useActionState } from "react";
import { updateBusiness } from "../account-actions";

export default function ProfileForm({ name, area }: { name: string; area: string }) {
  const [state, action, pending] = useActionState(updateBusiness, {});
  return <form className="account-form" action={action}>
    <label className="f">Business name<input name="businessName" type="text" required maxLength={100} defaultValue={name} /></label>
    <label className="f">Service area<input name="serviceArea" type="text" required maxLength={160} defaultValue={area}
      placeholder="Cities or ZIP codes you cover" /></label>
    {state.error && <p className="form-error" role="alert">{state.error}</p>}
    <button disabled={pending}>{pending ? "Saving…" : "Save business profile"}</button>
  </form>;
}
