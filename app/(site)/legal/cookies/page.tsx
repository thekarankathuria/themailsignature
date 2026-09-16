import { LegalPage } from "@/components/marketing/LegalPage";
import { COMPANY } from "@/lib/marketing/company";
import { pageMetadata } from "@/lib/marketing/pages";
import { STORAGE_KEY } from "@/lib/signature/defaults";

export const metadata = pageMetadata("cookies");

/** Must match the key in components/site/ThemeToggle.tsx. */
const THEME_KEY = "sendmark.theme";

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updated="16 September 2026">
      <p>
        This policy lists every cookie and browser storage item {COMPANY.name} uses, and how to
        control them. We keep this list short on purpose.
      </p>

      <h2>Cookies</h2>
      <p>
        We set cookies only when you sign in. They are strictly necessary: they keep you signed in
        and protect your session, and the service cannot work without them.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-200">
              <th scope="col" className="py-2 pr-4 font-semibold text-navy-900">Name</th>
              <th scope="col" className="py-2 pr-4 font-semibold text-navy-900">Purpose</th>
              <th scope="col" className="py-2 font-semibold text-navy-900">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-ink-100">
              <td className="whitespace-nowrap py-2 pr-4 font-mono">sb-…-auth-token</td>
              <td className="py-2 pr-4">Keeps you signed in (set by our authentication provider, Supabase).</td>
              <td className="py-2">Until you sign out or the session expires</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Browser storage</h2>
      <p>The editor also saves two items in your browser&rsquo;s local storage. They never leave your device.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-200">
              <th scope="col" className="py-2 pr-4 font-semibold text-navy-900">Key</th>
              <th scope="col" className="py-2 font-semibold text-navy-900">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-ink-100">
              <td className="whitespace-nowrap py-2 pr-4 font-mono">{STORAGE_KEY}</td>
              <td className="py-2">Your unsaved signature draft, so it is still there when you come back.</td>
            </tr>
            <tr className="border-b border-ink-100">
              <td className="whitespace-nowrap py-2 pr-4 font-mono">{THEME_KEY}</td>
              <td className="py-2">Whether you chose the light or dark editor theme.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Analytics and advertising</h2>
      <p>
        We do not use analytics, advertising or social media cookies. If we add analytics in the
        future, we will update this policy first and ask for your consent where the law requires it.
      </p>

      <h2>Your signature</h2>
      <p>
        Signatures made with {COMPANY.name} contain no tracking pixels and set no cookies for the
        people who receive your email.
      </p>

      <h2>How to control them</h2>
      <ul>
        <li>Signing out removes the session cookie.</li>
        <li>Clearing site data for this website in your browser settings removes the cookie and both storage items. Clearing them deletes an unsaved editor draft.</li>
        <li>You can block cookies in your browser, but you will not be able to sign in.</li>
      </ul>

      <h2>Contact</h2>
      <p>Questions about this policy: {COMPANY.privacyEmail}.</p>
    </LegalPage>
  );
}
