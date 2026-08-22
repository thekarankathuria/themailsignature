"use client";

import Link from "next/link";
import { CesWordmark } from "@/components/ces/CesWordmark";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/supabase/actions";

type SolutionLink = {
  href: string;
  src: string;
  alt: string;
  title: string;
  desc: string;
};

const INDUSTRIES: SolutionLink[] = [
  {
    href: "/solution/real-estate-firms",
    src: "/ces/img/696dc54d2d4c01a344b7aba6_Button.avif",
    alt: "Icon of two connected office buildings.",
    title: "Real Estate Firms",
    desc: "Professional signatures that build client trust.",
  },
  {
    href: "/solution/healthcare",
    src: "/ces/img/696dc54d0bea2ca0d6b50797_Button-1.avif",
    alt: "White rounded square button with a black medical briefcase icon featuring a plus sign.",
    title: "Healthcare & Clinics",
    desc: "Clean, secure signatures for patient-facing emails.",
  },
  {
    href: "/solution/finance-banking",
    src: "/ces/img/696dc54d3b6f59c51eb1d5cd_Button-2.avif",
    alt: "Button icon showing a dollar symbol inside a circle.",
    title: "Finance & Banking",
    desc: "Trusted, regulation-friendly signature formats.",
  },
  {
    href: "/solution/education-schools-universities",
    src: "/ces/img/696dc54d8f089167fc8c22fe_Button-3.avif",
    alt: "Icon of a graduation cap symbolizing education or academic achievement.",
    title: "Education (Schools & Universities)",
    desc: "Unified signatures for all departments.",
  },
  {
    href: "/solution/marketing-creative-agencies",
    src: "/ces/img/696dc54d5441d224de3ff0e2_Button-4.avif",
    alt: "Icon of a cookie with chocolate chips on a rounded square white background.",
    title: "Marketing & Creative Agencies",
    desc: "Easily manage signatures for every client.",
  },
];

const USE_CASES: SolutionLink[] = [
  {
    href: "/solution/marketing-teams",
    src: "/ces/img/696dc54e9f312987e6bc31e2_Button-5.avif",
    alt: "Icon of a megaphone speaker on a white rounded square background.",
    title: "Marketing Teams",
    desc: "Turn every email into a branding + campaign channel.",
  },
  {
    href: "/solution/sales-teams",
    src: "/ces/img/696dc54e51e7e26be001c1af_Button-6.avif",
    alt: "Line chart icon showing upward trend with two peaks.",
    title: "Sales Teams",
    desc: "Improve replies with actionable CTAs in signatures.",
  },
  {
    href: "/solution/hr-admin",
    src: "/ces/img/696dc54e8a92a2b3cc979811_Button-7.avif",
    alt: "Icon of two user silhouettes side by side on a rounded square background.",
    title: "HR & Admin",
    desc: "Onboard new hires with ready-to-use signature templates.",
  },
  {
    href: "/solution/customer-support",
    src: "/ces/img/696dc54e186a173d7136a942_Button-8.avif",
    alt: "Black headset icon with microphone on a rounded white square background.",
    title: "Customer Support",
    desc: "Ensure clarity and professionalism in every response.",
  },
  {
    href: "/solution/it-operations",
    src: "/ces/img/696dc54ede7829e00e77c2a5_Button-9.avif",
    alt: "Briefcase icon inside a rounded square button.",
    title: "IT & Operations",
    desc: "Manage company-wide signatures with easy updates.",
  },
];

const RESOURCES_COL_1: SolutionLink[] = [
  {
    href: "/solution/realtor",
    src: "/ces/img/696dc54e59bef5f1c5174db7_Button-10.avif",
    alt: "Home icon represented by a simple house outline.",
    title: "Realtors",
    desc: "Stand out and attract more inquiries.",
  },
  {
    href: "/solution/lawyers",
    src: "/ces/img/696dc54e3deb3a77ac6496d7_Button-11.avif",
    alt: "Black gavel icon inside a rounded white square button.",
    title: "Lawyers",
    desc: "Build trust with every email.",
  },
  {
    href: "/solution/consultants",
    src: "/ces/img/696dc54ede7829e00e77c2a5_Button-9.avif",
    alt: "Briefcase icon inside a rounded square button.",
    title: "Consultants",
    desc: "Show authority and expertise.",
  },
  {
    href: "/solution/freelancers",
    src: "/ces/img/696dc54f556a3a02640807ee_Button-13.avif",
    alt: "Minimalist icon of a laptop computer.",
    title: "Freelancers",
    desc: "Strengthen your personal brand.",
  },
  {
    href: "/solution/entrepreneurs",
    src: "/ces/img/696dc54ede7829e00e77c2a5_Button-9.avif",
    alt: "Briefcase icon inside a rounded square button.",
    title: "Entrepreneurs",
    desc: "Create a sharp professional identity.",
  },
  {
    href: "/solution/accountants",
    src: "/ces/img/696dc54f8ef194c78fa4aadc_Button-15.avif",
    alt: "Icon of ascending signal bars representing network or Wi-Fi strength.",
    title: "Accountants",
    desc: "Communicate with clarity and trust.",
  },
];

const RESOURCES_COL_2: SolutionLink[] = [
  {
    href: "/solution/teachers",
    src: "/ces/img/696dc54ee69563767b10e2d0_Button-16.avif",
    alt: "Icon of a book with a bookmark on a rounded square white background.",
    title: "Teachers",
    desc: "Clean signatures for daily communication.",
  },
  {
    href: "/solution/students",
    src: "/ces/img/696dc54f3d4d07a7bb215f33_Button-17.avif",
    alt: "Icon of an open book with text lines on a rounded square white background.",
    title: "Students",
    desc: "Present a credible academic identity.",
  },
  {
    href: "/solution/personal-assistants",
    src: "/ces/img/696dc54f9211d9954a6b42ac_Button-18.avif",
    alt: "Clipboard icon with a checklist on a rounded square background.",
    title: "Personal Assistants",
    desc: "Organize communication professionally.",
  },
  {
    href: "/solution/ceos",
    src: "/ces/img/696dc54faa9a27eec4b2b816_Button-19.avif",
    alt: "Simple black crown icon with a cross on top inside a rounded square button.",
    title: "CEOs",
    desc: "Showcase leadership with polished emails.",
  },
  {
    href: "/solution/marketers",
    src: "/ces/img/696dc54fa322e13b9ba4970b_Button-20.avif",
    alt: "Target with an arrow hitting the bullseye inside a rounded square button.",
    title: "Marketers",
    desc: "Promote campaigns with every email.",
  },
  {
    href: "#",
    src: "/ces/img/696dc5519f6f19f7cc6a07c9_Button-21.avif",
    alt: "White rounded square button with a black plus sign in the center.",
    title: "Trusted by 1000+",
    desc: "Join a community of satisfied clients",
  },
];

function DropdownLink({
  link,
  onNavigate,
}: {
  link: SolutionLink;
  onNavigate: () => void;
}) {
  const inner = (
    <>
      <div className="dropdown-icon">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          src={link.src}
          alt={link.alt}
          className="image-365"
        />
      </div>
      <div className="dropdown-text-wrap">
        <div className="dropdown-heading">{link.title}</div>
        <div className="dropdown-text-small">{link.desc}</div>
      </div>
    </>
  );

  if (link.href.startsWith("/")) {
    return (
      <Link
        href={link.href}
        className="nav-dropdown-link w-inline-block"
        onClick={onNavigate}
      >
        {inner}
      </Link>
    );
  }

  return (
    <a
      href={link.href}
      className="nav-dropdown-link w-inline-block"
      onClick={onNavigate}
    >
      {inner}
    </a>
  );
}

export function CesNav() {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const closeAll = useCallback(() => {
    setSolutionsOpen(false);
    setMenuOpen(false);
  }, []);

  // Escape closes the mega-menu and the mobile menu.
  useEffect(() => {
    if (!solutionsOpen && !menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAll();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [solutionsOpen, menuOpen, closeAll]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Click outside the dropdown closes it (Webflow behaviour).
  useEffect(() => {
    if (!solutionsOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const node = dropdownRef.current;
      if (node && !node.contains(event.target as Node)) setSolutionsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [solutionsOpen]);

  // The hamburger only exists below 991px; drop the open state when we grow past it
  // so `[data-nav-menu-open]`'s `display:block!important` cannot leak onto desktop.
  useEffect(() => {
    if (!menuOpen) return;
    const onResize = () => {
      if (window.innerWidth > 991) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  const openOnHover = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") setSolutionsOpen(true);
  };
  const closeOnHover = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") setSolutionsOpen(false);
  };

  const closeSolutions = () => setSolutionsOpen(false);

  const handleSignOut = useCallback(async () => {
    // Sign out on the browser client first so it fires SIGNED_OUT locally
    // and onAuthStateChange flips `authed` immediately; the server action
    // then clears the cookies and redirects. Otherwise this is a soft
    // navigation and the nav keeps claiming the user is signed in until a
    // hard reload.
    await createClient().auth.signOut();
    await signOut();
  }, []);

  return (
    <div className="nav_fixed">
      <div
        data-animation="default"
        data-collapse="medium"
        data-duration="400"
        data-easing="ease"
        data-easing2="ease"
        role="banner"
        className="nav_component w-nav"
      >
        <div className="nav_container">
          <div className="nav_outer-block">
            <Link
              href="/"
              aria-current="page"
              className="nav_brand w-nav-brand w--current"
            >
              <div className="nav_brand-embed w-embed">
                <CesWordmark tone="dark" size={32} />
              </div>
            </Link>
            <nav
              role="navigation"
              className="nav_menu w-nav-menu"
              {...(menuOpen ? { "data-nav-menu-open": "" } : {})}
            >
              <div className="nav_link-wrapper">
                <a href="#Features" className="nav_menu_link w-nav-link" onClick={closeAll}>
                  Features
                </a>
                <div
                  ref={dropdownRef}
                  data-delay="300"
                  data-hover="false"
                  className="uui-navbar03_menu-dropdown w-dropdown"
                  onPointerLeave={closeOnHover}
                >
                  <div
                    className={
                      solutionsOpen
                        ? "uui-navbar03_dropdown-toggle-2 w-dropdown-toggle w--open"
                        : "uui-navbar03_dropdown-toggle-2 w-dropdown-toggle"
                    }
                    role="button"
                    tabIndex={0}
                    aria-haspopup="menu"
                    aria-expanded={solutionsOpen}
                    aria-controls="ces-solutions-dropdown"
                    onClick={() => setSolutionsOpen((open) => !open)}
                    onPointerEnter={openOnHover}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSolutionsOpen((open) => !open);
                      }
                    }}
                  >
                    <div>
                      Solutions
                    </div>
                    <div className="uui-dropdown-icon-5 w-embed">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </div>
                  </div>
                  <nav
                    id="ces-solutions-dropdown"
                    className={
                      solutionsOpen
                        ? "uui-navbar03_dropdown-list-2 w-dropdown-list w--open"
                        : "uui-navbar03_dropdown-list-2 w-dropdown-list"
                    }
                    /* `w--open` in app/ces.css already sets display:flex here — an inline
                       display would override it and stretch the panel. */
                  >
                    <div>
                      <div className="nav-dropdown-container">
                        <div className="dropdown-content">
                          <div className="dropdown-content-left">
                            <div className="dropdown-link-list">
                              <div className="drop-heading">
                                <h4 className="nav-dropdown-heading">
                                  INDUSRIES
                                </h4>
                              </div>
                              {INDUSTRIES.map((link) => (
                                <DropdownLink key={link.title} link={link} onNavigate={closeSolutions} />
                              ))}
                            </div>
                            <div className="dropdown-link-list">
                              <div className="drop-heading">
                                <h4 className="nav-dropdown-heading">
                                  Use cases
                                </h4>
                              </div>
                              {USE_CASES.map((link) => (
                                <DropdownLink key={link.title} link={link} onNavigate={closeSolutions} />
                              ))}
                            </div>
                            <div id="w-node-_7568fe72-a460-6004-4e4b-a9068f3dfde7-63dfdea9" className="dropdown-link-list">
                              <div className="drop-heading">
                                <h4 className="nav-dropdown-heading">
                                  Resources
                                </h4>
                              </div>
                              <div className="nav-dropdown-resourcrs-wrap">
                                <div className="dropdown-link-wrap">
                                  {RESOURCES_COL_1.map((link) => (
                                    <DropdownLink key={link.title} link={link} onNavigate={closeSolutions} />
                                  ))}
                                </div>
                                <div className="dropdown-link-wrap">
                                  {RESOURCES_COL_2.map((link) => (
                                    <DropdownLink key={link.title} link={link} onNavigate={closeSolutions} />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="dropdown-bottom-bar">
                        <div className="nav-dropdown-container bottom">
                          <div className="nav-bottom-bar-left">
                            <div className="bottom-text-icon-wrap">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img loading="lazy" src="/ces/img/696dc924461dfd4abc409e51_Button.avif" alt="White plus sign centered on a blue gradient background." className="bottom-icon" />
                              <div id="w-node-_7568fe72-a460-6004-4e4b-a9068f3dfe53-63dfdea9" className="bootom-content-wrap">
                                <div className="nav-text-size-medium">
                                  Browse 1000+ industries
                                </div>
                                <div className="nav-button-link">
                                  Find signature templates for
                                  <br />
                                  every profession.
                                </div>
                              </div>
                            </div>
                            <a href="https://app.mailsignature.com/signin" target="_blank" className="white_cta_btn" onClick={closeSolutions}>
                              <div className="button-border-b">
                                <div className="button-text-wrap-b-3">
                                  <div className="text-button">
                                    View all industries
                                    <br />
                                  </div>
                                </div>
                              </div>
                            </a>
                          </div>
                          <div className="nav-bottom-bar-left">
                            <div className="bottom-text-icon-wrap">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img loading="lazy" src="/ces/img/696dc924d4a753ad9d7a573d_Button-1.avif" alt="White pencil icon on a blue to purple gradient circular background." className="bottom-icon" />
                              <div id="w-node-_7568fe72-a460-6004-4e4b-a9068f3dfe63-63dfdea9" className="bootom-content-wrap">
                                <div className="nav-text-size-medium">
                                  Create a custom signature
                                </div>
                                <div className="nav-button-link">
                                  Design a personalized
                                  <br />
                                  from scratch.
                                </div>
                              </div>
                            </div>
                            <a href="https://app.mailsignature.com/signin" target="_blank" className="white_cta_btn" onClick={closeSolutions}>
                              <div className="button-border-b">
                                <div className="button-text-wrap-b-3">
                                  <div className="text-button">
                                    Create custom signature
                                  </div>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
                <a href="#deliverability" className="nav_menu_link w-nav-link" onClick={closeAll}>
                  Deliverablity
                </a>
                <a href="https://app.mailsignature.com/pricing?getstarted=true" className="nav_menu_link w-nav-link">
                  Pricing
                </a>
                <Link href="/about" className="nav_menu_link w-nav-link" onClick={closeAll}>
                  About
                </Link>
                <a href="#FAQ" className="nav_menu_link w-nav-link" onClick={closeAll}>
                  FAQs
                </a>
              </div>
              <div className="nav_button-wrapper">
                {authed ? (
                  <button type="button" onClick={handleSignOut} className="white_cta_btn">
                    <div className="button-border-b">
                      <div className="button-text-wrap-b">
                        <div className="text-button">
                          Log out
                          <br />
                        </div>
                      </div>
                    </div>
                  </button>
                ) : (
                  <Link href="/login" className="white_cta_btn">
                    <div className="button-border-b">
                      <div className="button-text-wrap-b">
                        <div className="text-button">
                          Log in
                          <br />
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
                <a href="/generator" className="try-for-free_btn--b w-inline-block">
                  <div className="button-border is-small-17">
                    <div className="button-inner-2">
                      <div className="text-button text-color">
                        Get Started, FREE!
                      </div>
                      <div className="button-icon-wrap is-small-83">
                        <div className="button-icon is-small-203 w-embed">
                          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_2013_416)">
                              <path d="M4.875 3.75L11.125 10L4.875 16.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M11.125 3.75L17.375 10L11.125 16.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </g>
                            <defs>
                              <clipPath id="clip0_2013_416">
                                <rect width="20" height="20" fill="white" transform="translate(0.5)"></rect>
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
                <Link href="/demo" className="button is-transparent w-inline-block" onClick={closeAll}>
                  <div className="text-block-304">
                    View Demo
                  </div>
                  <div className="button_arrow-2 w-embed">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_3180_9430)">
                        <path d="M12.668 8C12.6683 8.1567 12.6288 8.31083 12.5531 8.44741C12.4774 8.58398 12.3682 8.69835 12.2361 8.77939L4.04979 13.8641C3.91177 13.95 3.75369 13.9968 3.59188 13.9998C3.43006 14.0029 3.27039 13.962 3.12933 13.8814C2.98962 13.8021 2.87324 13.6865 2.79215 13.5463C2.71107 13.4062 2.6682 13.2467 2.66797 13.0842V2.91582C2.6682 2.7533 2.71107 2.59378 2.79215 2.45365C2.87324 2.31353 2.98962 2.19786 3.12933 2.11855C3.27039 2.03799 3.43006 1.99712 3.59188 2.00016C3.75369 2.0032 3.91177 2.05005 4.04979 2.13586L12.2361 7.22061C12.3682 7.30165 12.4774 7.41602 12.5531 7.55259C12.6288 7.68917 12.6683 7.8433 12.668 8Z" fill="#030712"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_3180_9430">
                          <rect width="16" height="16" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </Link>
              </div>
            </nav>
          </div>
          <a href="/generator" className="try-for-free_btn--b mobile w-inline-block">
            <div className="button-border is-small-17">
              <div className="button-inner-2">
                <div className="text-button text-color">
                  Get Started
                </div>
                <div className="button-icon-wrap is-small-83"></div>
              </div>
            </div>
          </a>
          <div
            className={menuOpen ? "nav_button w-nav-button w--open" : "nav_button w-nav-button"}
            role="button"
            tabIndex={0}
            aria-label="menu"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setMenuOpen((open) => !open);
              }
            }}
          >
            <div className="icon-2 w-icon-nav-menu"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
