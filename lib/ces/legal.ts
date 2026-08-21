// Verbatim body copy for the four legal pages, lifted from the original Webflow
// markup (docs/research/raw/pages/{privacypolicy,terms-of-use,cookies-policy,
// user-data-deletion}.html). Only the brand name and domain are substituted per
// docs/research/BUILDER_BRIEF.md — no clause is summarised, reordered or dropped.
//
// Content is stored as a structured element tree (never an HTML string), so
// CesLegalPage can render it with real React elements while reproducing the
// original DOM and its class names exactly.

export type LegalNode = string | LegalElement;

export interface LegalElement {
  tag: "div" | "p" | "ul" | "ol" | "li" | "span" | "strong" | "a" | "br";
  className?: string;
  id?: string;
  role?: string;
  href?: string;
  children?: LegalNode[];
}

export interface LegalAnchorLink {
  href: string;
  label: string;
}

export interface LegalPageContent {
  /** Text of the eyebrow chip above the H1. */
  tagLabel: LegalNode[];
  /** Inner content of the H1. */
  heading: LegalNode[];
  /** Optional lead paragraph under the H1 (only user-data-deletion has one). */
  heroParagraph?: LegalNode[];
  /** The in-page jump list rendered in the left column. */
  links: LegalAnchorLink[];
  /** The document body, one node per top-level block. */
  body: LegalNode[];
}

export const privacyPolicyContent: LegalPageContent = {
  "tagLabel": [
    "Terms of Use",
    {
      "tag": "br"
    }
  ],
  "heading": [
    "Privacy Policy"
  ],
  "links": [
    {
      "href": "#Personal-Identification-Information",
      "label": "Personal Identification Information"
    },
    {
      "href": "#Non-Personal-Identification-Information",
      "label": "Non-Personal Identification Information"
    },
    {
      "href": "#Web-Browser-Cookies",
      "label": "Web Browser Cookies"
    },
    {
      "href": "#How-We-Use-Collected-Information",
      "label": "How We Use Collected Information"
    },
    {
      "href": "#Use-of-Google-Workspace-API-Data",
      "label": "Use of Google Workspace API Data"
    },
    {
      "href": "#Retention-and-Deletion-of-User-Data",
      "label": "Retention and Deletion of User Data"
    },
    {
      "href": "#How-We-Protect-Your-Information",
      "label": "How We Protect Your Information"
    },
    {
      "href": "#Sharing-Your-Personal-Information",
      "label": "Sharing Your Personal Information"
    },
    {
      "href": "#Changes-to-This-Privacy-Policy",
      "label": "Changes to This Privacy Policy"
    },
    {
      "href": "#Your-Rights",
      "label": "Your Rights"
    },
    {
      "href": "#Contact-Information",
      "label": "Contact Information"
    }
  ],
  "body": [
    {
      "tag": "div",
      "className": "text-size-regular",
      "children": [
        "This privacy policy governs the manner in which Mail Signature collects, uses, maintains, and discloses information collected from users (each, a \"User\") of the mailsignature.com website (\"Site\"). This privacy policy applies to the Site and all products and services offered by Mail Signature."
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Personal-Identification-Information",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Personal Identification Information"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our Site, register on the Site, place an order, fill out a form, respond to a survey, and in connection with other activities, services, features, or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, mailing address, phone number, and credit card information. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personal identification information, except that it may prevent them from engaging in certain Site-related activities."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Non-Personal-Identification-Information",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Non-Personal Identification Information"
          ]
        },
        {
          "tag": "div",
          "className": "p-wrap",
          "children": [
            {
              "tag": "p",
              "className": "text-size-regular",
              "children": [
                "We may collect non-personal identification information about Users whenever they interact with our Site. Non-personal identification information may include the browser name, the type of computer, and technical information about Users' means of connection to our Site, such as the operating system and the Internet service providers utilized and other similar information."
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Web-Browser-Cookies",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Web Browser Cookies"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Our Site may use \"cookies\" to enhance the User experience. The User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. Users may choose to set their web browser to refuse cookies or to alert them when cookies are being sent. If they do so, note that some parts of the Site may not function properly."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "How-We-Use-Collected-Information",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "How We Use Collected Information"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Mail Signature may collect and use Users' personal information for the following purposes:"
          ]
        },
        {
          "tag": "ul",
          "className": "list",
          "role": "list",
          "children": [
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "To improve customer service: "
                      ]
                    },
                    "Information you provide helps us respond to your customer service requests and support needs more efficiently."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "To personalize user experience: "
                      ]
                    },
                    "We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "To process payments: "
                      ]
                    },
                    "We may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "To send periodic emails: "
                      ]
                    },
                    "We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to inquiries, questions, and/or other requests. If User decides to opt in to our mailing list, they will receive emails that may include company news, updates, related product or service information, etc. If at any time the User would like to unsubscribe from receiving future emails, we include detailed unsubscribe instructions at the bottom of each email."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "To comply with legal obligations: "
                      ]
                    },
                    "We may use information to comply with applicable laws, regulations, and legal processes."
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Use-of-Google-Workspace-API-Data",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Use of Google Workspace API Data"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Mail Signature does not use any data obtained from Google Workspace APIs to develop, improve, or train generalized artificial intelligence (AI) or machine learning (ML) models. We do not retain, store, or repurpose user data from Google Workspace APIs for any AI-related processes. All data accessed through Google Workspace APIs is strictly used to support core product functionality as explicitly requested by the user, such as creating and managing email signatures."
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Furthermore, Google Workspace API data is not transferred, analyzed, or processed for any machine learning development, nor is it shared with any third parties for such purposes. We are fully committed to adhering to Google’s API Services User Data Policy and ensuring user data is only used for direct, user-facing functionality."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Retention-and-Deletion-of-User-Data",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Retention and Deletion of User Data"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Mail Signature retains personal and non-personal data only for as long as it is necessary to provide services to our Users or to fulfill legal or regulatory requirements. Specifically:"
          ]
        },
        {
          "tag": "ul",
          "className": "list",
          "role": "list",
          "children": [
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "Google User Data Retention: "
                      ]
                    },
                    "Google Workspace data collected via our integrations is retained only as long as required to provide the service (e.g., generating email signatures or connecting accounts). Once the service is terminated or the User revokes permissions, this data is securely deleted within 30 days."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "Deletion Requests: "
                      ]
                    },
                    "Users may request the deletion of their personal data, including Google User data, by contacting us ",
                    "at ",
                    {
                      "tag": "a",
                      "href": "mailto:support@mailsignature.com",
                      "children": [
                        "support@mailsignature.com"
                      ]
                    },
                    {
                      "tag": "br"
                    },
                    ". Upon verification of the request, we will delete the data within 30 days unless it is necessary to retain it for legitimate business or legal reasons."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "Backup Data: "
                      ]
                    },
                    "Deleted data may remain in encrypted backups for up to 90 days but will not be accessible or used for any other purpose."
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "How-We-Protect-Your-Information",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "How We Protect Your Information"
          ]
        },
        {
          "tag": "div",
          "className": "p-wrap",
          "children": [
            {
              "tag": "p",
              "className": "text-size-regular",
              "children": [
                "We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site. All sensitive and private data exchange between the Site and its Users happens over a secured SSL communication channel and is encrypted and protected with digital signatures."
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Sharing-Your-Personal-Information",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Sharing Your Personal Information"
          ]
        },
        {
          "tag": "p",
          "className": "text-size-regular",
          "children": [
            "We do not sell, trade, or rent Users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and Users with our business partners, trusted affiliates, and advertisers for the purposes outlined above."
          ]
        },
        {
          "tag": "p",
          "className": "text-size-regular",
          "children": [
            "We may share User data with third-party service providers only for purposes directly related to operating our business (e.g., payment processors, customer support). These providers are contractually obligated to handle your data securely and only for the purpose of providing the services we request."
          ]
        },
        {
          "tag": "p",
          "className": "text-size-regular",
          "children": [
            "No Google User data will be shared with third parties unless explicitly required for the service functionality and authorized by the User."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Changes-to-This-Privacy-Policy",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Changes to This Privacy Policy"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Mail Signature has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Your-Rights",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Your Rights"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Users have"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "the following rights regarding their data:"
          ]
        },
        {
          "tag": "ul",
          "className": "list",
          "role": "list",
          "children": [
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "Access: "
                      ]
                    },
                    "Users can request access to the personal data we hold about them."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "Correction: "
                      ]
                    },
                    "Users can request corrections to their personal data if it is inaccurate or incomplete.",
                    {
                      "tag": "br"
                    }
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "Deletion: "
                      ]
                    },
                    "Users can request the deletion of their personal data as outlined in the \"Retention and Deletion of User Data\" section."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "Data Portability: "
                      ]
                    },
                    "Users can request a copy of their data in a machine-readable format."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "Restriction of Processing: "
                      ]
                    },
                    "Users can request that we limit the processing of their data in certain situations."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "Revoke Consent : "
                      ]
                    },
                    "Users can revoke their consent for data collection and processing at any time by contacting us. "
                  ]
                }
              ]
            }
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "To exercise any of these rights, please email us at",
            {
              "tag": "br"
            },
            {
              "tag": "a",
              "href": "mailto:support@mailsignature.com",
              "children": [
                "support@mailsignature.com"
              ]
            },
            {
              "tag": "br"
            },
            ". We will respond to your request within 30 days."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Your-Rights",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Account security and acceptable use"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "To protect the integrity, security, and proper functioning of the Mail Signature platform, we reserve the right to monitor usage for suspicious, abusive, fraudulent, or unauthorized activity.If we determine, at our sole discretion, that a User is engaging in activity that violates our policies, poses a security risk, misuses the platform, or attempts to exploit or abuse our services, we reserve the right to suspend, restrict, or permanently remove that User’s access to the platform without prior notice.In such cases, Mail Signature may also delete associated data, terminate services, and take additional actions as necessary to protect our Users, systems, and business interests.This enforcement may occur even if no explicit violation has been identified, where activity appears suspicious or harmful to the platform or other Users."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Contact-Information",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Contact Information"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "If you have any questions about this Privacy Policy, the practices of this Site, or your dealings with us, please contact us ",
            {
              "tag": "br"
            },
            {
              "tag": "a",
              "className": "link-12",
              "href": "mailto:support@mailsignature.com",
              "children": [
                {
                  "tag": "span",
                  "children": [
                    "support@mailsignature.com"
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const termsOfUseContent: LegalPageContent = {
  "tagLabel": [
    "Terms of Use",
    {
      "tag": "br"
    }
  ],
  "heading": [
    "Terms of Use"
  ],
  "links": [
    {
      "href": "#Privacy",
      "label": "Privacy"
    },
    {
      "href": "#Communications-and-Marketing-Consent",
      "label": "Communications and Marketing Consent"
    },
    {
      "href": "#Use-of-Google-Workspace-API-Data",
      "label": "Use of Google Workspace API Data"
    },
    {
      "href": "#Refund-Policy",
      "label": "Refund Policy"
    },
    {
      "href": "#Logo-Revisions",
      "label": "Logo Revisions"
    },
    {
      "href": "#Account-Deletion",
      "label": "Account Deletion"
    },
    {
      "href": "#Subscription-Cancellation",
      "label": "Subscription Cancellation"
    },
    {
      "href": "#Intellectual-Property",
      "label": "Intellectual Property"
    },
    {
      "href": "#Disclaimer-of-Warranties",
      "label": "Disclaimer of Warranties"
    },
    {
      "href": "#Limitation-of-Liability",
      "label": "Limitation of Liability"
    },
    {
      "href": "#Indemnification",
      "label": "Indemnification"
    },
    {
      "href": "#Service-Description",
      "label": "Service Description"
    },
    {
      "href": "#Governing-Law-and-Dispute-Resolution",
      "label": "Governing Law and Dispute Resolution"
    },
    {
      "href": "#Contact-Us",
      "label": "Contact Us"
    }
  ],
  "body": [
    {
      "tag": "div",
      "className": "text-size-regular",
      "children": [
        "Welcome to Mail Signature! These terms of use (\"Terms\") govern your access to and use of the Mail Signature platform (\"Service\" or \"Platform\"), including any content, features, and functionality provided by Mail Signature. By accessing or using our Service, you agree to be bound by these Terms."
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Privacy",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Privacy"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Mail Signature respects your privacy and is committed to protecting your personal data. Please refer to our Privacy Policy for more information on how we collect, use, and disclose your information."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Communications-and-Marketing-Consent",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Communications and Marketing Consent"
          ]
        },
        {
          "tag": "div",
          "className": "p-wrap",
          "children": [
            {
              "tag": "p",
              "className": "text-size-regular",
              "children": [
                "By using our Service, you consent to receive communications from Mail Signature, including but not limited to emails, text messages, and push notifications. These may include marketing communications, updates about our services, promotional offers and surveys. You acknowledge that these communications are part of your relationship with Mail Signature and that you may receive them as part of your use of the Service. You can opt-out from our marketing communications at any time by clicking the “Unsubscribe” link found at the bottom of our emails or by replying STOP to our text messages."
              ]
            },
            {
              "tag": "p",
              "className": "text-size-regular",
              "children": [
                "You also consent to the use of your email address and phone number for these purposes. By providing us with your email address and phone number, you represent that you have the legal authority over these contact methods and can provide this consent."
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Web-Browser-Cookies",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Program Name:"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Mail Signature SMS Alerts"
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "How-We-Use-Collected-Information",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Program Description:"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "When you opt-in to receive SMS messages from Mail Signature, you will receive notifications regarding product updates, service alerts, and promotional offers related to our email signature management software. For example, you may receive messages such as: \"Hey {{contact.first_name}}, it's Kyle from Mail Signature. Just shooting you a text to see if you have any questions. Also, you can use code CUSTOM10 for 10% off in the next 5 days. Reply STOP to unsubscribe.\""
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "How-We-Use-Collected-Information",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Opt-Out Process:"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "You can cancel the SMS service at any time by texting \"STOP\" to our shortcode. Once you send \"STOP,\" we will send a confirmation SMS and stop any further messages. To rejoin, simply sign up as you did initially, and we will resume sending SMS notifications."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "How-We-Use-Collected-Information",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Help/Assistance:"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "If you encounter any issues with the messaging program, you can reply with the keyword \"HELP\" for assistance, or contact our support team directly at ",
            {
              "tag": "a",
              "href": "mailto:support@mailsignature.com",
              "children": [
                "support@mailsignature.com"
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Use-of-Google-Workspace-API-Data",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Use of Google Workspace API Data"
          ]
        },
        {
          "tag": "div",
          "className": "p-wrap",
          "children": [
            {
              "tag": "p",
              "className": "text-size-regular",
              "children": [
                "Mail Signature does not use any data obtained from Google Workspace APIs to develop, improve, or train generalized artificial intelligence (AI) or machine learning (ML) models. We do not retain, store, or repurpose user data from Google Workspace APIs for any AI-related processes. All data accessed through Google Workspace APIs is strictly used to support core product functionality as explicitly requested by the user, such as creating and managing email signatures."
              ]
            },
            {
              "tag": "p",
              "className": "text-size-regular",
              "children": [
                "Furthermore, Google Workspace API data is not transferred, analyzed, or processed for any machine learning development, nor is it shared with any third parties for such purposes. We are fully committed to adhering to Google’s API Services User Data Policy and ensuring user data is only used for direct, user-facing functionality."
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Carrier-Liability",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Carrier Liability:"
          ]
        },
        {
          "tag": "p",
          "className": "text-size-regular",
          "children": [
            "Please note that mobile carriers are not responsible for delayed or undelivered messages. We strive to ensure all messages are delivered promptly but cannot guarantee delivery in all cases."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Retention-and-Deletion-of-User-Data",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Message and Data Rates:"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Message and data rates may apply for any SMS messages sent or received. For questions about your text plan or data rates, please contact your wireless provider. Message frequency will vary depending on your interactions with our services."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "How-We-Protect-Your-Information",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Privacy Policy:"
          ]
        },
        {
          "tag": "div",
          "className": "p-wrap",
          "children": [
            {
              "tag": "p",
              "className": "text-size-regular",
              "children": [
                "For privacy-related inquiries or to understand how we protect your data, please refer to our fullPrivacy Policy"
              ]
            },
            {
              "tag": "p",
              "className": "text-size-regular",
              "children": [
                "For more information about your rights and how you can withdraw your consent, please review our privacy policy."
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Refund-Policy",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Refund Policy"
          ]
        },
        {
          "tag": "p",
          "className": "text-size-regular",
          "children": [
            "Mail Signature offers a 14-day refund policy. If you are not satisfied with our service, you may request a refund within 14 days of your purchase. After 14 days, we are under no obligation to provide a refund. However, you can cancel your account at any time. Upon cancellation after the initial 14 days, you will continue to have access to and use the service until the end of your current billing cycle."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Logo-Revisions",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Logo Revisions"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Each account is entitled to one free logo revision in the event the user is not satisfied with the initial result produced by our software. If a user requests a revision beyond the complimentary one, or wishes to have a different logo animated, a fee of $50 will apply for each service."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Account-Deletion",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Account Deletion"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "If you cancel your plan, our system will remove your account, and your signature will no longer be usable for your email. Mail Signature reserves the right to delete or deactivate accounts that are inactive for a period of 12 months or more."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Subscription-Cancellation",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Subscription Cancellation"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "If you decide to cancel your subscription, depending on whether you paid quarterly or yearly, you will have to pay the remainder of the subscription amount. Once the remaining amount is paid, your plan will be officially canceled, and the next calendar year will not charge you."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Intellectual-Property",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Intellectual Property"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Mail Signature retains all rights, title, and interest in and to the Service and its content, including but not limited to its trademark, logos, and patents."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Disclaimer-of-Warranties",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Disclaimer of Warranties"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "The Service is provided \"as is\" and without warranty of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Limitation-of-Liability",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Limitation of Liability"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Mail Signature shall not be liable for any indirect, incidental, special, or consequential damages, including but not limited to loss of revenue, profits, or data, arising out of or in connection with your use of the Service."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Indemnification",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Indemnification"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "You agree to indemnify, defend, and hold harmless Mail Signature, its affiliates, and their respective officers, directors, employees, agents, and licensors from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees arising out of or in connection with your use of the Service."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Service-Description",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Service Description"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Mail Signature is an email signature service that allows users to create, customize, and manage their email signatures. The Service includes interactive features that enable users to add links, images, and other content to their signatures. Mail Signature intends to provide the Service as long as possible, but in the event that Mail Signature dissolves as a company, we hold no responsibility to the users on our platform. Users will receive a 30-day notice in advance to make the necessary arrangements to transfer their signatures to another platform."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Governing-Law-and-Dispute-Resolution",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Governing Law and Dispute Resolution"
          ]
        },
        {
          "tag": "div",
          "className": "p-wrap",
          "children": [
            {
              "tag": "p",
              "className": "text-size-regular",
              "children": [
                "These Terms and your use of the Service shall be governed by and construed in accordance with the laws of the state of New York, without regard to its conflict of law provisions."
              ]
            },
            {
              "tag": "p",
              "className": "text-size-regular",
              "children": [
                "By using the Service, you agree to submit to the personal jurisdiction of the state and federal courts located within New York for the purpose of litigating all such disputes. Any cause of action or claim you may have arising out of or relating to these Terms of Service or the Service must be commenced within one (1) year after the cause of action accrues, otherwise, such cause of action or claim is permanently barred."
              ]
            },
            {
              "tag": "div",
              "className": "text-size-regular",
              "children": [
                "We reserve the right to amend these Terms at any time and will notify you if we do so. Your continued use of the Service after any modification to these Terms will constitute your acceptance of such modifications. If you do not agree to any changes, you must stop using the Service."
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Contact-Us",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Contact Us"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "For any questions or concerns regarding these Terms, please contact us at",
            {
              "tag": "br"
            },
            {
              "tag": "a",
              "className": "link-12",
              "href": "mailto:support@mailsignature.com",
              "children": [
                {
                  "tag": "span",
                  "children": [
                    "support@mailsignature.com"
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const cookiesPolicyContent: LegalPageContent = {
  "tagLabel": [
    "Terms of Use",
    {
      "tag": "br"
    }
  ],
  "heading": [
    "Cookies Policy"
  ],
  "links": [
    {
      "href": "#What-Are-Cookies",
      "label": "What Are Cookies?"
    },
    {
      "href": "#How-We-Use-Cookies",
      "label": "How We Use Cookies"
    },
    {
      "href": "#Disabling-Cookies",
      "label": "Disabling Cookies"
    },
    {
      "href": "#The-Cookies-We-Set",
      "label": "The Cookies We Set"
    },
    {
      "href": "#Third-Party-Cookies",
      "label": "Third-Party Cookies"
    },
    {
      "href": "#More-Information",
      "label": "More Information"
    }
  ],
  "body": [
    {
      "tag": "div",
      "className": "text-size-regular",
      "children": [
        "Cookie Policy for Mail Signature"
      ]
    },
    {
      "tag": "div",
      "className": "text-size-regular",
      "children": [
        "This is the Cookie Policy for Mail Signature, accessible from",
        {
          "tag": "br"
        },
        {
          "tag": "span",
          "className": "text-span-medium",
          "children": [
            "www.mailsignature.com"
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "What-Are-Cookies",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "What Are Cookies?"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer or mobile device to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored, although this may downgrade or 'break' certain elements of the site's functionality."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "How-We-Use-Cookies",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "How We Use Cookies"
          ]
        },
        {
          "tag": "div",
          "className": "p-wrap",
          "children": [
            {
              "tag": "p",
              "className": "text-size-regular",
              "children": [
                "We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not, in case they are used to provide a service that you use."
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Disabling-Cookies",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Disabling Cookies"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "You can prevent the setting of cookies by adjusting the settings on your browser (see your browser's Help or Settings for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore, it is recommended that you do not disable cookies."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "The-Cookies-We-Set",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "The Cookies We Set"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Mail Signature may collect and use Users' personal information for the following purposes:"
          ]
        },
        {
          "tag": "ul",
          "className": "list",
          "role": "list",
          "children": [
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "Account related cookies: "
                      ]
                    },
                    "If you create an account with us, then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out; however, in some cases, they may remain afterward to remember your site preferences when logged out."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "Login related cookies: "
                      ]
                    },
                    "We use cookies when you are logged in, so we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "Site preferences cookies: "
                      ]
                    },
                    "In order to provide you with a great experience on this site, we provide the functionality to set your preferences for how this site runs when you use it. To remember your preferences, we need to set cookies so that this information can be called whenever you interact with a page that is affected by your preferences."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "To send periodic emails: "
                      ]
                    },
                    "We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to inquiries, questions, and/or other requests. If User decides to opt in to our mailing list, they will receive emails that may include company news, updates, related product or service information, etc. If at any time the User would like to unsubscribe from receiving future emails, we include detailed unsubscribe instructions at the bottom of each email."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "To comply with legal obligations: "
                      ]
                    },
                    "We may use information to comply with applicable laws, regulations, and legal processes."
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Third-Party-Cookies",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Third-Party Cookies"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "In some special cases, we also use cookies provided by trusted third parties. The following section details which third-party cookies you might encounter through this site."
          ]
        },
        {
          "tag": "ul",
          "className": "list",
          "role": "list",
          "children": [
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    "Analytics: We use Google Analytics to collect information about the use of our site. This information is used to create reports and improve our site. Google's privacy policy is available at"
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "link-12",
                  "children": [
                    "https://www.google.com/policies/privacy/"
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "More-Information",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "More Information"
          ]
        },
        {
          "tag": "div",
          "className": "p-wrap",
          "children": [
            {
              "tag": "p",
              "className": "text-size-regular",
              "children": [
                "Hopefully, this policy has clarified things for you, and as mentioned previously, if there is something that you aren't sure whether you need or not, it's usually safer to leave cookies enabled in case it interacts with one of the features you use on our site."
              ]
            },
            {
              "tag": "p",
              "className": "text-size-regular",
              "children": [
                "If you are looking for more information, then you can contact us through one of our preferred contact methods:"
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const userDataDeletionContent: LegalPageContent = {
  "tagLabel": [
    "Data Security"
  ],
  "heading": [
    {
      "tag": "span",
      "className": "highlight_text",
      "children": [
        "User Data"
      ]
    },
    " Deletion"
  ],
  "heroParagraph": [
    "Have questions or need support? Contact us anytime—we're here to help, ",
    {
      "tag": "br"
    },
    "solve, and support you."
  ],
  "links": [
    {
      "href": "#Data-Deletion-Request",
      "label": "Introduction"
    },
    {
      "href": "#",
      "label": "Data Deletion Request"
    },
    {
      "href": "#",
      "label": "How to Request Data Deletion"
    },
    {
      "href": "#",
      "label": "What Happens After You Request Data Deletion?"
    },
    {
      "href": "#Questions",
      "label": "Questions?"
    },
    {
      "href": "#Additional-Information",
      "label": "Additional Information"
    }
  ],
  "body": [
    {
      "tag": "div",
      "className": "text-size-regular",
      "children": [
        "At Mail Signature, your privacy is of paramount importance to us. We are dedicated to safeguarding your personal information and ensuring compliance with all applicable data protection regulations.This is the Cookie Policy for Mail Signature, accessible from"
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Data-Deletion-Request",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Data Deletion Request"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Should you decide to request the deletion of your personal data from our systems, please follow the instructions provided below. We commit to processing all requests within 30 days in accordance with legal requirements."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "How-We-Use-Collected-Information",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "How to Request Data Deletion"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "Mail Signature may collect and use Users' personal information for the following purposes:"
          ]
        },
        {
          "tag": "ul",
          "className": "list",
          "role": "list",
          "children": [
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "span",
                      "className": "text-span-medium",
                      "children": [
                        "Email Request:"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    "To initiate a request for data deletion, please email us at ",
                    {
                      "tag": "a",
                      "href": "mailto:support@mailsignature.com",
                      "children": [
                        "support@mailsignature.com"
                      ]
                    },
                    " with the subject line \"Request for Data Deletion\"."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    "To verify your identity and secure your information, you may be asked to provide additional details or documentation confirming account ownership."
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    "Include your full name and the email address linked to your account to help us accurately identify your records."
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "How-We-Use-Collected-Information",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "What Happens After You Request Data Deletion?"
          ]
        },
        {
          "tag": "ol",
          "className": "list",
          "role": "list",
          "children": [
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "strong",
                      "className": "bold-text-5",
                      "children": [
                        "Confirmation of Request:",
                        {
                          "tag": "br"
                        }
                      ]
                    }
                  ]
                },
                {
                  "tag": "ul",
                  "role": "list",
                  "children": [
                    {
                      "tag": "li",
                      "children": [
                        {
                          "tag": "div",
                          "children": [
                            "We will acknowledge receipt of your deletion request via email."
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "strong",
                      "className": "bold-text-5",
                      "children": [
                        "Verification Process:",
                        {
                          "tag": "br"
                        }
                      ]
                    }
                  ]
                },
                {
                  "tag": "ul",
                  "role": "list",
                  "children": [
                    {
                      "tag": "li",
                      "children": [
                        {
                          "tag": "div",
                          "children": [
                            "Our team will verify your identity to prevent unauthorized access and deletion of your data. This step is crucial for protecting your privacy."
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "tag": "li",
              "children": [
                {
                  "tag": "div",
                  "className": "text-size-regular",
                  "children": [
                    {
                      "tag": "strong",
                      "className": "bold-text-5",
                      "children": [
                        "Deletion of Data:",
                        {
                          "tag": "br"
                        }
                      ]
                    }
                  ]
                },
                {
                  "tag": "ul",
                  "role": "list",
                  "children": [
                    {
                      "tag": "li",
                      "children": [
                        {
                          "tag": "div",
                          "children": [
                            "Once your identity is confirmed, we will proceed to delete all personal data associated with your account from our databases."
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "tag": "ul",
                  "role": "list",
                  "children": [
                    {
                      "tag": "li",
                      "children": [
                        {
                          "tag": "div",
                          "children": [
                            "You will receive a confirmation email once your data has been completely removed from our system."
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Questions",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Questions?"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "If you have any questions about how to request data deletion or if you need further assistance with the process, please do not hesitate to contact our support team at ",
            {
              "tag": "a",
              "href": "mailto:support@mailsignature.com",
              "children": [
                {
                  "tag": "span",
                  "children": [
                    "support@mailsignature.com"
                  ]
                }
              ]
            },
            "."
          ]
        }
      ]
    },
    {
      "tag": "div",
      "className": "info-text-wrapper",
      "id": "Additional-Information",
      "children": [
        {
          "tag": "div",
          "className": "text-size-large _24px",
          "children": [
            "Additional Information"
          ]
        },
        {
          "tag": "div",
          "className": "text-size-regular",
          "children": [
            "If you cancel your plan, our system will remove your account, and your signature will no longer be usable for your email. Mail Signature reserves the right to delete or deactivate accounts that are inactive for a period of 12 months or more."
          ]
        }
      ]
    }
  ]
};
