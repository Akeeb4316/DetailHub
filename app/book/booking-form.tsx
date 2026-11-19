"use client";
import Link from "next/link";
import { useState } from "react";
import { SERVICES, SIZES, ADDONS, priceFor } from "../../lib";

export default function BookingForm({ initialService, name, email }: { initialService: string; name: string; email: string }) {
  const [service, setService] = useState(initialService);
  const [size, setSize] = useState("sedan");
  const [addons, setAddons] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const quote = priceFor(service, size, addons)!;
  const today = new Date().toISOString().split("T")[0];

  const toggle = (id: string) =>
    setAddons((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError("");
    const fields = new FormData(e.currentTarget);
    const form = Object.fromEntries(
      ["date", "window", "address", "name", "email", "phone"].map((field) => [field, fields.get(field)]),
    );
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, service, size, addons }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message); setBusy(false);
    }
  }

  return (
    <main className="wrap" id="main-content">
      <Link className="back-link" href="/#services">← All services</Link>
      <section className="hero">
        <h1>Book your detail</h1>
        <p>Choose your package and request an arrival window at your home or workplace.</p>
      </section>
      <form className="grid" onSubmit={submit}>
        <div>
          <fieldset>
            <legend>Service</legend>
            {SERVICES.map((s) => (
              <label className="opt" key={s.id}>
                <span><input type="radio" name="svc" checked={service === s.id} onChange={() => setService(s.id)} /> {s.name}<small>{s.blurb}</small></span>
                <b>${s.base}</b>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Vehicle size</legend>
            {SIZES.map((z) => (
              <label className="opt" key={z.id}>
                <span><input type="radio" name="size" checked={size === z.id} onChange={() => setSize(z.id)} /> {z.name}</span>
                <b>{z.extra ? `+$${z.extra}` : "Included"}</b>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Add-ons</legend>
            {ADDONS.map((a) => (
              <label className="opt" key={a.id}>
                <span><input type="checkbox" checked={addons.includes(a.id)} onChange={() => toggle(a.id)} /> {a.name}</span>
                <b>+${a.price}</b>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>When and where</legend>
            <div className="row">
              <label className="f">Date<input type="date" name="date" min={today} required /></label>
              <label className="f">Arrival window
                <select name="window" required>
                  <option>Morning (8am to 12pm)</option>
                  <option>Afternoon (12pm to 4pm)</option>
                  <option>Evening (4pm to 7pm)</option>
                </select>
              </label>
            </div>
            <label className="f">Service address<input type="text" name="address" autoComplete="street-address" placeholder="Street, city, ZIP" required /></label>
          </fieldset>
          <fieldset>
            <legend>Your details</legend>
            <label className="f">Full name<input type="text" name="name" autoComplete="name" defaultValue={name} required /></label>
            <div className="row">
              <label className="f">Email<input type="email" name="email" autoComplete="email" value={email} readOnly /></label>
              <label className="f">Phone<input type="tel" name="phone" autoComplete="tel" required /></label>
            </div>
          </fieldset>
        </div>
        <aside className="summary" aria-live="polite">
          <div>Your total</div>
          <div className="total">${quote.total}</div>
          <ul>
            <li><span>{quote.s.name}</span><span>${quote.s.base}</span></li>
            {quote.z.extra > 0 && <li><span>{quote.z.name}</span><span>${quote.z.extra}</span></li>}
            {quote.add.map((a) => <li key={a.id}><span>{a.name}</span><span>${a.price}</span></li>)}
          </ul>
          <button type="submit" disabled={busy}>{busy ? "Opening checkout…" : "Pay and book"}</button>
          {error && <div className="err" role="alert">{error}</div>}
          <div className="note">Secure payment by Stripe. You are charged now; we confirm your detailer by email.</div>
        </aside>
      </form>
    </main>
  );
}
