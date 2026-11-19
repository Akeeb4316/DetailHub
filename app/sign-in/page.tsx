import { redirect } from "next/navigation";
import { currentAccount } from "../../server/accounts";
import { bookingDestination, homeFor } from "../../server/paths";
import AccountForm from "../account-form";

export const metadata = { title: "Sign in | Task Signal" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = bookingDestination((await searchParams).next);
  const account = await currentAccount();
  if (account) redirect((account.role === "customer" && next) || homeFor(account.role));
  return <main className="wrap account-page"><h1>Sign in</h1>
    {next && <p>Sign in with a customer account to continue booking.</p>}
    <AccountForm mode="sign-in" next={next} />
  </main>;
}
