import { redirect } from "next/navigation";
import { currentAccount, getServiceProfile } from "../../server/accounts";
import ProfileForm from "./profile-form";

export const metadata = { title: "Business dashboard | Task Signal" };

export default async function BusinessPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const account = await currentAccount();
  if (!account) redirect("/sign-in");
  if (account.role !== "business") redirect("/customer");
  const profile = getServiceProfile(account.id);
  return <main className="wrap account-page">
    <h1>Business dashboard</h1>
    <p>Add your business name and the cities or ZIP codes you serve.</p>
    {profile && (await searchParams).saved === "1" && <p role="status">Business profile saved.</p>}
    <ProfileForm name={profile?.business_name ?? ""} area={profile?.service_area ?? ""} />
  </main>;
}
