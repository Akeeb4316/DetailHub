import { currentAccount } from "../../../server/accounts";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { priceFor } from "../../../lib";

export async function POST(req: Request) {
  const account = await currentAccount();
  if (!account) return NextResponse.json({ error: "Sign in to book a detail." }, { status: 401 });
  if (account.role !== "customer") return NextResponse.json({ error: "Booking requires a customer account." }, { status: 403 });
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ error: "Payments are not set up yet (missing STRIPE_SECRET_KEY)." }, { status: 500 });
  const b = await req.json();
  // Price is always recomputed on the server so customers can't change it.
  const quote = priceFor(b.service, b.size, Array.isArray(b.addons) ? b.addons : []);
  if (!quote) return NextResponse.json({ error: "Invalid service selection." }, { status: 400 });
  if (!b.name || !b.address || !b.date) return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });

  const stripe = new Stripe(key);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: account.email,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: quote.total * 100,
        product_data: { name: `${quote.s.name} (${quote.z.name})`, description: quote.add.map((a) => a.name).join(", ") || undefined },
      },
    }],
    metadata: {
      service: b.service, size: b.size, addons: (b.addons || []).join(","),
      date: String(b.date), window: String(b.window), address: String(b.address),
      name: String(b.name), phone: String(b.phone),
    },
    success_url: `${site}/success`,
    cancel_url: `${site}/book?service=${encodeURIComponent(quote.s.id)}`,
  });
  return NextResponse.json({ url: session.url });
}
