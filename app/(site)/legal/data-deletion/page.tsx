import { LegalPage } from "@/components/marketing/LegalPage";
import { COMPANY } from "@/lib/marketing/company";
import { pageMetadata } from "@/lib/marketing/pages";

export const metadata = pageMetadata("dataDeletion");

export default function DataDeletionPage() {
  return (
    <LegalPage title="Delete Your Data" updated="16 September 2026">
      <p>
        You can ask us to delete your {COMPANY.name} account and the personal data connected to it
        at any time. This page explains how, and what happens next.
      </p>

      <h2>What gets deleted</h2>
      <ul>
        <li>Your account and sign-in details.</li>
        <li>Every signature saved to your account.</li>
        <li>Images you uploaded.</li>
        <li>Your membership of any team. If you own a team, transfer ownership first or the team is deleted too.</li>
      </ul>
      <p>
        We keep billing records only for as long as tax and accounting law requires, and nothing
        else.
      </p>

      <h2>Before you delete</h2>
      <p>
        Uploaded images are what make logos and photos appear in your signature. Once they are
        deleted, emails you have already sent will show a blank space where those images were. If
        you still use your signature, replace the images with ones hosted elsewhere first.
      </p>
      <p>
        If you have a paid plan, cancel it first so you are not charged again.
      </p>

      <h2>How to request deletion</h2>
      <p>
        Email {COMPANY.privacyEmail} from the address you signed up with and ask us to delete your
        account. If you write from a different address, we will ask you to confirm the request from
        your account address so nobody can delete an account that is not theirs.
      </p>
      <p>
        You will also be able to delete your account yourself from your account settings. Once that
        option is available, it removes the same data immediately.
      </p>

      <h2>How long it takes</h2>
      <p>
        We act on confirmed requests within 30 days and email you when deletion is complete. Backups
        that contain your data are overwritten on their normal cycle and are never restored except to
        recover from a failure.
      </p>

      <h2>Unsaved drafts</h2>
      <p>
        A draft you have not saved lives only in your own browser. Clear this website&rsquo;s site
        data in your browser settings to remove it.
      </p>

      <h2>Questions</h2>
      <p>Email {COMPANY.privacyEmail}.</p>
    </LegalPage>
  );
}
