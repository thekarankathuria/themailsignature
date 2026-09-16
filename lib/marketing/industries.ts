import type { Faq } from "./faqs";

export type Industry = {
  slug: string;
  name: string;
  /** The name as it reads mid-sentence: "lawyers", "CEOs and founders", "IT and operations teams". */
  audience: string;
  /** One line for the index card. */
  hook: string;
  /** 250+ characters, unique, specific to how this profession uses email. */
  intro: string;
  include: string[];
  avoid: string[];
  faqs: Faq[];
  templateId: string;
  related: string[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "accountants",
    name: "Accountants",
    audience: "accountants",
    hook: "Credentials, firm details and a signature clients can trust with their numbers.",
    intro:
      "Clients send accountants their most sensitive paperwork, so every email has to look like it came from a careful, established firm. A good accounting signature makes your designation obvious, shows exactly how to reach you during a busy filing season, and keeps a tidy, conservative layout that suits financial correspondence.",
    include: [
      "Your professional designation after your name, written the way your licensing body formats it (for example CPA or CA).",
      "Your role and the firm's registered name, so clients know which entity they are dealing with.",
      "A direct phone line and, during busy season, a note on how quickly you reply.",
      "A link to your client portal if you use one, so documents go there rather than into email attachments.",
      "Any confidentiality notice your firm requires, kept short and placed below your contact details.",
    ],
    avoid: [
      "Inviting clients to email tax documents or ID numbers when you have a secure portal for them.",
      "Listing every designation and membership you hold; keep the ones clients need to see.",
      "Bright colours or animated images that feel out of place next to financial advice.",
    ],
    faqs: [
      {
        q: "Should an accountant's signature include a disclaimer?",
        a: "Many firms add a short confidentiality or no-advice notice. Check your firm's policy and your professional body's guidance, keep it to a few lines, and place it at the bottom.",
      },
      {
        q: "Where do my credentials go?",
        a: "Directly after your name, separated by a comma, in the format your licensing body uses. The editor has a separate credentials field so they stay aligned.",
      },
      {
        q: "Can I add my firm's logo?",
        a: "Yes. Upload the logo in the editor; it is hosted for you so it keeps displaying in emails you have already sent.",
        claims: ["images", "image-hosting"],
      },
    ],
    templateId: "ledger",
    related: ["finance-banking", "consultants", "lawyers"],
  },
  {
    slug: "ceos",
    name: "CEOs and founders",
    audience: "CEOs and founders",
    hook: "A calm, confident signature for the person whose emails set the tone.",
    intro:
      "An email from a chief executive is often the first contact an investor, partner or senior hire has with the company. The signature should be short and assured: your name, your title, the company and one clear way to reach you. A headshot helps people put a face to the name before the first meeting.",
    include: [
      "Your title exactly as it appears on the company website, such as Founder and CEO.",
      "A professional headshot, cropped tightly and consistent with your public profiles.",
      "The company website, which is usually more useful to a recipient than a long address.",
      "A LinkedIn link, since it is where most people check who they are talking to.",
      "An assistant's contact details if scheduling goes through someone else.",
    ],
    avoid: [
      "A personal mobile number on every email when an assistant or scheduling link would do.",
      "Quotes, slogans or long mission statements under your name.",
      "A different signature style from the rest of your company.",
    ],
    faqs: [
      {
        q: "Should a CEO use a photo in their signature?",
        a: "A clear, recent headshot works well for founders who meet a lot of new people. Use the same photo as your LinkedIn profile so you are easy to recognise.",
        claims: ["images"],
      },
      {
        q: "How do I route meeting requests to my assistant?",
        a: "Add your assistant's name and email as a line in your signature, or use a meeting button that links to their scheduling page.",
        claims: ["buttons"],
      },
      {
        q: "Can my signature match the rest of the team?",
        a: "Yes. On the Business plan everyone works from the same company template, so the CEO's signature matches the team's.",
        claims: ["company-template"],
      },
    ],
    templateId: "portrait",
    related: ["entrepreneurs", "consultants", "sales-teams"],
  },
  {
    slug: "consultants",
    name: "Consultants",
    audience: "consultants",
    hook: "Show your specialism and make the next meeting easy to book.",
    intro:
      "Consultants win work through conversations, and many of those conversations start or continue by email. Your signature should say in a few words what you specialise in, make it obvious how to book time with you, and look polished enough to sit alongside a proposal sent to a senior client.",
    include: [
      "A title that names your specialism, such as Operations Consultant rather than just Consultant.",
      "A meeting button linked to your booking page, so prospects can pick a time without back-and-forth.",
      "Your practice or firm name and website.",
      "A LinkedIn link, where clients can read your background and recommendations.",
    ],
    avoid: [
      "Listing every service you offer; link to your website instead.",
      "Claims you cannot back up, such as unverifiable results or client counts.",
      "A booking link that goes to a generic calendar with no meeting length or purpose.",
    ],
    faqs: [
      {
        q: "How do I add a booking link?",
        a: "Paste your scheduling page into the meeting field and choose the button text. It appears as a proper button that works in Outlook and Gmail.",
        claims: ["buttons", "renders-everywhere"],
      },
      {
        q: "Should an independent consultant use a logo?",
        a: "Use one if you have a practice brand. If you trade under your own name, a headshot usually does more to build trust.",
        claims: ["images"],
      },
      {
        q: "Can I keep separate signatures for different clients?",
        a: "Yes. Save more than one signature to your account, for example one per engagement, and switch between them.",
        claims: ["saved-signatures", "unlimited-signatures"],
      },
    ],
    templateId: "meridian",
    related: ["freelancers", "ceos", "accountants"],
  },
  {
    slug: "customer-support",
    name: "Customer support teams",
    audience: "customer support teams",
    hook: "Signatures that help customers find answers instead of adding noise.",
    intro:
      "Support agents send more email than almost anyone, and their replies are often read on a phone by someone who is already frustrated. A support signature should be compact, name the agent so the conversation feels personal, and point to the help centre and support hours rather than to marketing pages.",
    include: [
      "The agent's first name and team, such as Customer Support, so replies feel personal.",
      "A link to your help centre or status page.",
      "Support hours and time zone, so customers know when to expect a reply.",
      "A consistent layout for the whole team, so every reply looks like it came from the same company.",
    ],
    avoid: [
      "Large banners or promotions on replies to people with a problem.",
      "Personal phone numbers or direct lines that bypass your ticketing system.",
      "Tall signatures that push the useful part of a short reply off the screen on mobile.",
    ],
    faqs: [
      {
        q: "Does a long signature cause problems in ticket threads?",
        a: "It can make long threads hard to read. Keep support signatures to a few lines; the Stack template has the narrowest footprint on phones.",
        claims: ["templates-8"],
      },
      {
        q: "Can every agent use the same design?",
        a: "Yes. With the Business plan, an admin sets up the company template and each agent only fills in their own name.",
        claims: ["company-template", "team-invites"],
      },
      {
        q: "Will the signature work in our help desk tool?",
        a: "Most help desks accept an HTML signature. The setup guides cover common email clients, and HubSpot and Front are included.",
        claims: ["install-guides"],
      },
    ],
    templateId: "stack",
    related: ["it-operations", "sales-teams", "hr-admin"],
  },
  {
    slug: "education-schools-universities",
    name: "Schools and universities",
    audience: "schools and universities",
    hook: "Consistent signatures for staff who write to students, parents and partners.",
    intro:
      "A school or university sends email to prospective students, families, alumni and research partners, often from dozens of departments at once. Consistent signatures make every message recognisably from the institution, help people find the right office, and give staff a simple way to show their department, office hours and pronouns.",
    include: [
      "The staff member's name, role and department, so people know which office they reached.",
      "The institution's logo and official colours.",
      "Office location and hours for staff who meet students in person.",
      "Pronouns, if the person chooses to share them; the editor has a field for this.",
      "A link to the relevant department page rather than the main homepage.",
    ],
    avoid: [
      "Each department inventing its own logo treatment and colours.",
      "Student information of any kind in a signature.",
      "Out-of-date term dates or event banners left in place after the event.",
    ],
    faqs: [
      {
        q: "How do we keep hundreds of staff signatures consistent?",
        a: "The Business plan lets admins set a locked company template and shared brand kit, while each staff member adds their own name and department.",
        claims: ["company-template", "brand-kit"],
      },
      {
        q: "Can staff add pronouns?",
        a: "Yes. There is a dedicated pronouns field that sits next to the name in every template.",
      },
      {
        q: "Will signatures work with our institution's Outlook or Google Workspace?",
        a: "Yes. Signatures are built for Outlook and Gmail, and the setup guides cover both.",
        claims: ["renders-everywhere", "install-guides"],
      },
    ],
    templateId: "ledger",
    related: ["teachers", "students", "hr-admin"],
  },
  {
    slug: "entrepreneurs",
    name: "Entrepreneurs",
    audience: "entrepreneurs",
    hook: "Look established from the first email, and point people where you want them to go.",
    intro:
      "When you run a young business, your email signature does double duty as a business card and a small ad. It should make a new company look established, carry your logo cleanly, and send interested people to the one place you most want them to go, whether that is your shop, a booking page or a product launch.",
    include: [
      "Your name, role and business name, even if you are the only person in the company.",
      "Your logo, sized so it reads clearly at small sizes.",
      "One call-to-action button pointing at your most important page.",
      "Social profiles where you actually post, not every network you have joined.",
    ],
    avoid: [
      "Several competing buttons and banners in one signature.",
      "A free email address when you already own a business domain.",
      "Titles that feel inflated for a one-person business, such as Chief Everything Officer.",
    ],
    faqs: [
      {
        q: "What should my call-to-action button say?",
        a: "Name the action and the benefit, such as Shop the new collection or Book a free consultation, and link it to a page built for that action.",
        claims: ["buttons"],
      },
      {
        q: "I do not have a logo yet. What should I use?",
        a: "Start without one. The Minimal template needs no images, and you can switch templates later without retyping your details.",
        claims: ["templates-8"],
      },
      {
        q: "Can I remove the TheMailSignature link?",
        a: "Yes. Pro signatures do not include the link that Free signatures carry.",
        claims: ["no-footer-link", "free-footer-link"],
      },
    ],
    templateId: "split",
    related: ["ceos", "freelancers", "marketers"],
  },
  {
    slug: "finance-banking",
    name: "Finance and banking",
    audience: "finance and banking professionals",
    hook: "A restrained signature with room for the disclosures your firm requires.",
    intro:
      "Banks, lenders and investment firms work under strict communication policies, and client emails are often archived and reviewed. A finance signature should look restrained, carry any disclosures your compliance team requires, and give clients a verified way to contact you so they are less likely to fall for look-alike messages.",
    include: [
      "Your name, title and the firm's full legal name.",
      "The disclosures or disclaimers your compliance team requires, word for word.",
      "An official phone number clients can check against your website.",
      "A reminder of how your firm will and will not contact clients, if compliance recommends one.",
    ],
    avoid: [
      "Editing required disclosure text to make it shorter.",
      "Promotional banners in regulated client communications without compliance approval.",
      "Links that do not go to your firm's own domain.",
    ],
    faqs: [
      {
        q: "Where should regulatory disclosures go?",
        a: "Below your contact details, in the disclaimer field. The editor keeps it in smaller text so it does not dominate the signature.",
      },
      {
        q: "Can we stop employees editing the disclosure?",
        a: "Yes. On the Business plan, admins can lock the disclaimer in the company template so members cannot change it.",
        claims: ["company-template"],
      },
      {
        q: "Does the signature add tracking to client emails?",
        a: "No. No tracking pixels are added to signatures.",
        claims: ["no-tracking-pixels"],
      },
    ],
    templateId: "minimal",
    related: ["accountants", "lawyers", "real-estate-firms"],
  },
  {
    slug: "freelancers",
    name: "Freelancers",
    audience: "freelancers",
    hook: "Present yourself like a studio and send clients to your portfolio.",
    intro:
      "Freelancers are their own brand, their own sales team and their own accounts department. A good freelance signature introduces what you do in a few words, shows your face or personal logo, and links straight to your portfolio, so every invoice, quote and follow-up quietly reminds clients what else you can do for them.",
    include: [
      "Your name and a specific title, such as Freelance Copywriter or Brand Designer.",
      "A link to your portfolio or website.",
      "A headshot or personal logo.",
      "Profiles on the platforms where clients find you, such as LinkedIn, Behance or Dribbble.",
      "Your time zone if you work with clients in other regions.",
    ],
    avoid: [
      "Calling yourself available for anything; name the work you want more of.",
      "Linking to an out-of-date portfolio.",
      "A different signature on every email account you use.",
    ],
    faqs: [
      {
        q: "Should I show my rates in my signature?",
        a: "Usually not. Link to a services page instead, so you can explain scope and update prices without changing your signature.",
      },
      {
        q: "Which social icons are available?",
        a: "Twenty-two networks, including Behance, Dribbble, GitHub, Instagram and LinkedIn, in six icon styles.",
        claims: ["social-icons"],
      },
      {
        q: "Can I use the same signature on several email accounts?",
        a: "Yes. Copy it once and paste it into each account; the setup guides cover each email client.",
        claims: ["copy-export", "install-guides"],
      },
    ],
    templateId: "portrait",
    related: ["consultants", "entrepreneurs", "marketing-creative-agencies"],
  },
  {
    slug: "healthcare",
    name: "Healthcare professionals",
    audience: "healthcare professionals",
    hook: "Clear credentials and contact routes, with nothing that risks patient privacy.",
    intro:
      "Clinicians, practice managers and care teams use email to coordinate with colleagues, referrers and sometimes patients. A healthcare signature should state credentials plainly, route people to the right contact for appointments and urgent concerns, and never become a place where patient details or clinical advice end up by accident.",
    include: [
      "Your name followed by your professional credentials, such as MD or RN.",
      "Your role, department and practice or hospital name.",
      "The main line for appointments, separate from any direct line.",
      "A short note that email is not monitored for urgent medical concerns, if your organisation uses one.",
      "Any confidentiality notice your organisation requires.",
    ],
    avoid: [
      "Any patient information, even initials or appointment references.",
      "Encouraging patients to send medical details by ordinary email if your organisation provides a secure channel.",
      "Health claims or promotions in a clinical signature.",
    ],
    faqs: [
      {
        q: "What should the urgent-care note say?",
        a: "Follow your organisation's approved wording. A common form tells patients not to use email for urgent concerns and gives the number to call instead.",
      },
      {
        q: "How do I show several credentials?",
        a: "Enter them in the credentials field in the order your profession uses; they appear after your name.",
      },
      {
        q: "Can a clinic give all staff the same design?",
        a: "Yes. The Business plan provides a shared company template with locked fields for notices and branding.",
        claims: ["company-template"],
      },
    ],
    templateId: "stack",
    related: ["hr-admin", "lawyers", "teachers"],
  },
  {
    slug: "hr-admin",
    name: "HR and administration",
    audience: "HR and administration teams",
    hook: "Friendly, accurate signatures for the people everyone emails with questions.",
    intro:
      "HR and office teams write to candidates, new starters and employees about sensitive and practical matters, from offer letters to building access. Their signatures should be warm but precise, show exactly which team handles what, and point people to the handbook or HR portal so routine questions get answered without another email.",
    include: [
      "Your name, role and team, such as People Operations.",
      "A link to the employee handbook or HR portal.",
      "Pronouns, if you choose to share them.",
      "Working hours, especially if you work part-time or across time zones.",
    ],
    avoid: [
      "Personal or confidential employee information in any signature.",
      "Recruitment banners on emails about sensitive matters such as leave or grievances.",
      "Leaving a colleague's old contact details in a shared inbox signature.",
    ],
    faqs: [
      {
        q: "Should HR use a separate signature for recruiting?",
        a: "It can help. Save one signature with a careers link for candidate emails and a plainer one for employee matters.",
        claims: ["saved-signatures", "unlimited-signatures"],
      },
      {
        q: "Can HR roll out signatures for the whole company?",
        a: "Yes. On the Business plan, HR or IT can set up the company template and invite everyone to fill in their details.",
        claims: ["company-template", "team-invites"],
      },
      {
        q: "What happens when someone leaves?",
        a: "An admin removes them from the team, which frees their seat for the next hire.",
        claims: ["team-invites", "roles"],
      },
    ],
    templateId: "meridian",
    related: ["personal-assistants", "customer-support", "healthcare"],
  },
  {
    slug: "it-operations",
    name: "IT and operations",
    audience: "IT and operations teams",
    hook: "Lightweight signatures that route requests to the right queue.",
    intro:
      "IT and operations staff are the people colleagues email when something breaks, so their signatures should steer requests into the right channel. A practical IT signature is lightweight, names the service desk and its hours, links to the ticket portal, and avoids heavy images that clutter long troubleshooting threads.",
    include: [
      "Your name, role and team.",
      "A link to the ticket portal or service desk.",
      "Service desk hours and the out-of-hours contact route.",
      "A status page link, if your team publishes one.",
    ],
    avoid: [
      "Asking colleagues to email passwords or security codes.",
      "Large logos or banners in internal troubleshooting threads.",
      "Personal phone numbers that encourage people to skip the queue.",
    ],
    faqs: [
      {
        q: "Does the signature HTML follow email standards?",
        a: "Signatures use HTML tables with inline styles, only safe link types, and no scripts or tracking pixels.",
        claims: ["renders-everywhere", "no-tracking-pixels"],
      },
      {
        q: "Can I get the raw HTML?",
        a: "Yes. You can download the signature as an HTML file or copy a plain-text version for clients that do not support HTML.",
        claims: ["copy-export"],
      },
      {
        q: "Can IT manage signatures centrally?",
        a: "The Business plan gives admins a shared company template, roles and seat management. Members install their own signature using the setup guides.",
        claims: ["company-template", "roles", "install-guides"],
      },
    ],
    templateId: "minimal",
    related: ["customer-support", "hr-admin", "sales-teams"],
  },
  {
    slug: "lawyers",
    name: "Lawyers",
    audience: "lawyers",
    hook: "A formal signature with room for the notices your firm requires.",
    intro:
      "Legal correspondence is formal, often privileged, and sometimes read by people the firm has never met. A lawyer's signature should state the firm's full name and your role, give reliable contact details, and hold any confidentiality notice your firm requires without letting it swamp the message or the signature above it.",
    include: [
      "Your name, role (for example Partner or Associate) and practice area.",
      "The firm's full legal name, including its entity type such as LLP.",
      "Direct phone and the firm's main address.",
      "Your firm's confidentiality notice, kept below your contact details in smaller text.",
      "Bar or licensing information where your regulator requires it.",
    ],
    avoid: [
      "Very long disclaimers that are longer than most of your emails.",
      "Decorative fonts, quotes or images that undercut a formal tone.",
      "Different firm name spellings across the team.",
    ],
    faqs: [
      {
        q: "Does a confidentiality notice need to be in my signature?",
        a: "That depends on your firm's policy and jurisdiction. If your firm uses one, add its approved wording in the disclaimer field.",
      },
      {
        q: "Which template suits a law firm?",
        a: "Minimal is text-only and formal, and Ledger suits firms that want their logo across the top. You can switch at any time.",
        claims: ["templates-8"],
      },
      {
        q: "Can the firm lock the notice for every lawyer?",
        a: "Yes. On the Business plan, admins can lock the disclaimer and branding in the company template.",
        claims: ["company-template"],
      },
    ],
    templateId: "minimal",
    related: ["accountants", "finance-banking", "consultants"],
  },
  {
    slug: "marketers",
    name: "Marketers",
    audience: "marketers",
    hook: "Turn every email into a small, well-aimed campaign.",
    intro:
      "Marketers know that an email signature is seen far more often than most ads, because it goes out with every message. A marketer's signature can carry a campaign banner or a single call to action, but it still needs to look clean, load quickly and render properly in Outlook, or the campaign becomes an embarrassment.",
    include: [
      "One banner or call-to-action button tied to your current campaign.",
      "Your name, role and company.",
      "Social profiles for the channels your team is growing.",
      "A clear link destination, ideally a landing page built for signature traffic.",
    ],
    avoid: [
      "Leaving a campaign banner up after the campaign ends.",
      "Banners made of text that is unreadable at signature size.",
      "Animated images that distract from the email itself.",
    ],
    faqs: [
      {
        q: "What size should a signature banner be?",
        a: "Keep it no wider than the signature, around 600 pixels at most, with large text. The Broadcast template is designed around a full-width banner.",
        claims: ["images", "templates-8"],
      },
      {
        q: "Can I see whether people click the banner?",
        a: "Yes, on the Business plan. Clicks on signature links and banners are counted without adding tracking pixels.",
        claims: ["click-analytics", "no-tracking-pixels"],
      },
      {
        q: "Are animated GIFs supported?",
        a: "Yes, on Pro and Business. Keep them small and subtle; some versions of Outlook show only the first frame.",
        claims: ["pro-extras"],
      },
    ],
    templateId: "broadcast",
    related: ["marketing-teams", "marketing-creative-agencies", "sales-teams"],
  },
  {
    slug: "marketing-creative-agencies",
    name: "Creative agencies",
    audience: "creative agencies",
    hook: "A signature with as much craft as the work you send.",
    intro:
      "A creative agency is judged on taste, and clients notice when the email that delivers a beautiful piece of work has a clumsy signature. Agency signatures can be bolder than most, with confident colour and a strong logo, but they still have to survive Outlook and stay consistent across every designer and account manager.",
    include: [
      "A strong logo lockup and your agency's colours.",
      "The person's name and discipline, such as Art Director or Account Manager.",
      "Links to your portfolio and the platforms where you publish work.",
      "A consistent layout for everyone who talks to clients.",
    ],
    avoid: [
      "Custom web fonts that email clients replace with something unexpected.",
      "Signatures built as one large image, which break when images are blocked.",
      "Every designer customising their own version.",
    ],
    faqs: [
      {
        q: "Can I use our brand typeface?",
        a: "Most email clients cannot load custom fonts, so the editor offers fonts that display reliably and picks a close, safe fallback.",
        claims: ["styling", "renders-everywhere"],
      },
      {
        q: "Why not make the whole signature one image?",
        a: "Many recipients block images by default, and image-only signatures are unreadable until they are allowed. Text-based signatures stay readable.",
      },
      {
        q: "How do we keep the whole agency consistent?",
        a: "Use the Business plan's brand kit and company template so every signature uses the same colours, logo and layout.",
        claims: ["brand-kit", "company-template"],
      },
    ],
    templateId: "slate",
    related: ["marketers", "freelancers", "marketing-teams"],
  },
  {
    slug: "marketing-teams",
    name: "Marketing teams",
    audience: "marketing teams",
    hook: "Run signature campaigns across the whole company, not just your own inbox.",
    intro:
      "In-house marketing teams often own the company's signatures without owning anyone's inbox. The job is to keep branding consistent across departments, swap campaign banners on schedule, and show whether signature placements are worth the space, all without asking every employee to rebuild their signature each time.",
    include: [
      "A company template with the approved logo, colours and layout.",
      "A campaign banner area that can be updated centrally.",
      "Links to the company website and main social channels.",
      "Consistent job-title formatting across departments.",
    ],
    avoid: [
      "Running a banner company-wide without an end date.",
      "Letting each department design its own signature.",
      "Measuring signature campaigns with tracking pixels in employees' emails.",
    ],
    faqs: [
      {
        q: "Can we change a banner for everyone at once?",
        a: "Yes. Update the banner in the brand kit and company template, and every member's signature picks up the change.",
        claims: ["brand-kit", "company-template"],
      },
      {
        q: "How do we measure signature campaigns?",
        a: "The Business plan counts clicks on signature links and banners, without adding tracking pixels.",
        claims: ["click-analytics", "no-tracking-pixels"],
      },
      {
        q: "Who can edit the company template?",
        a: "Owners and admins can edit it; members fill in only their own details.",
        claims: ["roles"],
      },
    ],
    templateId: "broadcast",
    related: ["marketers", "marketing-creative-agencies", "sales-teams"],
  },
  {
    slug: "personal-assistants",
    name: "Personal and executive assistants",
    audience: "personal and executive assistants",
    hook: "Make it obvious who you support and how to book their time.",
    intro:
      "Executive and personal assistants send email on behalf of someone else all day, so their signature has to explain that relationship at a glance. It should name the person you support, make scheduling simple, and look as polished as your executive's own signature, because you are often the first person a senior contact deals with.",
    include: [
      "Your name and a title that names who you support, such as Executive Assistant to the CEO.",
      "A meeting button linked to the executive's scheduling page, if you use one.",
      "Your direct line and working hours.",
      "The company name and logo, matching your executive's signature.",
    ],
    avoid: [
      "Sharing your executive's personal contact details.",
      "A signature style that does not match the executive you represent.",
      "Scheduling links that go to your own calendar when meetings are for someone else.",
    ],
    faqs: [
      {
        q: "Should I use my own signature or my executive's?",
        a: "Use your own, naming the person you support. It keeps replies coming to you and makes it clear who is writing.",
      },
      {
        q: "Can I add a scheduling button?",
        a: "Yes. Add the scheduling page to the meeting field and choose a button label such as Book time with Daniel.",
        claims: ["buttons"],
      },
      {
        q: "Can I manage signatures for more than one person?",
        a: "Yes. Save several signatures to your account and switch between them.",
        claims: ["saved-signatures", "unlimited-signatures"],
      },
    ],
    templateId: "stack",
    related: ["hr-admin", "ceos", "customer-support"],
  },
  {
    slug: "real-estate-firms",
    name: "Real estate firms",
    audience: "real estate firms",
    hook: "Brokerage branding that stays consistent across every agent.",
    intro:
      "Brokerages and property management firms have many agents emailing buyers, sellers and tenants, each with their own contact details and licences. Firm-wide signatures keep the brokerage brand consistent, make sure required licensing details appear where regulators expect them, and let each agent add their own listings link.",
    include: [
      "The brokerage name and logo, applied the same way for every agent.",
      "Each agent's name, role and licence details where your regulator requires them.",
      "The office address and main phone line.",
      "A link to current listings or the firm's property search.",
    ],
    avoid: [
      "Agents editing the brokerage logo or disclosure text.",
      "Out-of-date listing banners left in signatures.",
      "Inconsistent job titles across the firm.",
    ],
    faqs: [
      {
        q: "Can we lock the brokerage branding?",
        a: "Yes. On the Business plan, admins lock the logo, colours and disclosures while agents fill in their own details.",
        claims: ["company-template", "brand-kit"],
      },
      {
        q: "Where do licence numbers go?",
        a: "Add them to the credentials or tagline field, following the format your regulator requires.",
      },
      {
        q: "Can we see which agent's links get clicks?",
        a: "The Business plan counts clicks on signature links and banners.",
        claims: ["click-analytics"],
      },
    ],
    templateId: "split",
    related: ["realtor", "finance-banking", "marketing-teams"],
  },
  {
    slug: "realtor",
    name: "Realtors",
    audience: "realtors",
    hook: "A friendly, recognisable signature that keeps your listings one click away.",
    intro:
      "Real estate is personal, and buyers and sellers often remember the agent's face before the brokerage's name. A realtor signature works best with a clear headshot, a mobile number that is easy to tap on a phone, your brokerage details, and a button that takes people straight to your current listings or a valuation request.",
    include: [
      "A friendly, professional headshot.",
      "A mobile number formatted so it can be tapped to call.",
      "Your brokerage name and logo.",
      "Licence details where your regulator requires them.",
      "A call-to-action button, such as See my current listings.",
    ],
    avoid: [
      "Group photos or property photos in place of your headshot.",
      "Several phone numbers with no labels.",
      "Leaving a sold listing in your banner.",
    ],
    faqs: [
      {
        q: "Should realtors include a photo?",
        a: "Usually yes. Clients choose agents they recognise, and a headshot next to your name helps. The Portrait template is built around one.",
        claims: ["images", "templates-8"],
      },
      {
        q: "Can I link to my listings?",
        a: "Yes. Add a call-to-action button linked to your listings page.",
        claims: ["buttons"],
      },
      {
        q: "Will the phone number be tappable on a phone?",
        a: "Yes. Phone numbers are added as proper phone links, so most mobile mail apps open the dialler.",
        claims: ["renders-everywhere"],
      },
    ],
    templateId: "portrait",
    related: ["real-estate-firms", "entrepreneurs", "sales-teams"],
  },
  {
    slug: "sales-teams",
    name: "Sales teams",
    audience: "sales teams",
    hook: "Put the next step in every email, and know which links get used.",
    intro:
      "Salespeople send a lot of first-touch and follow-up email, and each one is a chance to move a deal forward. A sales signature should make the next step effortless, usually with a demo or meeting button, keep the rep's details consistent with the rest of the team, and show whether those links are getting used.",
    include: [
      "The rep's name, title and direct line.",
      "A meeting or demo button linked to the rep's booking page.",
      "The company logo and website.",
      "A LinkedIn link, since prospects check who is contacting them.",
    ],
    avoid: [
      "More than one call to action in the same signature.",
      "Discount offers in signatures that also go to existing customers.",
      "Each rep designing their own signature.",
    ],
    faqs: [
      {
        q: "Should every rep have a meeting button?",
        a: "It is one of the most useful things a sales signature can carry. Link each rep's button to their own booking page.",
        claims: ["buttons"],
      },
      {
        q: "Can sales leaders see click counts?",
        a: "Yes, on the Business plan. Clicks on signature links and banners are counted without tracking pixels.",
        claims: ["click-analytics", "no-tracking-pixels"],
      },
      {
        q: "How do we onboard new reps quickly?",
        a: "Invite them to the team; they fill in their details on top of the company template and follow the setup guide for their email client.",
        claims: ["team-invites", "company-template", "install-guides"],
      },
    ],
    templateId: "meridian",
    related: ["marketers", "customer-support", "ceos"],
  },
  {
    slug: "students",
    name: "Students",
    audience: "students",
    hook: "A simple, credible signature for internships, professors and applications.",
    intro:
      "Students increasingly email professors, recruiters and internship coordinators, and a tidy signature makes a small but real difference to how those messages are received. A student signature should be short and honest: your name, programme, institution and expected graduation, plus a LinkedIn or portfolio link if you have one.",
    include: [
      "Your name and pronouns, if you choose to share them.",
      "Your programme and year, or expected graduation date.",
      "Your institution's name.",
      "A LinkedIn profile or portfolio link.",
    ],
    avoid: [
      "Quotes, emojis or decorative images.",
      "Your home address or date of birth.",
      "Titles you do not officially hold.",
    ],
    faqs: [
      {
        q: "Is the Free plan enough for a student?",
        a: "For most students, yes. Free includes four templates and one saved signature.",
        claims: ["free-four-templates", "free-one-signature"],
      },
      {
        q: "Can I use my university's logo?",
        a: "Check your institution's brand rules first; many do not allow students to use the official logo. A text-only signature is always safe.",
      },
      {
        q: "Will it work in my university Gmail or Outlook account?",
        a: "Yes. The setup guides cover both.",
        claims: ["install-guides"],
      },
    ],
    templateId: "stack",
    related: ["teachers", "education-schools-universities", "freelancers"],
  },
  {
    slug: "teachers",
    name: "Teachers",
    audience: "teachers",
    hook: "A clear signature for parent and student email, with office hours built in.",
    intro:
      "Teachers write to parents, students and colleagues throughout the school year, often about schedules, progress and events. A teacher's signature should be clear and friendly, show the classes or grades you teach, and tell families when and how you are available, which cuts down on emails asking the same questions.",
    include: [
      "Your name as students address you, and your pronouns if you share them.",
      "The grade, subject or classes you teach.",
      "Your school's name and logo, if your school allows it.",
      "Office hours or the best times to reach you.",
      "A link to your class page or the school's parent portal.",
    ],
    avoid: [
      "Personal phone numbers or social media accounts.",
      "Any student information.",
      "Signatures that differ from your school's guidelines.",
    ],
    faqs: [
      {
        q: "Should teachers include office hours?",
        a: "Yes, if you have set times. They help families know when to expect a reply.",
      },
      {
        q: "Can I show my pronouns?",
        a: "Yes. There is a dedicated pronouns field next to your name.",
      },
      {
        q: "Can my whole school use the same design?",
        a: "Yes. The Business plan gives schools a shared template with locked branding.",
        claims: ["company-template"],
      },
    ],
    templateId: "meridian",
    related: ["education-schools-universities", "students", "healthcare"],
  },
];

export const INDUSTRY_BY_SLUG: Record<string, Industry> = Object.fromEntries(
  INDUSTRIES.map((i) => [i.slug, i]),
);
