import Link from "next/link";
import { redirect } from "next/navigation";
import { currentAccount } from "../../server/accounts";

export const metadata = { title: "Customer account | Task Signal" };

export default async function CustomerPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const account = await currentAccount();
  if (!account) redirect("/sign-in");
  if (account.role !== "customer") redirect("/business");
  const { next } = await searchParams;
  const service = ["interior", "exterior", "full"].find((item) => item === next);
  return <main className="wrap account-page">
    <h1>Welcome, {account.name}.</h1>
    <p>Explore services available to book.</p>
    <Link className="action" href={service ? `/book?service=${service}` : "/#services"}>{service ? "Continue booking" : "Browse services"} <span aria-hidden="true">↗</span></Link>
  </main>;
}
