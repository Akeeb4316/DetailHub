import { redirect } from "next/navigation";
import { currentAccount } from "../../server/accounts";
import { SERVICES } from "../../lib";
import BookingForm from "./booking-form";

export const metadata = { title: "Book a detail | Task Signal" };

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const { service } = await searchParams;
  const selected = SERVICES.find((item) => item.id === service);

  const account = await currentAccount();
  const destination = selected ? `/book?service=${selected.id}` : "/book";
  if (!account) redirect(`/sign-in?next=${encodeURIComponent(destination)}`);
  if (account.role !== "customer") redirect("/business");

  return <BookingForm name={account.name} email={account.email} key={selected?.id ?? "full"} initialService={selected?.id ?? "full"} />;
}
