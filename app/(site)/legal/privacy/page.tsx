import Link from "next/link";
import { LegalPage } from "@/components/marketing/LegalPage";
import { COMPANY } from "@/lib/marketing/company";
import { pageMetadata } from "@/lib/marketing/pages";

export const metadata = pageMetadata("privacy");

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="16 September 2026">
      <p>
        This policy explains what personal data {COMPANY.name} collects, why, who helps us process
        it, and the choices you have. We collect only what we need to run the service.
      </p>

      <h2>Who is responsible</h2>
      <p>
        {COMPANY.legalName}, {COMPANY.address}, is responsible for your personal data. For privacy
        questions or requests, email {COMPANY.privacyEmail}.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> your email address and a securely hashed password. We never
          store your password itself.
        </li>
        <li>
          <strong>Signature content:</strong> the details you save in a signature, such as your name,
          job title, phone numbers, address and social links.
        </li>
        <li>
          <strong>Uploaded images:</strong> logos, photos and banners you upload. These are publicly
          accessible by their address, because email recipients&rsquo; mail clients must be able to
          load them.
        </li>
        <li>
          <strong>Messages:</strong> what you send us through the contact form, including your name,
          email address and company if you give it.
        </li>
        <li>
          <strong>Billing data:</strong> for paid plans, your plan, billing status and billing
          contact. Card details are handled by our payment processor; we do not see or store them.
        </li>
        <li>
          <strong>Technical data:</strong> your IP address, used briefly to limit abuse such as
          repeated form submissions, and standard server logs used to keep the service secure.
        </li>
      </ul>
      <p>
        Details you type into the editor without saving stay in your own browser. See the{" "}
        <Link href="/legal/cookies">cookie policy</Link>.
      </p>
      <p>
        We do not add tracking pixels to your signatures, and we do not collect information about the
        people you email.
      </p>

      <h2>Why we use it</h2>
      <ul>
        <li>To provide the service you asked for: your account, saved signatures and hosted images (performance of a contract).</li>
        <li>To take payment and manage subscriptions (performance of a contract and legal obligations such as tax records).</li>
        <li>To answer your messages (legitimate interests, or steps you ask us to take).</li>
        <li>To keep the service secure and prevent abuse (legitimate interests).</li>
        <li>To send service emails such as sign-in links, receipts and important changes. We send marketing email only if you opt in, and you can opt out at any time.</li>
      </ul>

      <h2>Who processes it for us</h2>
      <ul>
        <li><strong>Our hosting provider:</strong> runs the servers that store your account, signatures and uploaded images.</li>
        <li><strong>Resend:</strong> delivery of service emails and contact messages.</li>
        <li><strong>Stripe:</strong> payment processing for paid plans.</li>
      </ul>
      <p>
        These providers process data on our instructions and under contracts that require them to
        protect it. We do not sell your personal data.
      </p>

      <h2>International transfers</h2>
      <p>
        Our providers may process data outside your country. Where the law requires it, we rely on
        appropriate safeguards such as standard contractual clauses.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Account data, signatures and images: while your account is open, and removed when you delete it.</li>
        <li>Contact messages: as long as needed to deal with your enquiry, then deleted.</li>
        <li>Billing records: as long as tax and accounting law requires.</li>
        <li>Abuse-prevention data: IP addresses used for rate limiting are held only in server memory for a few minutes.</li>
      </ul>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, including under Canada&rsquo;s PIPEDA, the EU and UK GDPR, and
        India&rsquo;s Digital Personal Data Protection Act, 2023, you may have the right to access,
        correct, delete or export your data, to object to or restrict certain uses, and to withdraw
        consent. Email {COMPANY.privacyEmail} to make a request. You can also complain to your local
        data protection authority.
      </p>

      <h2>Security</h2>
      <p>
        We use encrypted connections, hashed passwords and access controls to protect your data. No
        system is perfectly secure; if a breach affects you, we will tell you as the law requires.
      </p>

      <h2>Children</h2>
      <p>The service is not intended for anyone under 16, and we do not knowingly collect their data.</p>

      <h2>Changes</h2>
      <p>
        We will update this policy when our practices change and tell you about significant changes
        before they take effect. The date at the top shows the latest version.
      </p>

      <h2>Contact</h2>
      <p>
        {COMPANY.legalName}, {COMPANY.address}. Email: {COMPANY.privacyEmail}.
      </p>
    </LegalPage>
  );
}
