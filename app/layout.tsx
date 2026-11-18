import Image from "next/image";
import Link from "next/link";
import { currentAccount } from "../server/accounts";
import { homeFor } from "../server/paths";
import CookieNotice from "./cookie-notice";
import { signOut } from "./account-actions";
import "./globals.css";

export const metadata = {
  title: "Task Signal | Book help at your door",
  description: "Find and book businesses that come to you.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const account = await currentAccount();
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav className="wrap site-nav" aria-label="Main navigation">
            <Link className="wordmark" href="/">
              <Image src="/task-signal-mark.webp" width={34} height={23} alt="" />
              <span>Task Signal</span>
            </Link>
            <div className="nav-links">
              {account ? (
                <>
                  <Link href={homeFor(account.role)}>{account.role === "business" ? "Dashboard" : "My account"}</Link>
                  <form action={signOut}><button className="nav-book">Sign out</button></form>
                </>
              ) : (
                <>
                  <Link href="/sign-in">Sign in</Link>
                  <Link className="nav-book" href="/create-account">Create account</Link>
                </>
              )}
            </div>
          </nav>
        </header>
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
