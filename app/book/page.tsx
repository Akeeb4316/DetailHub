import { SERVICES } from "../../lib";
import BookingForm from "./booking-form";

export const metadata = { title: "Book a detail | DetailHub" };

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const { service } = await searchParams;
  const selected = SERVICES.find((item) => item.id === service);

  return <BookingForm key={selected?.id ?? "full"} initialService={selected?.id ?? "full"} />;
}
