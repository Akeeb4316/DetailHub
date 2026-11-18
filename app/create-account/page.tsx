import { redirect } from "next/navigation";
import { currentAccount } from "../../server/accounts";
import { bookingDestination, homeFor } from "../../server/paths";
import AccountForm from "../account-form";

export const metadata = { title: "Create an account | Task Signal" };

export default async function CreateAccountPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const account = await currentAccount();
  if (account) redirect(homeFor(account.role));
  return <main className="wrap account-page"><h1>Create an account</h1>
    <AccountForm mode="create" next={bookingDestination((await searchParams).next)} />
  </main>;
}
