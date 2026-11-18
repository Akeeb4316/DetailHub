import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "DetailHub | Mobile car detailing",
  description: "Compare detailing packages and book a mobile detail at your home or workplace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav className="wrap site-nav" aria-label="Main navigation">
            <Link className="wordmark" href="/">DetailHub<span aria-hidden="true">.</span></Link>
            <div className="nav-links">
              <Link href="/#services">Services</Link>
              <Link className="nav-book" href="/book">Book a detail</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
