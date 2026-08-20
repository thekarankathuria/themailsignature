export interface MailClient {
  id: string;
  name: string;
  group: "Microsoft" | "Google" | "Apple" | "Other";
  /** How the signature gets in: paste rendered HTML, or paste source. */
  method: "paste" | "source" | "file";
  note?: string;
  steps: string[];
}

export const CLIENTS: MailClient[] = [
  {
    id: "gmail",
    name: "Gmail",
    group: "Google",
    method: "paste",
    steps: [
      "Copy the signature with the Copy signature button.",
      "In Gmail, open Settings with the gear icon, then See all settings.",
      "Scroll down the General tab to the Signature section.",
      "Click Create new, name the signature, then click into the edit box.",
      "Paste with Cmd + V or Ctrl + V.",
      "Under Signature defaults, pick it for new emails and for replies.",
      "Scroll to the bottom and click Save changes.",
    ],
  },
  {
    id: "outlook-windows",
    name: "Outlook (classic, Windows)",
    group: "Microsoft",
    method: "paste",
    note: "Outlook for Windows renders through Word, which is why the signature is built from tables rather than modern CSS.",
    steps: [
      "Copy the signature with the Copy signature button.",
      "Open Outlook and click New Email.",
      "On the Message tab, choose Signature, then Signatures.",
      "Click New, give the signature a name, then click OK.",
      "Click into the Edit signature box and paste with Ctrl + V.",
      "Set the signature under New messages and Replies/forwards.",
      "Click OK.",
    ],
  },
  {
    id: "outlook-new",
    name: "New Outlook and Outlook on the web",
    group: "Microsoft",
    method: "paste",
    steps: [
      "Copy the signature with the Copy signature button.",
      "Open Settings with the gear icon, then Accounts, then Signatures.",
      "Click New signature and give it a name.",
      "Click into the editor and paste with Cmd + V or Ctrl + V.",
      "Choose the signature for New messages and for Replies/forwards.",
      "Click Save.",
    ],
  },
  {
    id: "outlook-mac",
    name: "Outlook for Mac",
    group: "Microsoft",
    method: "paste",
    steps: [
      "Copy the signature with the Copy signature button.",
      "Open Outlook, then Settings from the Outlook menu.",
      "Choose Signatures, then click the plus button.",
      "Name the signature, click into the editor and paste with Cmd + V.",
      "Close the window, then pick the signature per account under Choose default signature.",
    ],
  },
  {
    id: "microsoft365",
    name: "Microsoft 365",
    group: "Microsoft",
    method: "paste",
    note: "Setting a signature here covers Outlook on the web. Desktop Outlook keeps its own local copy, so set it in both.",
    steps: [
      "Copy the signature with the Copy signature button.",
      "Sign in at outlook.office.com.",
      "Open Settings, then Accounts, then Signatures.",
      "Click New signature, name it, and paste into the editor.",
      "Assign it to new messages and replies, then Save.",
    ],
  },
  {
    id: "apple-mail",
    name: "Apple Mail (macOS)",
    group: "Apple",
    method: "paste",
    note: "Untick Always match my default message font, or Mail will strip the signature styling.",
    steps: [
      "Copy the signature with the Copy signature button.",
      "Open Mail, then Settings from the Mail menu, then Signatures.",
      "Pick the account on the left and click the plus button.",
      "Untick Always match my default message font.",
      "Select the placeholder text in the preview pane and paste with Cmd + V.",
      "Choose the signature under Choose Signature for that account.",
    ],
  },
  {
    id: "apple-mail-ios",
    name: "Apple Mail (iPhone and iPad)",
    group: "Apple",
    method: "paste",
    note: "iOS keeps formatting only if you copy the signature from an email you send yourself from a Mac or from Safari.",
    steps: [
      "Open this page in Safari on the device and tap Copy signature.",
      "Open Settings, scroll to Apps, then Mail.",
      "Tap Signature.",
      "Clear the existing text, then touch and hold and choose Paste.",
      "Leave the screen to save automatically.",
    ],
  },
  {
    id: "thunderbird",
    name: "Thunderbird",
    group: "Other",
    method: "file",
    note: "Thunderbird reads the signature from a file, so download the HTML rather than pasting it.",
    steps: [
      "Click Download .html and save the file somewhere permanent.",
      "In Thunderbird, open Account Settings from the hamburger menu.",
      "Select the account on the left.",
      "Tick Attach the signature from a file instead.",
      "Click Choose and pick the file you saved.",
      "Close Account Settings.",
    ],
  },
  {
    id: "yahoo",
    name: "Yahoo Mail",
    group: "Other",
    method: "paste",
    steps: [
      "Copy the signature with the Copy signature button.",
      "Open Settings, then More Settings.",
      "Choose Mailboxes and select your address.",
      "Turn the Signature toggle on.",
      "Paste into the box and leave the screen to save.",
    ],
  },
  {
    id: "proton",
    name: "Proton Mail",
    group: "Other",
    method: "source",
    note: "Proton's editor is easier to feed with the HTML source than with a rich paste.",
    steps: [
      "Click Copy HTML source.",
      "Open Settings, then All settings, then Identity and addresses.",
      "Expand the address and turn the signature on.",
      "Click the code icon in the signature editor toolbar.",
      "Paste the source and click Save.",
    ],
  },
  {
    id: "zoho",
    name: "Zoho Mail",
    group: "Other",
    method: "paste",
    steps: [
      "Copy the signature with the Copy signature button.",
      "Open Settings, then Signatures.",
      "Click New Signature and name it.",
      "Paste into the editor.",
      "Associate it with your address, then Save.",
    ],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    group: "Other",
    method: "source",
    steps: [
      "Click Copy HTML source.",
      "Open Settings, then General, then the Email tab.",
      "Find Email Signature and click Edit signature.",
      "Switch the editor to HTML with the toggle on the right.",
      "Paste the source and click Save.",
    ],
  },
  {
    id: "spark",
    name: "Spark",
    group: "Other",
    method: "paste",
    steps: [
      "Copy the signature with the Copy signature button.",
      "Open Settings, then Signatures.",
      "Click the plus button to add a signature.",
      "Paste into the editor and pick the accounts it applies to.",
      "Close the panel to save.",
    ],
  },
  {
    id: "front",
    name: "Front",
    group: "Other",
    method: "source",
    steps: [
      "Click Copy HTML source.",
      "Open Settings, then Signatures.",
      "Create a signature and choose who it applies to.",
      "Click the code icon in the editor toolbar.",
      "Paste the source and save.",
    ],
  },
];

export const CLIENT_BY_ID: Record<string, MailClient> = Object.fromEntries(
  CLIENTS.map((c) => [c.id, c]),
);

export const CLIENT_GROUPS: Array<MailClient["group"]> = [
  "Microsoft",
  "Google",
  "Apple",
  "Other",
];
