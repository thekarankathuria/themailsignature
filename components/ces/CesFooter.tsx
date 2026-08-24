import Link from "next/link";
import { CesWordmark } from "@/components/ces/CesWordmark";

export function CesFooter() {
  return (
    <div className="footer">
      <div className="padding-section-medium">
        <div className="container-large">
          <div className="footer-wrapper">
            <div className="footer-top">
              <div className="footer-content">
                <div
                  id="w-node-dbb444ca-0e64-111a-b575-bc68d9f6e4fd-d9f6e4f6"
                  className="logo"
                >
                  <div className="brand-logo">
                    <CesWordmark tone="dark" size={36} />
                  </div>
                  <a href="#" className="copyright-link m-hide">
                    Copyright ©2026 Mail Signature™
                  </a>
                </div>
                <div className="conetnt">
                  <div className="footer-menu-col">
                    <div className="footer-menu-title">Pages</div>
                    <div className="footer-menu-list">
                      <Link
                        href="/"
                        aria-current="page"
                        className="footer-menu-link w--current"
                      >
                        Home
                      </Link>
                      <Link href="/generator" className="footer-menu-link">
                        Email Signature Generator
                      </Link>
                      <Link href="/about" className="footer-menu-link">
                        About
                      </Link>
                      <Link href="/contact-us" className="footer-menu-link">
                        Contact Us
                      </Link>
                    </div>
                  </div>
                  <div className="footer-menu-col">
                    <div className="footer-menu-title">Learn &amp; Get Help</div>
                    <div className="footer-menu-list">
                      <Link href="/support" className="footer-menu-link">
                        Support
                      </Link>
                      <a href="#FAQ" className="footer-menu-link">
                        FAQs
                      </a>
                      <Link href="/tutorials" className="footer-menu-link">
                        Tutorials
                      </Link>
                      <Link href="/contact-us" className="footer-menu-link">
                        Contact Us
                      </Link>
                    </div>
                  </div>
                  <div className="footer-menu-col">
                    <div className="footer-menu-title">Socials</div>
                    <div className="footer-menu-list">
                      <a
                        href="#"
                        className="footer-menu-link w-inline-block"
                      >
                        <div className="code-embed w-embed">
                          <svg
                            width="20"
                            height="21"
                            viewBox="0 0 20 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.6693 12.0101H13.7526L14.5859 8.67676H11.6693V7.01009C11.6693 6.15176 11.6693 5.34342 13.3359 5.34342H14.5859V2.54342C14.3143 2.50759 13.2884 2.42676 12.2051 2.42676C9.9426 2.42676 8.33594 3.80759 8.33594 6.34342V8.67676H5.83594V12.0101H8.33594V19.0934H11.6693V12.0101Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                        <div>Facebook</div>
                      </a>
                      <a
                        href="#"
                        className="footer-menu-link w-inline-block"
                      >
                        <div className="code-embed w-embed">
                          <svg
                            width="20"
                            height="21"
                            viewBox="0 0 20 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14.1641 7.84277C14.8544 7.84277 15.4141 7.28313 15.4141 6.59277C15.4141 5.90242 14.8544 5.34277 14.1641 5.34277C13.4737 5.34277 12.9141 5.90242 12.9141 6.59277C12.9141 7.28313 13.4737 7.84277 14.1641 7.84277Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M13.3333 3.25977C15.6333 3.25977 17.5 5.12643 17.5 7.42643V14.0931C17.5 16.3931 15.6333 18.2598 13.3333 18.2598H6.66667C4.36667 18.2598 2.5 16.3931 2.5 14.0931V7.42643C2.5 5.12643 4.36667 3.25977 6.66667 3.25977H10H13.3333Z"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M9.9974 7.42676C11.8391 7.42676 13.3307 8.91842 13.3307 10.7601C13.3307 12.6018 11.8391 14.0934 9.9974 14.0934C8.15573 14.0934 6.66406 12.6018 6.66406 10.7601C6.66406 8.91842 8.15573 7.42676 9.9974 7.42676Z"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        </div>
                        <div>Instagram</div>
                      </a>
                      <a
                        href="#"
                        className="footer-menu-link w-inline-block"
                      >
                        <div className="code-embed w-embed">
                          <svg
                            width="20"
                            height="21"
                            viewBox="0 0 20 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.2411 9.73861L16.098 4.09277H14.947L10.7299 8.99486L7.36156 4.09277H3.47656L8.5701 11.5057L3.47656 17.4261H4.6276L9.08115 12.2493L12.6382 17.4261H16.5232L11.2408 9.73861H11.2411ZM9.66469 11.5709L9.14854 10.8328L5.04229 4.95923H6.81021L10.1239 9.69944L10.6399 10.4376L14.9475 16.599H13.1798L9.66469 11.5712V11.5709Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                        <div>Twitter</div>
                      </a>
                      <a
                        href="#"
                        className="footer-menu-link hide w-inline-block"
                      >
                        <div className="code-embed w-embed">
                          <svg
                            width="20"
                            height="21"
                            viewBox="0 0 67 38"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M31.6679 19H25.3346V38H31.6679L50.6679 19H57.0012V0H50.6679L31.6679 19Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M66.5 19H57V38H66.5V19Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M0 19H6.33334L25.3334 0H31.6667V19H25.3334L6.33334 38H0V19Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                        <div>MIRRA</div>
                      </a>
                      <a
                        href="#"
                        className="footer-menu-link w-inline-block"
                      >
                        <div className="code-embed w-embed">
                          <svg
                            width="20"
                            height="21"
                            viewBox="0 0 20 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.78646 4.92629C5.78624 5.36832 5.61043 5.79215 5.29771 6.10456C4.985 6.41696 4.56099 6.59234 4.11896 6.59212C3.67693 6.5919 3.2531 6.4161 2.94069 6.10338C2.62829 5.79066 2.4529 5.36665 2.45313 4.92462C2.45335 4.4826 2.62915 4.05876 2.94187 3.74636C3.25459 3.43395 3.6786 3.25857 4.12063 3.25879C4.56265 3.25901 4.98649 3.43482 5.29889 3.74753C5.6113 4.06025 5.78668 4.48426 5.78646 4.92629ZM5.83646 7.82629H2.50313V18.2596H5.83646V7.82629ZM11.1031 7.82629H7.78646V18.2596H11.0698V12.7846C11.0698 9.73462 15.0448 9.45129 15.0448 12.7846V18.2596H18.3365V11.6513C18.3365 6.50962 12.4531 6.70129 11.0698 9.22629L11.1031 7.82629Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                        <div>LinkedIn</div>
                      </a>
                      <a
                        href="#"
                        className="footer-menu-link w-inline-block"
                      >
                        <div className="code-embed w-embed">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-youtube"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"></path>
                          </svg>
                        </div>
                        <div>Youtube</div>
                      </a>
                    </div>
                  </div>
                  <div className="footer-menu-col">
                    <div className="footer-menu-title">Policy</div>
                    <div className="footer-menu-list">
                      <Link href="/terms-of-use" className="footer-menu-link">
                        Terms of Use
                      </Link>
                      <Link href="/privacypolicy" className="footer-menu-link">
                        Privacy Policy
                      </Link>
                      <Link href="/cookies-policy" className="footer-menu-link">
                        Cookie Policy
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="spacer-xxlarge"></div>
            <div className="link-wraper">
              <div className="copyright-link">Copyright ©2026 Mail Signature™</div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-gradient-line">
        <img
          loading="lazy"
          src="/ces/img/688b583addb00e2e0b346ba0_Frame-1707479329.webp"
          alt="Footer Gradient Line"
          sizes="100vw"
          srcSet="/ces/img/688b583addb00e2e0b346ba0_Frame-1707479329.webp 500w, /ces/img/688b583addb00e2e0b346ba0_Frame-1707479329.webp 800w, /ces/img/688b583addb00e2e0b346ba0_Frame-1707479329.webp 1080w, /ces/img/688b583addb00e2e0b346ba0_Frame-201707479329-p-1600.png 1600w, /ces/img/688b583addb00e2e0b346ba0_Frame-201707479329-p-2000.png 2000w, /ces/img/688b583addb00e2e0b346ba0_Frame-201707479329-p-2600.png 2600w, /ces/img/688b583addb00e2e0b346ba0_Frame-201707479329-p-3200.png 3200w, /ces/img/688b583addb00e2e0b346ba0_Frame-1707479329.webp 4320w"
          className="gradiant-img"
        />
      </div>
    </div>
  );
}
