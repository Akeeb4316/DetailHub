import { cookies } from "next/headers";

const noticeCookie = "task_signal_cookie_notice";

async function acknowledgeCookies() {
  "use server";

  (await cookies()).set(noticeCookie, "seen", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export default async function CookieNotice() {
  if ((await cookies()).get(noticeCookie)?.value === "seen") return null;

  return (
    <aside className="cookie-notice" aria-label="Cookie notice">
      <p>Task Signal uses cookies to keep you signed in and remember when you dismiss this notice.</p>
      <form action={acknowledgeCookies}><button type="submit">Got it</button></form>
    </aside>
  );
}
