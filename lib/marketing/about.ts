import type { ClaimId } from "./claims";

export const ABOUT: {
  title: string;
  lede: string;
  sections: Array<{ heading: string; body: string[]; claims: ClaimId[] }>;
} = {
  title: "Email signatures that hold up everywhere",
  lede:
    "TheMailSignature exists because a signature that looks perfect in one inbox so often falls apart in another.",
  sections: [
    {
      heading: "Why we built it",
      body: [
        "Most signature tools design for the browser. Email is not a browser: Outlook for Windows renders messages with Microsoft Word's layout engine, which ignores much of modern HTML and CSS. A signature built with flexible layouts or external stylesheets can look polished in the editor and broken in a client's inbox.",
        "We wanted a tool that treats those limits as the starting point, so the signature you see is the signature your recipients see.",
      ],
      claims: ["renders-everywhere"],
    },
    {
      heading: "How it works",
      body: [
        "Every template is built from nested HTML tables with every style written inline, the format Outlook, Gmail and Apple Mail all understand. Anything you type is escaped before it reaches the signature, and only ordinary web, email and phone links are allowed.",
        "Images you upload are stored at a permanent address based on their content, so a signature in an email you sent last year still shows its logo today. When you are done, you can copy the signature, download it as HTML, or take a plain-text version.",
      ],
      claims: ["renders-everywhere", "image-hosting", "copy-export"],
    },
    {
      heading: "What we do not do",
      body: [
        "We do not add tracking pixels to your signature, and we do not sell your data. Your signature is there to represent you, not to watch the people you write to.",
      ],
      claims: ["no-tracking-pixels"],
    },
  ],
};
