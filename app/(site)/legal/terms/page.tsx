import Link from "next/link";
import { LegalPage } from "@/components/marketing/LegalPage";
import { COMPANY } from "@/lib/marketing/company";
import { pageMetadata } from "@/lib/marketing/pages";

export const metadata = pageMetadata("terms");

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="16 September 2026">
      <p>
        These terms apply when you use {COMPANY.name} (the &ldquo;service&rdquo;), including the
        signature editor, your account and any paid plan. By using the service you agree to them. If
        you use the service for an organisation, you agree on its behalf and confirm you are allowed
        to do so.
      </p>

      <h2>Who we are</h2>
      <p>
        The service is provided by {COMPANY.legalName}, {COMPANY.address}. You can reach us at{" "}
        {COMPANY.supportEmail} or through our <Link href="/contact">contact page</Link>.
      </p>

      <h2>The service</h2>
      <p>
        {COMPANY.name} lets you design an email signature, copy or download it, and install it in
        the email clients you use. Some features require an account, and some require a paid plan.
        The features in each plan are described on our <Link href="/pricing">pricing page</Link>.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>Give us accurate information and keep your password secure.</li>
        <li>You are responsible for activity under your account.</li>
        <li>Tell us promptly if you believe someone has accessed your account without permission.</li>
        <li>You must be at least 16 years old, or the age of digital consent where you live if higher.</li>
      </ul>

      <h2>Plans, billing and cancellation</h2>
      <ul>
        <li>Paid plans are billed in advance, monthly or yearly, through our payment processor.</li>
        <li>Business plans are billed per seat, with the minimum number of seats shown at checkout.</li>
        <li>Plans renew automatically until cancelled. You can cancel at any time; your plan stays active until the end of the period you have paid for.</li>
        <li>Except where the law requires otherwise, payments are not refundable for partly used periods.</li>
        <li>We may change prices. We will tell you at least 30 days before a change affects your next renewal, and you can cancel before it takes effect.</li>
        <li>Taxes are added where required.</li>
      </ul>

      <h2>Acceptable use</h2>
      <p>You must not use the service to:</p>
      <ul>
        <li>impersonate another person or organisation, or create a signature that misleads people about who you are;</li>
        <li>send phishing, spam or other unlawful messages;</li>
        <li>upload content you do not have the right to use, or content that is unlawful, hateful or infringes someone else&rsquo;s rights;</li>
        <li>interfere with the service, probe it for vulnerabilities without permission, or access it by automated means beyond normal use.</li>
      </ul>
      <p>We may suspend or remove content or accounts that break these rules.</p>

      <h2>Your content</h2>
      <p>
        You keep ownership of the details, logos and images you add. You give us a limited licence to
        store, process and display that content only as needed to provide the service, including
        hosting uploaded images so they display in emails you send.
      </p>

      <h2>Hosted images</h2>
      <p>
        Images you upload are served from permanent addresses so that signatures in emails you have
        already sent keep displaying them. If your account is deleted, your images are removed and
        will stop displaying in those emails. See{" "}
        <Link href="/legal/data-deletion">deleting your data</Link>.
      </p>

      <h2>Our content</h2>
      <p>
        The service, its templates, software and branding belong to {COMPANY.legalName} or its
        licensors. You may use the signatures you create for your own email, including commercial
        email.
      </p>

      <h2>Availability and changes</h2>
      <p>
        We work to keep the service available but do not promise it will be uninterrupted. We may
        change or discontinue features; if we remove a feature from a paid plan during your billing
        period, we will tell you in advance.
      </p>

      <h2>Disclaimers</h2>
      <p>
        Email clients change how they display messages without notice. We build signatures to work
        in widely used clients, but we cannot guarantee how every client, version or device will show
        them. The service is provided &ldquo;as is&rdquo; to the extent the law allows.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent the law allows, {COMPANY.legalName} is not liable for indirect or consequential
        losses, and our total liability for any claim is limited to the amount you paid us in the 12
        months before the claim. Nothing in these terms limits liability that cannot be limited by
        law.
      </p>

      <h2>Ending your use</h2>
      <p>
        You can stop using the service and delete your account at any time. We may suspend or end
        your access if you seriously or repeatedly break these terms, with notice where reasonable.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of {COMPANY.jurisdiction}, without affecting any
        mandatory consumer protections you have where you live.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms. If a change is significant, we will tell you by email or in the
        service before it takes effect. The date at the top shows when they last changed.
      </p>

      <h2>Contact</h2>
      <p>Questions about these terms: {COMPANY.supportEmail}.</p>
    </LegalPage>
  );
}
