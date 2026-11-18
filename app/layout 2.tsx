import "./globals.css";
export const metadata = { title: "DetailHub: mobile car detailing, booked online", description: "We send a vetted detailer to your driveway." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
