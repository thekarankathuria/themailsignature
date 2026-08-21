// GENERATED FILE — do not edit by hand.
// Produced by scripts/extract-solutions.mjs from the 21 saved pages in
// docs/research/raw/pages/solution_*.html. Re-run `node scripts/extract-solutions.mjs`
// to regenerate. Every asset path is local (/ces/...), translated through
// docs/research/raw/asset-map.json.
//
// The copy is verbatim from the original, with one deliberate substitution: the brand is
// "Mail Signature" throughout (see docs/research/BUILDER_BRIEF.md, "Theme overrides").

/**
 * One run of rich text: plain text, a line break, or a highlighted span (whose contents are
 * themselves rich — `solution_customer-support.html` breaks the line inside the highlight).
 * Headings, chip labels and button labels all use it, because every one of them carries a
 * stray `<br>` on at least one of the 21 pages.
 */
export type SolutionRich = string | { br: true } | { hl: SolutionRich[]; cls: string };

export type SolutionImage = {
  src: string;
  alt: string;
  srcset?: string;
  sizes?: string;
};

export type SolutionButton = {
  href: string;
  label: SolutionRich[];
  /** The original renders a double-chevron glyph inside `.button-icon-wrap` on some buttons. */
  chevron: boolean;
};

export type SolutionHero = {
  eyebrow: SolutionRich[];
  /** The three rhythm spacers inside `.about-hero-text-wrapper`, in order. */
  spacerClasses: string[];
  headingWrapClass: string;
  h1Class: string;
  h1: SolutionRich[];
  h2Class: string;
  h2: string;
  paragraphClass: string;
  paragraph: string;
  cta: SolutionButton | null;
  subline: string;
  image: SolutionImage | null;
  lottie: string;
};

export type SolutionFeatureCard = {
  /** `img-wraper`, plus the `auto` / `auto2` height modifiers finance-banking adds. */
  wrapperClass: string;
  /** Webflow `w-node-*` id — it carries grid-placement CSS, so it has to survive. */
  gridId: string;
  image: SolutionImage | null;
  title: string;
  body: string;
};

export type SolutionFeatures = {
  id: string;
  headerClass: string;
  headingBlockClass: string;
  h2Class: string;
  paragraphClass: string;
  eyebrow: SolutionRich[];
  heading: SolutionRich[];
  paragraph: string;
  cards: SolutionFeatureCard[];
};

export type SolutionTopUserItem = {
  cta: SolutionButton | null;
  lottie: string;
};

export type SolutionTopUsers = {
  headerClass: string;
  h2Class: string;
  paragraphClass: string;
  eyebrow: SolutionRich[];
  heading: SolutionRich[];
  paragraph: string;
  items: SolutionTopUserItem[];
  cta: SolutionButton | null;
};

export type SolutionBenefit = {
  icon: SolutionImage | null;
  title: string;
  body: string;
};

export type SolutionCoreSection = {
  /** `core-feature-section` on 20 pages, `supercharge-your-emails` on real-estate-firms. */
  wrapperClass: string;
  /** `solution_marketers.html` nests this section inside an extra `.padding-global`. */
  paddingGlobal: boolean;
  headerClass: string;
  h2Class: string;
  paragraphClass: string;
  eyebrow: SolutionRich[];
  heading: SolutionRich[];
  paragraph: string;
  cards: SolutionBenefit[];
  cta: SolutionButton | null;
};

export type SolutionFaqItem = {
  question: string;
  /** Inline emphasis and one Loom embed; rendered with `dangerouslySetInnerHTML`. */
  answerHtml: string;
};

export type SolutionFaq = {
  eyebrow: SolutionRich[];
  h2Class: string;
  heading: SolutionRich[];
  paragraph: string;
  items: SolutionFaqItem[];
};

export type SolutionCta = {
  h2Class: string;
  heading: SolutionRich[];
  paragraph: string;
  cta: SolutionButton | null;
};

export type Solution = {
  slug: string;
  title: string;
  description: string;
  hero: SolutionHero;
  features: SolutionFeatures;
  topUsers: SolutionTopUsers;
  core: SolutionCoreSection[];
  faq: SolutionFaq;
  /** `freelancers` and `teachers` close with the site-wide `.cta_section` instead. */
  usesSharedCta: boolean;
  solutionCta: SolutionCta | null;
};

const FAQ_1: SolutionFaq = {
  "eyebrow": [
    "FAQs"
  ],
  "h2Class": "heading-style-h2 text-color",
  "heading": [
    "Works with ANY Email or CRM"
  ],
  "paragraph": "Mail Signature Works with any email, browser, and email client.",
  "items": [
    {
      "question": "📩 Does this effect email deliverability?",
      "answerHtml": "<div class=\"margin-bottom margin-small\"><div class=\"max-width-large\"><p class=\"margin-top-2\"><strong class=\"bold-text-4\">Not at all!</strong> Mail Signature&#x27;s unique technology is designed to keep your email deliverability intact. By serving your email signature&#x27;s animation from our secure servers, we avoid adding heavy elements to your emails. This reduces the chance of your email being marked as spam or being blocked by email service providers. With Mail Signature, you can <strong>feel confident</strong> that your emails will reach their destination with your animated signature intact.<br></p><div style=\"padding-top:75%\" class=\"faq_loom w-video w-embed\"><iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.loom.com%2Fembed%2F4bcbb9f51c574e7d96ad8f241c4ead5a&display_name=Loom&url=https%3A%2F%2Fwww.loom.com%2Fshare%2F4bcbb9f51c574e7d96ad8f241c4ead5a%3Fsid%3Df05ba12a-fb59-4bd8-9e4e-dac62f976523&image=https%3A%2F%2Fcdn.loom.com%2Fsessions%2Fthumbnails%2F4bcbb9f51c574e7d96ad8f241c4ead5a-b1a38be5d767f695.gif&type=text%2Fhtml&schema=loom\" width=\"940\" height=\"705\" scrolling=\"no\" allowfullscreen title=\"Live Deliverability Test Using Mail Signature!\"></iframe></div></div></div>"
    },
    {
      "question": "🖥 Does this work Gmail and Outlook?",
      "answerHtml": "<div class=\"margin-bottom margin-small\"><div class=\"max-width-large\"><p class=\"margin-top-2\"><span class=\"bold-text-4\"><strong>Certainly!</strong></span> Mail Signature is engineered to work with ALL CRMs and Email Clients, ensuring a seamless and universal user experience. Our advanced technology allows for optimal display and animation of email signatures across all platforms. Just follow our simple installation instructions, and your email signature will be ready to impress, regardless of your chosen CRM or email client!</p></div></div>"
    },
    {
      "question": "🖥 Does this work with other emails and CRMS",
      "answerHtml": "<div class=\"margin-bottom margin-small\"><div class=\"max-width-large\"><p class=\"margin-top-2\"><span class=\"bold-text-4\"><strong>YES</strong></span> Mail Signature is engineered to work with <span class=\"bold-text-4\"><strong>ALL CRMs and Email Clients</strong></span>, ensuring a seamless and universal user experience.</p></div></div>"
    },
    {
      "question": "💰 Is there a Free Trial on Paid Plan?",
      "answerHtml": "<div class=\"margin-bottom margin-small\"><div class=\"max-width-large\"><p class=\"margin-top-2\"><strong>Yes</strong>, Mail Signature provides a <strong>7-day risk-free trial on all paid accounts.</strong></p></div></div>"
    }
  ]
};

export const solutions: Solution[] = [
  {
    "slug": "accountants",
    "title": "Accountants",
    "description": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
    "hero": {
      "eyebrow": [
        "For Accountants Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution",
      "h1": [
        "Custom ",
        {
          "br": true
        },
        {
          "hl": [
            "Accountants"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
      "cta": {
        "href": "#",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/69954456e3b2eeba61841faa_Container-5.png",
        "alt": "Image",
        "srcset": "/ces/img/69954456e3b2eeba61841faa_Container-5-p-500.png 500w, /ces/img/69954456e3b2eeba61841faa_Container-5-p-800.png 800w, /ces/img/69954456e3b2eeba61841faa_Container-5-p-1080.png 1080w, /ces/img/69954456e3b2eeba61841faa_Container-5.png 1358w",
        "sizes": "100vw"
      },
      "lottie": "/ces/lottie/6995447ca06b9f5c23f2860e_5.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Accountants"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Secure, professional email signatures built for finance and accounting professionals.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-f2ee4329",
          "image": {
            "src": "/ces/img/697061e6f78563ad08337744_Card-Graphic-Container-26.avif",
            "alt": "Professional card for Sam Whitaker, Management Accountant at Virion, with social media icons and a photo of a man wearing glasses.",
            "srcset": "/ces/img/697061e6f78563ad08337744_Card-Graphic-Container-26-p-500.png 500w, /ces/img/697061e6f78563ad08337744_Card-Graphic-Container-26-p-800.png 800w, /ces/img/697061e6f78563ad08337744_Card-Graphic-Container-26.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-f2ee4329",
          "image": {
            "src": "/ces/img/69705ca6393d261d04a2de7a_Card-Graphic-Container-1.avif",
            "alt": "User interface with a verification toggle switch turned on, input fields for full name, title/subtitle, and company name, and selection options for banner, logo, layout, and social media icons including Instagram, LinkedIn, Facebook, Google, Twitter, and Spotify."
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-f2ee4329",
          "image": {
            "src": "/ces/img/697061e5dbcd9af8335d88af_Card-Graphic-Container-27.avif",
            "alt": "User profile card for Sam Whitaker, Management Accountant at FinPro, showing integration with Outlook, Apple Mail, Gmail, Microsoft Edge, Mail app, and 1000+ other services.",
            "srcset": "/ces/img/697061e5dbcd9af8335d88af_Card-Graphic-Container-27-p-500.png 500w, /ces/img/697061e5dbcd9af8335d88af_Card-Graphic-Container-27-p-800.png 800w, /ces/img/697061e5dbcd9af8335d88af_Card-Graphic-Container-27.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper",
      "eyebrow": [
        "ACCOUNTANTS SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "hl": [
            "Accountants"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/685c276ec25c91a6a4ebbe38_Shopify.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995447ce272aa2caaa60eab_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995447c9f98a591fe3c8794_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995447c8f02909cb37c80a0_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995447ca06b9f5c23f2860e_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995447ca71df3c4446a6461_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "ceos",
    "title": "CEOs",
    "description": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
    "hero": {
      "eyebrow": [
        "For CEOs Professionals"
      ],
      "spacerClasses": [
        "spacer-small",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution horizontal",
      "h1": [
        "Custom ",
        {
          "hl": [
            "CEOs"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/6995445699455f38babf2e0b_Container-3.png",
        "alt": "Image",
        "srcset": "/ces/img/6995445699455f38babf2e0b_Container-3-p-500.png 500w, /ces/img/6995445699455f38babf2e0b_Container-3-p-800.png 800w, /ces/img/6995445699455f38babf2e0b_Container-3-p-1080.png 1080w, /ces/img/6995445699455f38babf2e0b_Container-3.png 1346w",
        "sizes": "(max-width: 1346px) 100vw, 1346px"
      },
      "lottie": "/ces/lottie/6995467f03001868248392c1_2.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container solution",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2 fix-width",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "CEOs"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Executive-level email signatures that reflect leadership and professionalism.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-e11a44f7",
          "image": {
            "src": "/ces/img/697061e89a53c7b0a3c4ff48_Card-Graphic-Container-34.avif",
            "alt": "Business card for Dana Whitfield, CEO & Founder of Zirox, featuring her photo, company logo, email, website, and social media icons.",
            "srcset": "/ces/img/697061e89a53c7b0a3c4ff48_Card-Graphic-Container-34-p-500.png 500w, /ces/img/697061e89a53c7b0a3c4ff48_Card-Graphic-Container-34.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-e11a44f7",
          "image": {
            "src": "/ces/img/696e1b83a1638b77a692f535_Card-Graphic-Container-2.avif",
            "alt": "User interface showing a toggle for verification, input fields for full name, title, and company name, and social media icon options with some selected."
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-e11a44f7",
          "image": {
            "src": "/ces/img/697061e8085c702c98ca2987_Card-Graphic-Container-35.avif",
            "alt": "Email app icons from Outlook, Apple Mail, Gmail, Microsoft Edge, and a generic mail app connecting to a digital business card for Dana Whitfield, CEO & Founder at Zirox.",
            "srcset": "/ces/img/697061e8085c702c98ca2987_Card-Graphic-Container-35-p-500.png 500w, /ces/img/697061e8085c702c98ca2987_Card-Graphic-Container-35-p-800.png 800w, /ces/img/697061e8085c702c98ca2987_Card-Graphic-Container-35.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "CEOs SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "hl": [
            "CEOs"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995467f76bf5d4e8d48669d_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995467f03001868248392c1_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995467f6d98951e7f8e5ef1_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995467f97602f9e634a7c0e_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995467f8bb3bda7d31eaf25_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995467fe6e79bbe56745e25_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "consultants",
    "title": "Consultants",
    "description": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
    "hero": {
      "eyebrow": [
        "For Consultants Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution",
      "h1": [
        "Custom ",
        {
          "br": true
        },
        {
          "hl": [
            "Consultants"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/698d75c3df8f148b4f679e5a_Container-6.png",
        "alt": "Image",
        "srcset": "/ces/img/698d75c3df8f148b4f679e5a_Container-6-p-500.png 500w, /ces/img/698d75c3df8f148b4f679e5a_Container-6-p-800.png 800w, /ces/img/698d75c3df8f148b4f679e5a_Container-6-p-1080.png 1080w, /ces/img/698d75c3df8f148b4f679e5a_Container-6.png 1406w",
        "sizes": "(max-width: 1406px) 100vw, 1406px"
      },
      "lottie": "/ces/lottie/698d75bc2e86f6fa77390d85_6.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Consultants"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Professional email signatures that reinforce expertise and build client trust.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-e368070e",
          "image": {
            "src": "/ces/img/697061e54cce8de093257fe8_Card-Graphic-Container-20.avif",
            "alt": "Professional business card for Rina Alvarez, Growth Consultant at Nexro, featuring her email, website, social media icons, and a stylized photo.",
            "srcset": "/ces/img/697061e54cce8de093257fe8_Card-Graphic-Container-20-p-500.png 500w, /ces/img/697061e54cce8de093257fe8_Card-Graphic-Container-20-p-800.png 800w, /ces/img/697061e54cce8de093257fe8_Card-Graphic-Container-20.avif 1167w",
            "sizes": "(max-width: 479px) 100vw, 240px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-e368070e",
          "image": {
            "src": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif",
            "alt": "User interface showing a verification toggle, form fields for full name, title/sub title, company name, and social media icons with verification check marks including globe, Instagram, LinkedIn, Facebook, Google, X, and Spotify.",
            "srcset": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1-p-500.avif 500w, /ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif 1170w",
            "sizes": "(max-width: 991px) 100vw, 780px"
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-e368070e",
          "image": {
            "src": "/ces/img/697061e5a30f45aecadc4242_Card-Graphic-Container-21.avif",
            "alt": "Icons for Outlook, Apple, Gmail, Microsoft Edge, and Mail linked to a Nexro digital business card for Rina Alvarez, Growth Consultant, featuring her photo and social media icons.",
            "srcset": "/ces/img/697061e5a30f45aecadc4242_Card-Graphic-Container-21-p-500.png 500w, /ces/img/697061e5a30f45aecadc4242_Card-Graphic-Container-21-p-800.png 800w, /ces/img/697061e5a30f45aecadc4242_Card-Graphic-Container-21.avif 1167w",
            "sizes": "(max-width: 479px) 100vw, 240px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "CONSULTANTS SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "hl": [
            "Consultants"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d75bc1bdc05835229d13f_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d75bc87de8fe7098f6b6f_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d75bcfae33977cebfec2b_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d75bcd20adecac500a557_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d75bcdaeef322b177023d_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d75bc2e86f6fa77390d85_6.json"
        }
      ],
      "cta": {
        "href": "https://try.mailsignature.com",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://try.mailsignature.com",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "customer-support",
    "title": "Customer Support",
    "description": "Give your support team clear, consistent, and professional email signatures that improve customer trust, streamline communication, and ensure every interaction reflects your brand.",
    "hero": {
      "eyebrow": [
        "For Customer Sup port Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "div-block-603",
      "h1Class": "heading home-hero solution",
      "h1": [
        "Custom ",
        {
          "br": true
        },
        {
          "hl": [
            "Customer Support"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left",
      "paragraph": "Give your support team clear, consistent, and professional email signatures that improve customer trust, streamline communication, and ensure every interaction reflects your brand.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/698d732fe25ed5da2e5579d3_Container-10.avif",
        "alt": "Image"
      },
      "lottie": "/ces/lottie/698d72c2260b8811c154e174_2.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for",
        {
          "hl": [
            {
              "br": true
            },
            "Customer Support"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Clean, reliable email signatures for customer-facing support teams.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-aeed837b",
          "image": {
            "src": "/ces/img/697061e3bf4071dcda9e1dfc_Card-Graphic-Container-12.avif",
            "alt": "Digital business card for Sophie Turner, Senior Support Specialist at Themigon, including email, website, social media icons, and profile photo.",
            "srcset": "/ces/img/697061e3bf4071dcda9e1dfc_Card-Graphic-Container-12-p-500.png 500w, /ces/img/697061e3bf4071dcda9e1dfc_Card-Graphic-Container-12-p-800.png 800w, /ces/img/697061e3bf4071dcda9e1dfc_Card-Graphic-Container-12.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-aeed837b",
          "image": {
            "src": "/ces/img/696e1b83a1638b77a692f535_Card-Graphic-Container-2.avif",
            "alt": "User interface showing a toggle for verification, input fields for full name, title, and company name, and social media icon options with some selected."
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-aeed837b",
          "image": {
            "src": "/ces/img/697061e3de44c6f471f2d114_Card-Graphic-Container-13.avif",
            "alt": "Integration icons for Outlook, Apple, Gmail, Microsoft Edge, and Mail apps with text showing Sophie Turner, Senior Support Specialist at Themigon.",
            "srcset": "/ces/img/697061e3de44c6f471f2d114_Card-Graphic-Container-13-p-500.png 500w, /ces/img/697061e3de44c6f471f2d114_Card-Graphic-Container-13-p-800.png 800w, /ces/img/697061e3de44c6f471f2d114_Card-Graphic-Container-13.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "CUSTOMER SUPPORT SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "br": true
        },
        {
          "hl": [
            "Customer Support"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d72c2de61fa88e04c12d5_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d72c2260b8811c154e174_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d72c2c1ff1369555abb08_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d72c2d32e7c436624ab58_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d72c276c292281df6aff4_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d72c28c875ef6efa9461c_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://try.mailsignature.com",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "education-schools-universities",
    "title": "Education (Schools & Universities)",
    "description": "Create unified, professional email signatures for teachers, faculty, and administrative teams. Improve communication and maintain consistent branding.",
    "hero": {
      "eyebrow": [
        "For Education Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution horizontal",
      "h1": [
        "Custom ",
        {
          "hl": [
            "Education"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Create unified, professional email signatures for teachers, faculty, and administrative teams. Improve communication, build trust with students and parents, and maintain consistent branding across your entire institution.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/6979bb1b7fb929dbd24aa9a1_Container.avif",
        "alt": "Image"
      },
      "lottie": "/ces/lottie/697b3619c05aa055486f59be_2-British-Academy.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container solution",
      "headingBlockClass": "heading_block fix-width",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Education"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Consistent, professional signatures for educators, institutions, and academic teams.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-5a7f144b",
          "image": {
            "src": "/ces/img/697061e34f80c5d70487d3a5_Card-Graphic-Container-3.avif",
            "alt": "Email signature card for Olivia Smith, Program Coordinator at The British Academy with social media icons and website link.",
            "srcset": "/ces/img/697061e34f80c5d70487d3a5_Card-Graphic-Container-3-p-500.png 500w, /ces/img/697061e34f80c5d70487d3a5_Card-Graphic-Container-3-p-800.png 800w, /ces/img/697061e34f80c5d70487d3a5_Card-Graphic-Container-3.avif 1167w",
            "sizes": "100vw"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-5a7f144b",
          "image": {
            "src": "/ces/img/696e1b83a1638b77a692f535_Card-Graphic-Container-2.avif",
            "alt": "User interface showing a toggle for verification, input fields for full name, title, and company name, and social media icon options with some selected."
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-5a7f144b",
          "image": {
            "src": "/ces/img/697061e2f6a67f33323fe138_Card-Graphic-Container-5.avif",
            "alt": "User profile card for Olivia Smith from The British Academy, Program Coordinator, with icons for Outlook, Apple, Gmail, Microsoft Edge, Mail, and 1000+ integrations above.",
            "srcset": "/ces/img/697061e2f6a67f33323fe138_Card-Graphic-Container-5-p-500.png 500w, /ces/img/697061e2f6a67f33323fe138_Card-Graphic-Container-5-p-800.png 800w, /ces/img/697061e2f6a67f33323fe138_Card-Graphic-Container-5-p-1080.png 1080w, /ces/img/697061e2f6a67f33323fe138_Card-Graphic-Container-5.avif 1167w",
            "sizes": "100vw"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "EDUCATION SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "hl": [
            "Education"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/697b36199f79a5b97fdbe2c3_1-Educate.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/697b3619c05aa055486f59be_2-British-Academy.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/697b36196f8761823e6c786f_3-Edurio.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/697b36198419aa5929daae22_4-Cousilo.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/697b36199fb7b074a676092e_5-Firstup.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/697b3619df58ada7ee666ad9_6-Ascent.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "entrepreneurs",
    "title": "Entrepreneurs",
    "description": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
    "hero": {
      "eyebrow": [
        "For Entrepreneurs Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution",
      "h1": [
        "Custom ",
        {
          "br": true
        },
        {
          "hl": [
            "Entrepreneurs"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/698d7a2e530e14edd3825cb4_Container-8.png",
        "alt": "Image"
      },
      "lottie": "/ces/lottie/698d7a1a46034380c44ffa88_5.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Entrepreneurs"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Flexible, modern email signatures designed for founders and growing businesses.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-5325ccf5",
          "image": {
            "src": "/ces/img/697061e555899b9e5ae39dce_Card-Graphic-Container-24.avif",
            "alt": "Digital business card for Ethan Rowe, tech entrepreneur at Virion, showing social media icons, email, and website with a portrait photo.",
            "srcset": "/ces/img/697061e555899b9e5ae39dce_Card-Graphic-Container-24-p-500.png 500w, /ces/img/697061e555899b9e5ae39dce_Card-Graphic-Container-24-p-800.png 800w, /ces/img/697061e555899b9e5ae39dce_Card-Graphic-Container-24.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-5325ccf5",
          "image": {
            "src": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif",
            "alt": "User interface showing a verification toggle, form fields for full name, title/sub title, company name, and social media icons with verification check marks including globe, Instagram, LinkedIn, Facebook, Google, X, and Spotify.",
            "srcset": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1-p-500.avif 500w, /ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif 1170w",
            "sizes": "(max-width: 1170px) 100vw, 1170px"
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-5325ccf5",
          "image": {
            "src": "/ces/img/697061e51c1afa99e62c7a79_Card-Graphic-Container-25.avif",
            "alt": "Profile card of Ethan Rowe, tech entrepreneur with verified badge, connected to Outlook, Apple Mail, Gmail, Microsoft Edge, Mail app, and 1000+ email platforms.",
            "srcset": "/ces/img/697061e51c1afa99e62c7a79_Card-Graphic-Container-25-p-500.png 500w, /ces/img/697061e51c1afa99e62c7a79_Card-Graphic-Container-25-p-800.png 800w, /ces/img/697061e51c1afa99e62c7a79_Card-Graphic-Container-25.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "ENTREPRENEURS SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "hl": [
            "Entrepreneurs"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d7a196f9829db747674d4_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d7a19fb8a1d26a927ec9a_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d7a1ac60fd619c495ed05_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d7a198c875ef6efaa520c_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d7a1a46034380c44ffa88_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d7a1a614a5f0986da71f0_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "finance-banking",
    "title": "Finance & Banking",
    "description": "Professional, compliant email signatures for financial advisors, bankers, and corporate teams. Build trust with clean, consistent communication.",
    "hero": {
      "eyebrow": [
        "For Finance & Banking Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution",
      "h1": [
        "Custom",
        {
          "hl": [
            "Finance & Banking"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Create professional, compliant signatures for financial advisors, bankers, and corporate teams. Build trust, maintain strict branding standards, and enhance every client interaction with clean, consistent communication.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/698420113f568b003ae94a06_Container-2.avif",
        "alt": "Image",
        "srcset": "/ces/img/698420113f568b003ae94a06_Container-2-p-500.png 500w, /ces/img/698420113f568b003ae94a06_Container-2.avif 1326w",
        "sizes": "100vw"
      },
      "lottie": "/ces/lottie/69807ce4158309df6edc2a71_2.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for",
        {
          "br": true
        },
        {
          "hl": [
            "Finance & Banking"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Secure, professional email signatures designed for finance and banking teams.",
      "cards": [
        {
          "wrapperClass": "img-wraper auto",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-a866f5c8",
          "image": {
            "src": "/ces/img/697061e38ee3be7717c9a18e_Card-Graphic-Container.avif",
            "alt": "FinanceLab X email signature card for Sarah Williams, Chartered Accountant, with social media icons and a stylized portrait on the right.",
            "srcset": "/ces/img/697061e38ee3be7717c9a18e_Card-Graphic-Container-p-500.png 500w, /ces/img/697061e38ee3be7717c9a18e_Card-Graphic-Container-p-800.png 800w, /ces/img/697061e38ee3be7717c9a18e_Card-Graphic-Container.avif 1167w",
            "sizes": "100vw"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper auto2",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-a866f5c8",
          "image": {
            "src": "/ces/img/696e1b83a1638b77a692f535_Card-Graphic-Container-2.avif",
            "alt": "User interface showing a toggle for verification, input fields for full name, title, and company name, and social media icon options with some selected."
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper auto",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-a866f5c8",
          "image": {
            "src": "/ces/img/697061e3a26bfb27e5ca92f1_Card-Graphic-Container-2.avif",
            "alt": "Integration icons of Outlook, Apple, Gmail, Microsoft Edge, Mail, and 1000+ others linked to FinanceLab X digital business card for Sarah Williams, Chartered Accountant.",
            "srcset": "/ces/img/697061e3a26bfb27e5ca92f1_Card-Graphic-Container-2-p-500.png 500w, /ces/img/697061e3a26bfb27e5ca92f1_Card-Graphic-Container-2-p-800.png 800w, /ces/img/697061e3a26bfb27e5ca92f1_Card-Graphic-Container-2-p-1080.png 1080w, /ces/img/697061e3a26bfb27e5ca92f1_Card-Graphic-Container-2.avif 1167w",
            "sizes": "100vw"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FINANCE & BANKING SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "br": true
        },
        {
          "hl": [
            "Finance & Banking"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "A clean, compliant, and trust-focused email signature designed for financial communication.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807ce49f0c4ee2b3009a00_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807ce4158309df6edc2a71_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807ce46e8c903cff3413d2_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807ce439ae0a8bc722052b_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807ce46381be35bb8e2d4e_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807ce421f90c643e8b3331_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started",
          {
            "br": true
          }
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "freelancers",
    "title": "Freelancers",
    "description": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
    "hero": {
      "eyebrow": [
        "For Freelancers Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution",
      "h1": [
        "Custom ",
        {
          "br": true
        },
        {
          "hl": [
            "Freelancers"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/698d798da9e911c2d1392d10_Container-7.png",
        "alt": "Image",
        "srcset": "/ces/img/698d798da9e911c2d1392d10_Container-7-p-500.png 500w, /ces/img/698d798da9e911c2d1392d10_Container-7-p-800.png 800w, /ces/img/698d798da9e911c2d1392d10_Container-7-p-1080.png 1080w, /ces/img/698d798da9e911c2d1392d10_Container-7.png 1406w",
        "sizes": "(max-width: 1406px) 100vw, 1406px"
      },
      "lottie": "/ces/lottie/698d79b8a6c253ec309b8c87_6.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Freelancers"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Smart signature solutions built for growing brokerages and multi-agent teams.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-4cb5c433",
          "image": {
            "src": "/ces/img/697061e579043062c221da65_Card-Graphic-Container-22.avif",
            "alt": "Business card for Claire Donovan, Marketing Consultant at Rylin, with social media icons on the left and her portrait on the right.",
            "srcset": "/ces/img/697061e579043062c221da65_Card-Graphic-Container-22-p-500.png 500w, /ces/img/697061e579043062c221da65_Card-Graphic-Container-22-p-800.png 800w, /ces/img/697061e579043062c221da65_Card-Graphic-Container-22.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-4cb5c433",
          "image": {
            "src": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif",
            "alt": "User interface showing a verification toggle, form fields for full name, title/sub title, company name, and social media icons with verification check marks including globe, Instagram, LinkedIn, Facebook, Google, X, and Spotify.",
            "srcset": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1-p-500.avif 500w, /ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif 1170w",
            "sizes": "(max-width: 1170px) 100vw, 1170px, 100vw"
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-4cb5c433",
          "image": {
            "src": "/ces/img/697061e5f91db0f728d8f559_Card-Graphic-Container-23.avif",
            "alt": "Integration icons for Outlook, Apple, Gmail, Microsoft Edge, and email, connected to a digital business card showing Claire Donovan, Marketing Consultant at Rylin.",
            "srcset": "/ces/img/697061e5f91db0f728d8f559_Card-Graphic-Container-23-p-500.png 500w, /ces/img/697061e5f91db0f728d8f559_Card-Graphic-Container-23-p-800.png 800w, /ces/img/697061e5f91db0f728d8f559_Card-Graphic-Container-23.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FREELANCERS SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "hl": [
            "Freelancers"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d79b7f23784ce4dd988a4_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d79b7bba070847d4c0165_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d79b7cbf254544c0b1da1_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d79b7457bfc5cecab0373_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d79b8a5964aceae4ec731_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d79b8a6c253ec309b8c87_6.json"
        }
      ],
      "cta": {
        "href": "https://try.mailsignature.com",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://try.mailsignature.com",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": true,
    "solutionCta": null,
    "faq": FAQ_1
  },
  {
    "slug": "healthcare",
    "title": "Healthcare",
    "description": "Professional, compliant email signatures for doctors, nurses, and clinic staff. Improve patient communication and maintain consistent branding.",
    "hero": {
      "eyebrow": [
        "For Healthcare Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution",
      "h1": [
        "Custom",
        {
          "br": true
        },
        {
          "hl": [
            "Healthcare"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Create professional, compliant signatures for doctors, nurses, and clinic staff. Improve patient communication, reinforce trust, and maintain consistent branding across your entire healthcare organization.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/69842011e8a7e703aa78b9f1_Container-1.avif",
        "alt": "Image",
        "srcset": "/ces/img/69842011e8a7e703aa78b9f1_Container-1-p-500.png 500w, /ces/img/69842011e8a7e703aa78b9f1_Container-1.avif 1286w",
        "sizes": "(max-width: 1286px) 100vw, 1286px"
      },
      "lottie": "/ces/lottie/69807c8ec78600b28d94eca0_6.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container solution",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Healthcare"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Smart, compliant email signatures built for healthcare teams and patient communication.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-ce70fd74",
          "image": {
            "src": "/ces/img/697060591dee43bec744d738_Card-Graphic-Container.avif",
            "alt": "Professional card showing Dr. Olivia White, Senior Physiotherapist at Lunira Health Care, with social media icons and contact info.",
            "srcset": "/ces/img/697060591dee43bec744d738_Card-Graphic-Container-p-500.png 500w, /ces/img/697060591dee43bec744d738_Card-Graphic-Container-p-800.png 800w, /ces/img/697060591dee43bec744d738_Card-Graphic-Container.avif 1170w",
            "sizes": "100vw"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-ce70fd74",
          "image": {
            "src": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif",
            "alt": "User interface showing a verification toggle, form fields for full name, title/sub title, company name, and social media icons with verification check marks including globe, Instagram, LinkedIn, Facebook, Google, X, and Spotify.",
            "srcset": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1-p-500.avif 500w, /ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif 1170w",
            "sizes": "100vw"
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-ce70fd74",
          "image": {
            "src": "/ces/img/69706059dce86767b48ba540_Card-Graphic-Container-2.avif",
            "alt": "Icons of email and app platforms Outlook, Apple, Gmail, Microsoft Edge, Mail, and a label showing 1000+ connected to a Lunira digital business card for Dr. Olivia White, Senior Physiotherapist.",
            "srcset": "/ces/img/69706059dce86767b48ba540_Card-Graphic-Container-2-p-500.png 500w, /ces/img/69706059dce86767b48ba540_Card-Graphic-Container-2-p-800.png 800w, /ces/img/69706059dce86767b48ba540_Card-Graphic-Container-2-p-1080.png 1080w, /ces/img/69706059dce86767b48ba540_Card-Graphic-Container-2.avif 1170w",
            "sizes": "100vw"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container solution",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "HEALTHCARE SIGNATURE PREVIEW",
        {
          "br": true
        }
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Healthcare"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807c8ea096f552079b19c9_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807c8e9f29c66f643a7b92_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807c8eefaf8f18efd32198_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807c8eb1dad7dd83633467_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807c8ebd4c961df5391d2f_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807c8ec78600b28d94eca0_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "hr-admin",
    "title": "HR & Admin",
    "description": "Create clean, consistent, and professional email signatures for HR and administrative teams. Strengthen internal communication, standardize company branding, and ensure every message looks polished and reliable.",
    "hero": {
      "eyebrow": [
        "For HR & Admin Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution",
      "h1": [
        "Custom ",
        {
          "br": true
        },
        {
          "hl": [
            "HR & Admin"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Create clean, consistent, and professional email signatures for HR and administrative teams. Strengthen internal communication, standardize company branding, and ensure every message looks polished and reliable.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/698d727e066ef1427cb42376_Container.avif",
        "alt": "Image",
        "srcset": "/ces/img/698d727e066ef1427cb42376_Container-p-500.png 500w, /ces/img/698d727e066ef1427cb42376_Container.avif 1386w",
        "sizes": "100vw"
      },
      "lottie": "/ces/lottie/698d5f55fc560e572ffba4b8_6.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container solution",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2 fix-width",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for",
        {
          "br": true
        },
        "‍",
        {
          "hl": [
            "HR & Admin"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Smart signature solutions built for growing brokerages and multi-agent teams.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-57fcaaad",
          "image": {
            "src": "/ces/img/697061e325ad94b5c8f75943_Card-Graphic-Container-10.avif",
            "alt": "Business card for Chloe Rivera, HR Business Partner at Hirely, showing email, website, social media icons, and a stylized photo of a smiling woman.",
            "srcset": "/ces/img/697061e325ad94b5c8f75943_Card-Graphic-Container-10-p-500.png 500w, /ces/img/697061e325ad94b5c8f75943_Card-Graphic-Container-10-p-800.png 800w, /ces/img/697061e325ad94b5c8f75943_Card-Graphic-Container-10.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-57fcaaad",
          "image": {
            "src": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif",
            "alt": "User interface showing a verification toggle, form fields for full name, title/sub title, company name, and social media icons with verification check marks including globe, Instagram, LinkedIn, Facebook, Google, X, and Spotify.",
            "srcset": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1-p-500.avif 500w, /ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif 1170w",
            "sizes": "(max-width: 1170px) 100vw, 1170px"
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-57fcaaad",
          "image": {
            "src": "/ces/img/697061e38574b969f639ed58_Card-Graphic-Container-11.avif",
            "alt": "HR Business Partner Chloe Rivera's digital contact card connected to Outlook, Apple, Gmail, Microsoft Edge, generic email, and 1000+ other platforms.",
            "srcset": "/ces/img/697061e38574b969f639ed58_Card-Graphic-Container-11-p-500.png 500w, /ces/img/697061e38574b969f639ed58_Card-Graphic-Container-11-p-800.png 800w, /ces/img/697061e38574b969f639ed58_Card-Graphic-Container-11-p-1080.png 1080w, /ces/img/697061e38574b969f639ed58_Card-Graphic-Container-11.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper",
      "eyebrow": [
        "HR & ADMIN SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "hl": [
            "HR & Admin"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d5f55ba3377fb40adb19d_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d5f5515387db885b8fc30_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d5f55eb5d3500058d5d84_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d5f55ada0b455853cf936_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d5f55066ef1427cb1cd6a_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d5f55fc560e572ffba4b8_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "it-operations",
    "title": "IT & Operations",
    "description": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
    "hero": {
      "eyebrow": [
        "For Customer Sup port Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution",
      "h1": [
        "Custom ",
        {
          "br": true
        },
        {
          "hl": [
            "IT & Operation"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/698d73b65010fe91fba064ec_Container-11.avif",
        "alt": "Image",
        "srcset": "/ces/img/698d73b65010fe91fba064ec_Container-11-p-500.png 500w, /ces/img/698d73b65010fe91fba064ec_Container-11.avif 1406w",
        "sizes": "100vw"
      },
      "lottie": "/ces/lottie/698d73aa260b8811c154fbc8_1.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "IT & Operation"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Centralized, easy-to-manage signatures for IT and operations teams.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-b5349c29",
          "image": {
            "src": "/ces/img/697061e3271c94333ac11118_Card-Graphic-Container-14.avif",
            "alt": "Business card for Ethan Walker, IT Manager at Markova, with social media icons and a photo of a bearded man.",
            "srcset": "/ces/img/697061e3271c94333ac11118_Card-Graphic-Container-14-p-500.png 500w, /ces/img/697061e3271c94333ac11118_Card-Graphic-Container-14-p-800.png 800w, /ces/img/697061e3271c94333ac11118_Card-Graphic-Container-14.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-b5349c29",
          "image": {
            "src": "/ces/img/696e1b83a1638b77a692f535_Card-Graphic-Container-2.avif",
            "alt": "User interface showing a toggle for verification, input fields for full name, title, and company name, and social media icon options with some selected."
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-b5349c29",
          "image": {
            "src": "/ces/img/697061e3965631270cac1a8f_Card-Graphic-Container-15.avif",
            "alt": "Digital business card for Ethan Walker, IT Manager at Markova, linked to email platforms Outlook, Apple Mail, Gmail, Microsoft Edge, and Apple Mail app, supporting 1000+ other integrations.",
            "srcset": "/ces/img/697061e3965631270cac1a8f_Card-Graphic-Container-15-p-500.png 500w, /ces/img/697061e3965631270cac1a8f_Card-Graphic-Container-15-p-800.png 800w, /ces/img/697061e3965631270cac1a8f_Card-Graphic-Container-15.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "IT & OPERATION SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "br": true
        },
        {
          "hl": [
            "IT & Operation"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d73aa260b8811c154fbc8_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d73aaffd1693bba39470c_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d73aa908ffb2b708803bb_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d73aac60fd619c4953123_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d73aaccac952cf806fb7c_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d73aaa1d4cde3d77768f8_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started",
          {
            "br": true
          }
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "lawyers",
    "title": "Lawyers",
    "description": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
    "hero": {
      "eyebrow": [
        "For Lawyers Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution horizontal",
      "h1": [
        "Custom",
        {
          "hl": [
            " Lawyers"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/698d751efc850b60259d267b_Container-5.png",
        "alt": "Image",
        "srcset": "/ces/img/698d751efc850b60259d267b_Container-5-p-500.png 500w, /ces/img/698d751efc850b60259d267b_Container-5-p-800.png 800w, /ces/img/698d751efc850b60259d267b_Container-5-p-1080.png 1080w, /ces/img/698d751efc850b60259d267b_Container-5.png 1428w",
        "sizes": "(max-width: 1428px) 100vw, 1428px"
      },
      "lottie": "/ces/lottie/698d754722e24fe925b377a5_2.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container solution",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Lawyers"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Clean, trustworthy email signatures designed for legal communication and credibility.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-c5d165a9",
          "image": {
            "src": "/ces/img/697061e585a6ff7a45e345a4_Card-Graphic-Container-18.avif",
            "alt": "Business card showing Natalie Hoffman, Corporate Lawyer at Prospect, with a sliced photo of a woman in professional attire and social media icons on the left.",
            "srcset": "/ces/img/697061e585a6ff7a45e345a4_Card-Graphic-Container-18-p-500.png 500w, /ces/img/697061e585a6ff7a45e345a4_Card-Graphic-Container-18.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-c5d165a9",
          "image": {
            "src": "/ces/img/696e1b83a1638b77a692f535_Card-Graphic-Container-2.avif",
            "alt": "User interface showing a toggle for verification, input fields for full name, title, and company name, and social media icon options with some selected."
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-c5d165a9",
          "image": {
            "src": "/ces/img/697061e587853efd737bc91a_Card-Graphic-Container-19.avif",
            "alt": "Diagram showing integration of Prospect with Outlook, Apple, Gmail, Microsoft Edge, Mail app, and over 1000 other platforms, linked to a verified profile of Natalie Hoffman, Corporate Lawyer.",
            "srcset": "/ces/img/697061e587853efd737bc91a_Card-Graphic-Container-19-p-500.png 500w, /ces/img/697061e587853efd737bc91a_Card-Graphic-Container-19-p-800.png 800w, /ces/img/697061e587853efd737bc91a_Card-Graphic-Container-19-p-1080.png 1080w, /ces/img/697061e587853efd737bc91a_Card-Graphic-Container-19.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper",
      "eyebrow": [
        "LAWYERS SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "hl": [
            "Lawyers"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d754787de8fe7098f6130_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d754722e24fe925b377a5_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d75473afc87a364c11205_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d7547cf8b1652f98430f8_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d7547d32e7c436624ec95_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d75488ee7c5658f15e2e7_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "marketers",
    "title": "Marketers",
    "description": "Promote campaigns with every email. Create branded, campaign-ready email signatures with CTAs, banners, and analytics for marketing professionals.",
    "hero": {
      "eyebrow": [
        "For Marketers Professionals"
      ],
      "spacerClasses": [
        "spacer-small",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution horizontal",
      "h1": [
        "Custom ",
        {
          "br": true
        },
        {
          "hl": [
            "Marketers"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/69954456886c88f6a42cffea_Container-4.png",
        "alt": "Image",
        "srcset": "/ces/img/69954456886c88f6a42cffea_Container-4-p-500.png 500w, /ces/img/69954456886c88f6a42cffea_Container-4-p-800.png 800w, /ces/img/69954456886c88f6a42cffea_Container-4-p-1080.png 1080w, /ces/img/69954456886c88f6a42cffea_Container-4.png 1373w",
        "sizes": "100vw"
      },
      "lottie": "/ces/lottie/699546e32a9bc1ec3e0f0251_6.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Marketers"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Branded, campaign-ready email signatures built for modern marketing teams.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-1a725c59",
          "image": {
            "src": "/ces/img/696e1b84e8b4e54ee8c7433d_Card-Graphic-Container.avif",
            "alt": "Business card for Ava Mitchell, Social Marketer at VRTX, featuring her photo, contact email, website, and social media icons.",
            "srcset": "/ces/img/696e1b84e8b4e54ee8c7433d_Card-Graphic-Container-p-500.png 500w, /ces/img/696e1b84e8b4e54ee8c7433d_Card-Graphic-Container.avif 780w",
            "sizes": "(max-width: 780px) 100vw, 780px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-1a725c59",
          "image": {
            "src": "/ces/img/696e1b83a1638b77a692f535_Card-Graphic-Container-2.avif",
            "alt": "User interface showing a toggle for verification, input fields for full name, title, and company name, and social media icon options with some selected."
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-1a725c59",
          "image": {
            "src": "/ces/img/696e1b8396e97ce0b9c7ec2c_Card-Graphic-Container-1.avif",
            "alt": "User profile card for Ava Mitchell, Social Marketer at VRTX, connected with icons for Outlook, Apple Mail, Gmail, Microsoft Edge, Email, and 1000+ other options.",
            "srcset": "/ces/img/696e1b8396e97ce0b9c7ec2c_Card-Graphic-Container-1-p-500.png 500w, /ces/img/696e1b8396e97ce0b9c7ec2c_Card-Graphic-Container-1.avif 780w",
            "sizes": "(max-width: 780px) 100vw, 780px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper",
      "eyebrow": [
        "Marketers SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "hl": [
            "Marketers"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/699546e340be65b0fc079cd9_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/699546e310f4d26e2ff0668a_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/699546e3728987997b668464_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/699546e37d7a3ebdb95a8fb0_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/699546e346ed3e55e03355a7_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/699546e32a9bc1ec3e0f0251_6.json"
        }
      ],
      "cta": null
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": true,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "marketing-creative-agencies",
    "title": "Marketing & Creative Agencies",
    "description": "Empower your creative, marketing, and digital teams with professional, on-brand email signatures. Showcase creativity, maintain brand consistency, and make every client interaction memorable.",
    "hero": {
      "eyebrow": [
        "For Agency Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution horizontal",
      "h1": [
        "Custom ",
        {
          "hl": [
            "Agency"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Empower your creative, marketing, and digital teams with professional, on-brand email signatures. Showcase creativity, maintain brand consistency, and make every client interaction memorable.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/698420110f0bdb52adeed9d6_Container-3.avif",
        "alt": "Image"
      },
      "lottie": "/ces/lottie/698423a4e1794ee02419194c_5.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container solution",
      "headingBlockClass": "heading_block fix-width",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Agency"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Branded email signatures built for fast-moving creative and digital agencies.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-c69a2674",
          "image": {
            "src": "/ces/img/697061e3e872c1465f625541_Card-Graphic-Container-1.avif",
            "alt": "Business card for Noah Wilson, UX/UI Design Lead at Dan Studio, featuring social media icons, contact email, website, and a photo of a man in a blue shirt."
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-c69a2674",
          "image": {
            "src": "/ces/img/696e1b83a1638b77a692f535_Card-Graphic-Container-2.avif",
            "alt": "User interface showing a toggle for verification, input fields for full name, title, and company name, and social media icon options with some selected."
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-c69a2674",
          "image": {
            "src": "/ces/img/697061e220b1ff0e129f7ddc_Card-Graphic-Container-4.avif",
            "alt": "Email platform icons including Outlook, Apple Mail, Gmail, Microsoft Edge, and a generic mail app connected to a UX/UI design lead profile of Noah Wilson from Dan Studio."
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper",
      "eyebrow": [
        "AGENCY SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "hl": [
            "Agency"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698423a4d33acfe298a562f1_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698423a4aaf021458d37a906_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698423a417b4e655b7fd9d56_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698423a4eac208d26935834a_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698423a4e1794ee02419194c_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698423a45ad1c6ab3ace3fed_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "marketing-teams",
    "title": "Marketing Teams",
    "description": "Equip your marketing team with consistent, brand-ready email signatures that boost campaign performance, drive traffic, and strengthen every client touchpoint.",
    "hero": {
      "eyebrow": [
        "For Marketing Team Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution",
      "h1": [
        "Custom ",
        {
          "br": true
        },
        {
          "hl": [
            "Marketing Team"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Equip your marketing team with consistent, brand-ready email signatures that boost campaign performance, drive traffic, and strengthen every client touchpoint.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/698424b313bd4859ba375722_Container-1.avif",
        "alt": "Image",
        "srcset": "/ces/img/698424b313bd4859ba375722_Container-1-p-500.png 500w, /ces/img/698424b313bd4859ba375722_Container-1.avif 1406w",
        "sizes": "100vw"
      },
      "lottie": "/ces/lottie/69842523f333bf81ad7217e5_2.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "br": true
        },
        {
          "hl": [
            "Marketing Team"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Branded, campaign-ready signatures built for modern marketing teams.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-21a1dfcb",
          "image": {
            "src": "/ces/img/697061e315ea9a2f76d8a744_Card-Graphic-Container-6.avif",
            "alt": "Business card for Michael Turner, Brand Marketing Lead at flyhead, showing social media icons and a photo of a blonde woman.",
            "srcset": "/ces/img/697061e315ea9a2f76d8a744_Card-Graphic-Container-6-p-500.png 500w, /ces/img/697061e315ea9a2f76d8a744_Card-Graphic-Container-6-p-800.png 800w, /ces/img/697061e315ea9a2f76d8a744_Card-Graphic-Container-6.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-21a1dfcb",
          "image": {
            "src": "/ces/img/696e1b83a1638b77a692f535_Card-Graphic-Container-2.avif",
            "alt": "User interface showing a toggle for verification, input fields for full name, title, and company name, and social media icon options with some selected."
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-21a1dfcb",
          "image": {
            "src": "/ces/img/697061e3a22ff47510d0eb50_Card-Graphic-Container-7.avif",
            "alt": "Integration icons for Outlook, Apple, Gmail, Microsoft Edge, and Apple Mail connecting to Michael Turner’s Flyhead brand marketing lead profile.",
            "srcset": "/ces/img/697061e3a22ff47510d0eb50_Card-Graphic-Container-7-p-500.png 500w, /ces/img/697061e3a22ff47510d0eb50_Card-Graphic-Container-7-p-800.png 800w, /ces/img/697061e3a22ff47510d0eb50_Card-Graphic-Container-7-p-1080.png 1080w, /ces/img/697061e3a22ff47510d0eb50_Card-Graphic-Container-7.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper",
      "eyebrow": [
        "MARKETING TEAM SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for",
        {
          "br": true
        },
        {
          "hl": [
            "Marketing Team"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6984252348432f2fd76ec0ac_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69842523f333bf81ad7217e5_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69842523ad0c7dc515315bb6_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6984252318043e83b4dab6ad_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6984252309f29cac1b61bd62_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69842523bffa2b95690b2138_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "personal-assistants",
    "title": "Personal Assistants",
    "description": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
    "hero": {
      "eyebrow": [
        "For Personal Assistants Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution",
      "h1": [
        "Custom ",
        {
          "br": true
        },
        {
          "hl": [
            "Personal Asistants"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
      "cta": {
        "href": "#",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/6995445597602f9e634a41bb_Container-2.png",
        "alt": "Image",
        "srcset": "/ces/img/6995445597602f9e634a41bb_Container-2-p-500.png 500w, /ces/img/6995445597602f9e634a41bb_Container-2-p-800.png 800w, /ces/img/6995445597602f9e634a41bb_Container-2-p-1080.png 1080w, /ces/img/6995445597602f9e634a41bb_Container-2.png 1366w",
        "sizes": "100vw"
      },
      "lottie": "/ces/lottie/6995460d7474d70b0e128499_3.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Personal Assistants"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Polished email signatures for managing communication on behalf of executives.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-694a2365",
          "image": {
            "src": "/ces/img/697061e6cae9454955261bcd_Card-Graphic-Container-32.avif",
            "alt": "Business card showing Isabella Reed, Virtual Assistant at NexAI, with contact info and social media icons.",
            "srcset": "/ces/img/697061e6cae9454955261bcd_Card-Graphic-Container-32-p-500.png 500w, /ces/img/697061e6cae9454955261bcd_Card-Graphic-Container-32-p-800.png 800w, /ces/img/697061e6cae9454955261bcd_Card-Graphic-Container-32.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-694a2365",
          "image": {
            "src": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif",
            "alt": "User interface showing a verification toggle, form fields for full name, title/sub title, company name, and social media icons with verification check marks including globe, Instagram, LinkedIn, Facebook, Google, X, and Spotify.",
            "srcset": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1-p-500.avif 500w, /ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif 1170w",
            "sizes": "(max-width: 1170px) 100vw, 1170px"
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-694a2365",
          "image": {
            "src": "/ces/img/697061e5be04ac5b721e25d4_Card-Graphic-Container-33.avif",
            "alt": "Email and browser icons (Outlook, Apple, Gmail, Edge, Mail) and a label showing 1000+, all connected to a digital business card for Isabella Reed, Virtual Assistant at NexAI.",
            "srcset": "/ces/img/697061e5be04ac5b721e25d4_Card-Graphic-Container-33-p-500.png 500w, /ces/img/697061e5be04ac5b721e25d4_Card-Graphic-Container-33-p-800.png 800w, /ces/img/697061e5be04ac5b721e25d4_Card-Graphic-Container-33.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper",
      "eyebrow": [
        "PERSONAL ASSISTANTS SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "br": true
        },
        {
          "hl": [
            "Personal Assistants"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995460d64855fc600887ae9_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995460d929a3390478243bd_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995460d7474d70b0e128499_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995460d46ed3e55e03340f9_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995460d95afafd55a029e12_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995460d0722d8ac688a67f9_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "real-estate-firms",
    "title": "Real Estate Firms",
    "description": "Create unified, professional email signatures for every agent in your real estate firm. Increase brand consistency and improve client communication.",
    "hero": {
      "eyebrow": [
        "For Real Estate Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution",
      "h1": [
        "Custom ",
        {
          "hl": [
            "Real Estate Firm"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Create unified, professional signatures for every agent in your firm. Increase brand consistency, improve client communication, and ensure every email reflects your agency’s identity.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/69841f27bf0ecc7c8734f87f_Container.avif",
        "alt": "Image",
        "srcset": "/ces/img/69841f27bf0ecc7c8734f87f_Container-p-500.png 500w, /ces/img/69841f27bf0ecc7c8734f87f_Container-p-800.png 800w, /ces/img/69841f27bf0ecc7c8734f87f_Container.avif 1406w",
        "sizes": "100vw"
      },
      "lottie": "/ces/lottie/69807a1b6e8c903cff3342fd_6.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for",
        {
          "br": true
        },
        "‍",
        {
          "hl": [
            "Real Estate"
          ],
          "cls": "highlight-text"
        },
        " Firm Professionals"
      ],
      "paragraph": "Smart signature solutions built for growing brokerages and multi-agent teams.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-c19770af",
          "image": {
            "src": "/ces/img/69705ca793ae75c0a900d357_Card-Graphic-Container.avif",
            "alt": "Digital business card for Noah Parker, Real Estate Coach at Archway, with social media icons and a portrait within the Archway logo.",
            "srcset": "/ces/img/69705ca793ae75c0a900d357_Card-Graphic-Container-p-500.png 500w, /ces/img/69705ca793ae75c0a900d357_Card-Graphic-Container.avif 780w",
            "sizes": "100vw"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-c19770af",
          "image": {
            "src": "/ces/img/69705ca6393d261d04a2de7a_Card-Graphic-Container-1.avif",
            "alt": "User interface with a verification toggle switch turned on, input fields for full name, title/subtitle, and company name, and selection options for banner, logo, layout, and social media icons including Instagram, LinkedIn, Facebook, Google, Twitter, and Spotify."
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-c19770af",
          "image": {
            "src": "/ces/img/69705ca6f6d7de7c0f44d672_Card-Graphic-Container-2.avif",
            "alt": "Email and web service icons including Outlook, Apple, Gmail, Microsoft Edge, and generic mail with a 1000+ badge connected above a digital business card of Noah Parker, Real Estate Coach at Archway.",
            "srcset": "/ces/img/69705ca6f6d7de7c0f44d672_Card-Graphic-Container-2-p-500.png 500w, /ces/img/69705ca6f6d7de7c0f44d672_Card-Graphic-Container-2.avif 780w",
            "sizes": "100vw"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "REAL ESTATE SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for",
        {
          "br": true
        },
        {
          "hl": [
            "Real estate"
          ],
          "cls": "highlight-text"
        },
        " firm"
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807a1b30c072255a005bc6_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807a1b720ea849f5541b15_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807a1b6a0371f50c8c24fe_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807a1b5a01f1fccbea61b5_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807a1bcfbcea406f7910fe_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/69807a1b6e8c903cff3342fd_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "supercharge-your-emails",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "supercharge-your-emails",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "realtor",
    "title": "Realtor",
    "description": "Make every email build trust, drive property inquiries, and elevate your real estate brand.",
    "hero": {
      "eyebrow": [
        "For Realtor Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "",
      "h1Class": "heading home-hero solution horizontal",
      "h1": [
        "Custom ",
        {
          "hl": [
            "Realtor"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Make every email build trust, drive property inquiries, and elevate your real estate brand.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/698d746aa67b51fce416f295_Container-12.png",
        "alt": "Image",
        "srcset": "/ces/img/698d746aa67b51fce416f295_Container-12-p-500.png 500w, /ces/img/698d746aa67b51fce416f295_Container-12-p-800.png 800w, /ces/img/698d746aa67b51fce416f295_Container-12-p-1080.png 1080w, /ces/img/698d746aa67b51fce416f295_Container-12.png 1452w",
        "sizes": "100vw"
      },
      "lottie": "/ces/lottie/698d7485085be736c077eba7_3.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container solution",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Realtor"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Professional email signatures built to showcase listings, credibility, and contact details.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-79557801",
          "image": {
            "src": "/ces/img/697061e4965631270cac1ad9_Card-Graphic-Container-16.avif",
            "alt": "Business card for Daniel Roberts, Commercial Agent at Luxey, with contact email danielroberts@luxey.com and website www.luxey.com, featuring his photo and social media icons.",
            "srcset": "/ces/img/697061e4965631270cac1ad9_Card-Graphic-Container-16-p-500.png 500w, /ces/img/697061e4965631270cac1ad9_Card-Graphic-Container-16-p-800.png 800w, /ces/img/697061e4965631270cac1ad9_Card-Graphic-Container-16.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-79557801",
          "image": {
            "src": "/ces/img/696e1b83a1638b77a692f535_Card-Graphic-Container-2.avif",
            "alt": "User interface showing a toggle for verification, input fields for full name, title, and company name, and social media icon options with some selected."
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-79557801",
          "image": {
            "src": "/ces/img/697061e488ad5e518826259b_Card-Graphic-Container-17.avif",
            "alt": "Icons for Outlook, Apple, Gmail, Microsoft Edge, mail app, and 1000+ connected apps linked to a professional profile card of Daniel Roberts, Commercial Agent at Luxey.",
            "srcset": "/ces/img/697061e488ad5e518826259b_Card-Graphic-Container-17-p-500.png 500w, /ces/img/697061e488ad5e518826259b_Card-Graphic-Container-17-p-800.png 800w, /ces/img/697061e488ad5e518826259b_Card-Graphic-Container-17.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "REALTOR SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "hl": [
            "Realtors"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d748526fab1a707dc37de_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d74854b27e45ee591d547_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d7485085be736c077eba7_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d7485b7b3f6eadf1e9e41_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d748526fab1a707dc37e1_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698d748526fad74c6e5fa4c3_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "sales-teams",
    "title": "Sales Teams",
    "description": "Give your sales team clean, high-performing email signatures that drive more calls, demos, and conversions — while keeping your brand consistent across every rep.",
    "hero": {
      "eyebrow": [
        "For Sales Team Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution",
      "h1": [
        "Custom ",
        {
          "br": true
        },
        {
          "hl": [
            "Sales Team"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Give your sales team clean, high-performing email signatures that drive more calls, demos, and conversions — while keeping your brand consistent across every rep.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/69842750fe660c53e3a84ffc_Container.avif",
        "alt": "Image",
        "srcset": "/ces/img/69842750fe660c53e3a84ffc_Container-p-500.png 500w, /ces/img/69842750fe660c53e3a84ffc_Container.avif 1398w",
        "sizes": "(max-width: 1398px) 100vw, 1398px"
      },
      "lottie": "/ces/lottie/698425e9a494ebbeaa5bdac5_2.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container solution",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2 fix-width",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Sales Team"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Email signatures designed to support outreach, trust, and conversions.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-ebae7a68",
          "image": {
            "src": "/ces/img/697061e32561c18caeb01dbe_Card-Graphic-Container-8.avif",
            "alt": "Business card for Ethan Hayes, Senior Marketing Strategist at Manila, with social media icons and a photo of a man in a suit and tie.",
            "srcset": "/ces/img/697061e32561c18caeb01dbe_Card-Graphic-Container-8-p-500.png 500w, /ces/img/697061e32561c18caeb01dbe_Card-Graphic-Container-8-p-800.png 800w, /ces/img/697061e32561c18caeb01dbe_Card-Graphic-Container-8.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-ebae7a68",
          "image": {
            "src": "/ces/img/696e1b83a1638b77a692f535_Card-Graphic-Container-2.avif",
            "alt": "User interface showing a toggle for verification, input fields for full name, title, and company name, and social media icon options with some selected."
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-ebae7a68",
          "image": {
            "src": "/ces/img/697061e3f084b32bbb4d716f_Card-Graphic-Container-9.avif",
            "alt": "Email account integration icons including Outlook, Apple Mail, Gmail, Microsoft Edge, Mail app, and a label for 1000+ connections above a profile card for Ethan Hayes, Senior Marketing Strategist at Manila.",
            "srcset": "/ces/img/697061e3f084b32bbb4d716f_Card-Graphic-Container-9-p-500.png 500w, /ces/img/697061e3f084b32bbb4d716f_Card-Graphic-Container-9-p-800.png 800w, /ces/img/697061e3f084b32bbb4d716f_Card-Graphic-Container-9-p-1080.png 1080w, /ces/img/697061e3f084b32bbb4d716f_Card-Graphic-Container-9.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "SALES TEAM SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "hl": [
            "Sales Team"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698425c06cd22438f0ba1326_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698425e9a494ebbeaa5bdac5_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698425e9c97d0bee3b52a49c_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698425c0bb92faec45dd86ff_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698425e995f888661dd63405_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/698425e960eeb9c804d88e93_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "students",
    "title": "Students",
    "description": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
    "hero": {
      "eyebrow": [
        "For Students Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution",
      "h1": [
        "Custom ",
        {
          "br": true
        },
        {
          "hl": [
            "Students"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
      "cta": {
        "href": "#",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/6995445648370ef6ac16ad77_Container-1.png",
        "alt": "Image"
      },
      "lottie": "/ces/lottie/6995459de2b6c1795540301c_5.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container solution",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Students"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Smart signature solutions built for growing brokerages and multi-agent teams.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-dcbf0f0f",
          "image": {
            "src": "/ces/img/697061e557872f968b2967dd_Card-Graphic-Container-30.avif",
            "alt": "Digital business card for Theo Lawson, engineering student at Edupro, showing social media icons, email, website, and a portrait photo.",
            "srcset": "/ces/img/697061e557872f968b2967dd_Card-Graphic-Container-30-p-500.png 500w, /ces/img/697061e557872f968b2967dd_Card-Graphic-Container-30.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-dcbf0f0f",
          "image": {
            "src": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif",
            "alt": "User interface showing a verification toggle, form fields for full name, title/sub title, company name, and social media icons with verification check marks including globe, Instagram, LinkedIn, Facebook, Google, X, and Spotify.",
            "srcset": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1-p-500.avif 500w, /ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif 1170w",
            "sizes": "(max-width: 1170px) 100vw, 1170px"
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-dcbf0f0f",
          "image": {
            "src": "/ces/img/697061e563dd0fa4c1490658_Card-Graphic-Container-31.avif",
            "alt": "Digital card for Theo Lawson from elearna showing integration with email platforms including Outlook, Apple Mail, Gmail, Microsoft Edge, and 1000+ others.",
            "srcset": "/ces/img/697061e563dd0fa4c1490658_Card-Graphic-Container-31-p-500.png 500w, /ces/img/697061e563dd0fa4c1490658_Card-Graphic-Container-31-p-800.png 800w, /ces/img/697061e563dd0fa4c1490658_Card-Graphic-Container-31.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "STUDENTS SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "hl": [
            "Students"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995459d9289fe67d593dcda_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995459d43fe6bde320ce4aa_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995459d200d7499cd108d20_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995459d46bc72ca429565e8_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995459de2b6c1795540301c_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/6995459d14cbdc646e75c3fe_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": false,
    "solutionCta": {
      "h2Class": "heading-style-h2 text-color cta",
      "heading": [
        "Ready to Create Your ",
        {
          "hl": [
            "Professional "
          ],
          "cls": "highlight-text"
        },
        "Email Signature?"
      ],
      "paragraph": "Design a clean, consistent signature that strengthens your brand, improves communication, and works perfectly across every device and email platform.",
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Create Your Signature"
        ],
        "chevron": false
      }
    },
    "faq": FAQ_1
  },
  {
    "slug": "teachers",
    "title": "Teachers",
    "description": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
    "hero": {
      "eyebrow": [
        "For Teachers Professionals"
      ],
      "spacerClasses": [
        "spacer-custom1",
        "spacer-custom1",
        "spacer-custom1 _40px"
      ],
      "headingWrapClass": "solution-heading-wrap",
      "h1Class": "heading home-hero solution horizontal",
      "h1": [
        "Custom ",
        {
          "br": true
        },
        {
          "hl": [
            "Teachers"
          ],
          "cls": "highlight-text"
        }
      ],
      "h2Class": "heading home-hero solution",
      "h2": "Email Signature",
      "paragraphClass": "text-size-medium text-align-left aligh-center",
      "paragraph": "Give your IT and operations teams secure, consistent, and professional e-signatures that strengthen communication, reduce confusion, and keep your organization aligned across every technical interaction.",
      "cta": {
        "href": "#",
        "label": [
          "Get Started"
        ],
        "chevron": false
      },
      "subline": "Explore 100+ realtor-ready designs.",
      "image": {
        "src": "/ces/img/69954455450acb9c17454caf_Container.png",
        "alt": "Image"
      },
      "lottie": "/ces/lottie/699545018b3a30e2efea2861_2.json"
    },
    "features": {
      "id": "deliverability",
      "headerClass": "section_header_container solution",
      "headingBlockClass": "heading_block",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "FEATURES"
      ],
      "heading": [
        "Signature Features for ",
        {
          "hl": [
            "Teachers"
          ],
          "cls": "highlight-text"
        },
        " Professionals"
      ],
      "paragraph": "Clean, professional signatures for educators, schools, and academic communication.",
      "cards": [
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-_89bd7328-a032-98e3-8cd2-625b6eeb782c-967153cc",
          "image": {
            "src": "/ces/img/697061e5ed7a560ad19f9e65_Card-Graphic-Container-28.avif",
            "alt": "Digital business card for Mara Collins, Sociality Teacher at Momo, with stylized portrait and social media icons on the left.",
            "srcset": "/ces/img/697061e5ed7a560ad19f9e65_Card-Graphic-Container-28-p-500.png 500w, /ces/img/697061e5ed7a560ad19f9e65_Card-Graphic-Container-28-p-800.png 800w, /ces/img/697061e5ed7a560ad19f9e65_Card-Graphic-Container-28.avif 1167w",
            "sizes": "(max-width: 1167px) 100vw, 1167px"
          },
          "title": "Professional, On-Brand Signatures",
          "body": "Create clean, consistent signatures that match your brand across every team and device."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-ecec7046-f11e-7db2-036f-5ef91ba99439-967153cc",
          "image": {
            "src": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif",
            "alt": "User interface showing a verification toggle, form fields for full name, title/sub title, company name, and social media icons with verification check marks including globe, Instagram, LinkedIn, Facebook, Google, X, and Spotify.",
            "srcset": "/ces/img/69706059bae495656d813108_Card-Graphic-Container-1-p-500.avif 500w, /ces/img/69706059bae495656d813108_Card-Graphic-Container-1.avif 1170w",
            "sizes": "(max-width: 1170px) 100vw, 1170px"
          },
          "title": "Easy Editing & Management",
          "body": "Update names, styles, images, and details instantly — no coding or technical setup required."
        },
        {
          "wrapperClass": "img-wraper",
          "gridId": "w-node-c529ce92-87cd-97b9-6799-8391b30b492c-967153cc",
          "image": {
            "src": "/ces/img/697061e557d64d2de4b4b5bf_Card-Graphic-Container-29.avif",
            "alt": "User profile card for Mara Collins, Sociality Teacher at OMIA, showing verified badge and icons for Outlook, Apple, Gmail, Microsoft Edge, an email app, and 1000+ other integrations.",
            "srcset": "/ces/img/697061e557d64d2de4b4b5bf_Card-Graphic-Container-29-p-500.png 500w, /ces/img/697061e557d64d2de4b4b5bf_Card-Graphic-Container-29-p-800.png 800w, /ces/img/697061e557d64d2de4b4b5bf_Card-Graphic-Container-29.avif 1168w",
            "sizes": "(max-width: 1168px) 100vw, 1168px"
          },
          "title": "Works Anywhere",
          "body": "Optimized for Gmail, Outlook, Apple Mail, and mobile — your signature always looks perfect."
        }
      ]
    },
    "topUsers": {
      "headerClass": "section_header_container",
      "h2Class": "heading-style-h2",
      "paragraphClass": "paragraph_wrapper no-wrap",
      "eyebrow": [
        "TEACHERS SIGNATURE PREVIEW"
      ],
      "heading": [
        "Signature Style for ",
        {
          "hl": [
            "Teachers"
          ],
          "cls": "highlight-text"
        }
      ],
      "paragraph": "A modern, trustworthy signature that helps clients take action faster.",
      "items": [
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/699544e995ada842635f0a74_1.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/699545018b3a30e2efea2861_2.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/699544e9333ee5c7b5d423d5_3.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/699544e9f31fab1bb14b6f20_4.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/699544e97bb14e85be3a53b9_5.json"
        },
        {
          "cta": {
            "href": "https://app.mailsignature.com/signup",
            "label": [
              "Try For Free"
            ],
            "chevron": true
          },
          "lottie": "/ces/lottie/699544e985a59098542eb5fc_6.json"
        }
      ],
      "cta": {
        "href": "https://app.mailsignature.com/signup",
        "label": [
          "Get Started"
        ],
        "chevron": false
      }
    },
    "core": [
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "ALL-IN-ONE SIGNATURE"
        ],
        "heading": [
          "Everything You Need in One Signature"
        ],
        "paragraph": "Signature templates designed for dynamic, agency-level branding needs.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696ddc003f6f0035d4b1881a_Drag-and-Drop-Icon.avif",
              "alt": "Icon representing drag and drop functionality with four arrows pointing outward."
            },
            "title": "Drag-and-Drop Editor",
            "body": "Build your signature visually — no design skills needed."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbffa4ece1d9babc7fda_Mobile-Responsive-Icon.png",
              "alt": "Icon of a smartphone with a small dot and minus symbol on the screen representing mobile responsiveness."
            },
            "title": "Mobile Responsive",
            "body": "Looks perfect on every device and email client."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Add Social Links & WhatsApp",
            "body": "Let clients contact you instantly through their preferred channel."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Click Tracking & Analytics",
            "body": "See which CTAs get the most clicks and optimize your signature."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Branded Colors & Fonts",
            "body": "Match your agency identity in seconds."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Central Team Management",
            "body": "Update and sync signatures for every agent from one dashboard."
          }
        ],
        "cta": null
      },
      {
        "wrapperClass": "core-feature-section",
        "paddingGlobal": false,
        "headerClass": "section_header_container solution",
        "h2Class": "heading-style-h2",
        "paragraphClass": "paragraph_wrapper no-wrap",
        "eyebrow": [
          "CORE FEATURES"
        ],
        "heading": [
          "Core Features That Power Every Email Signature"
        ],
        "paragraph": "Everything you need to create, manage, and scale professional email signatures - built for teams, businesses, and professionals across industries.",
        "cards": [
          {
            "icon": {
              "src": "/ces/img/696de1c659bef5f1c51bfe64_Drag-and-Drop-Icon.avif",
              "alt": "White icon of four arrows pointing outward indicating drag and drop functionality on a dark background."
            },
            "title": "Centralized Signature Management",
            "body": "Create, update, and manage all email signatures from one dashboard without manual edits."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc003ee370e920c7cad8_Branded-Colors-Icon.avif",
              "alt": "Icon showing a color palette with three swatches representing branded colors."
            },
            "title": "Brand-Consistent Design",
            "body": "Apply logos, brand colors, fonts, and layouts across every signature effortlessly."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00d59c3043c4633d8f_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three stylized human figures connected by a circular line, representing team management or collaboration."
            },
            "title": "Team & Role-Based Signatures",
            "body": "Assign different signature templates by role, department, or team while keeping control."
          },
          {
            "icon": {
              "src": "/ces/img/696ddc00bce68f2a17a5a9e6_Add-Social-Links-Icon.avif",
              "alt": "White icon with a plus sign and network nodes symbolizing adding social links on a dark background."
            },
            "title": "Clickable CTAs & Banners",
            "body": "Turn every email into an engagement channel with buttons, banners, and links."
          },
          {
            "icon": {
              "src": "/ces/img/696ddbff13e832bcb97fc3f9_Click-Tracking-Icon.png",
              "alt": "Icon of a bar chart with four ascending bars representing click tracking."
            },
            "title": "Analytics & Click Tracking",
            "body": "Track clicks on links and CTAs to measure engagement and optimize performance."
          },
          {
            "icon": {
              "src": "/ces/img/696de1c6a3e58af5a5381f39_Central-Team-Management-Icon.avif",
              "alt": "Icon depicting three people connected to a central gear representing team management."
            },
            "title": "Email Client Compatibility",
            "body": "Fully compatible with Gmail, Outlook, Apple Mail, and mobile email clients."
          }
        ],
        "cta": {
          "href": "https://app.mailsignature.com/signup",
          "label": [
            "Create Your Custom Email Signature"
          ],
          "chevron": true
        }
      }
    ],
    "usesSharedCta": true,
    "solutionCta": null,
    "faq": FAQ_1
  },
];

export const solutionSlugs: string[] = solutions.map((s) => s.slug);

const bySlug = new Map(solutions.map((s) => [s.slug, s]));

export function getSolution(slug: string): Solution | undefined {
  return bySlug.get(slug);
}
