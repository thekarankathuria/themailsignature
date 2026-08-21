"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

/**
 * `.contact_from_section` — ported 1:1 from the Webflow original (contact-us.html).
 *
 * The original was a Webflow-hosted form (`method="get"` against Webflow's own collector)
 * driven by webflow.js: on success it hid the `<form>` and revealed `.w-form-done`, on
 * failure it revealed `.w-form-fail`, and while in flight it swapped the submit button's
 * value for its `data-wait` text. There is no Webflow runtime here, so the same three
 * states are driven from React below. `.w-form-done` / `.w-form-fail` are `display:none`
 * in app/ces.css, so they are toggled with an inline `display` exactly as Webflow does.
 *
 * The original also mounted a reCAPTCHA v2 widget in `.w-form-formrecaptcha`. That is
 * deliberately NOT carried over: the site key in the source markup belongs to
 * customesignature.com and no key exists for this project, so rendering the widget would
 * only produce a permanently failing challenge. The wrapper div is dropped with it.
 *
 * Theme: `.submit-contact`, `.success-message` and `.terms_privacy_link_text` still carry
 * blue gradients in app/ces.css (their hexes fell outside the ramp scripts/recolor-css.mjs
 * rewrites), so they are flattened to the accent inline here.
 */

const ACCENT = "#EA4335";

type Status = "idle" | "sending" | "done" | "error";

const INITIAL = {
  "First-Name-2": "",
  "Last-Name-2": "",
  "Email-4": "",
  "company-website-2": "",
  "field-2": "Purpose?",
  "Phone-Number-2": "",
  "Your-message-2": "",
  "checkbox-2": false,
};

type Fields = typeof INITIAL;

// Same shape webflow.js validated with: a non-empty local part, an `@`, and a dotted host.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isComplete(fields: Fields) {
  return (
    fields["First-Name-2"].trim() !== "" &&
    fields["Last-Name-2"].trim() !== "" &&
    EMAIL_RE.test(fields["Email-4"].trim()) &&
    fields["field-2"] !== "Purpose?" &&
    fields["Phone-Number-2"].trim() !== "" &&
    fields["Your-message-2"].trim() !== "" &&
    fields["checkbox-2"]
  );
}

export function CesContactForm() {
  const [fields, setFields] = useState<Fields>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const target = event.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setFields((current) => ({ ...current, [target.name]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    // Required fields and the email shape. The native `required`/`type="email"`
    // attributes stay on the inputs so the browser gates first; this is the backstop.
    if (!isComplete(fields)) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      setStatus(response.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  const sending = status === "sending";

  return (
    <div className="contact_from_section">
      <div className="padding-section-medium">
        <div className="container-large">
          <div>
            <div className="seection-wrapper">
              <div className="conatact-text-wrapper">
                <div className="text-size-regular red-color">
                  This form is NOT for support or cancellation inquiries. Please email{" "}
                  <span className="text-span-4">
                    <a href="mailto:support@mailsignature.com">support@mailsignature.com</a>
                  </span>{" "}
                  for assistance.
                </div>
              </div>
              <div className="email-win-list">
                <div className="hero-littie-line-wrper">
                  <div className="form-wrapper">
                    <div className="form-block w-form">
                      <form
                        id="wf-form-Contact_Form_2025_New-site"
                        name="wf-form-Contact_Form_2025_New-site"
                        onSubmit={onSubmit}
                        style={{ display: status === "done" ? "none" : undefined }}
                      >
                        <div className="first-line-input">
                          <input
                            className="enter-field w-input"
                            maxLength={256}
                            name="First-Name-2"
                            placeholder="First Name"
                            type="text"
                            id="First-Name-2"
                            required
                            value={fields["First-Name-2"]}
                            onChange={onChange}
                          />
                          <input
                            className="enter-field w-input"
                            maxLength={256}
                            name="Last-Name-2"
                            placeholder="Last Name"
                            type="text"
                            id="Last-Name-2"
                            required
                            value={fields["Last-Name-2"]}
                            onChange={onChange}
                          />
                        </div>
                        <div className="first-line-input">
                          <input
                            className="enter-field w-input"
                            maxLength={256}
                            name="Email-4"
                            placeholder="Email"
                            type="email"
                            id="Email-4"
                            required
                            value={fields["Email-4"]}
                            onChange={onChange}
                          />
                          <input
                            className="enter-field w-input"
                            maxLength={256}
                            name="company-website-2"
                            placeholder="Company Website"
                            type="text"
                            id="company-website-2"
                            value={fields["company-website-2"]}
                            onChange={onChange}
                          />
                        </div>
                        <select
                          id="field-2"
                          name="field-2"
                          required
                          className="enter-field w-select"
                          value={fields["field-2"]}
                          onChange={onChange}
                        >
                          <option value="Purpose?">Purpose?</option>
                          <option value="I just have a question">I just have a question</option>
                          <option value="Enterprise Plan">Enterprise Plan</option>
                        </select>
                        <input
                          className="enter-field w-input"
                          maxLength={256}
                          name="Phone-Number-2"
                          placeholder="Phone Number"
                          type="tel"
                          id="Phone-Number-2"
                          required
                          value={fields["Phone-Number-2"]}
                          onChange={onChange}
                        />
                        <textarea
                          id="Your-message-2"
                          name="Your-message-2"
                          maxLength={5000}
                          placeholder="Your message"
                          required
                          className="enter-field messages w-input"
                          value={fields["Your-message-2"]}
                          onChange={onChange}
                        ></textarea>
                        <div className="ftc_disclaimer">
                          <div className="text-size-xsmall _10px">
                            By providing your phone number above and clicking &#x27;Submit&#x27;,
                            you consent to receive marketing communications via text message from
                            Mail Signature. Remember, you can opt-out from our marketing
                            communications at any time by replying STOP to our text messages. Text
                            HELP for help. Msg frequency varies. Msg and data rates may apply.
                          </div>
                          <label className="w-checkbox checkbox-field">
                            <input
                              type="checkbox"
                              name="checkbox-2"
                              id="checkbox-2"
                              required
                              className="w-checkbox-input checkbox"
                              checked={fields["checkbox-2"]}
                              onChange={onChange}
                            />
                            <span className="checkbox-label w-form-label">
                              Check to opt in &#8211; I agree.
                            </span>
                          </label>
                        </div>
                        <input
                          type="submit"
                          id="button-submit-contact"
                          className="submit-contact w-button"
                          value={sending ? "Please wait..." : "Submit"}
                          disabled={sending}
                          style={{
                            backgroundImage: "none",
                            backgroundColor: ACCENT,
                            opacity: sending ? 0.6 : undefined,
                            cursor: sending ? "not-allowed" : undefined,
                          }}
                        />
                        <div className="div-block-392">
                          <a
                            href="https://www.mailsignature.com/privacypolicy"
                            target="_blank"
                            className="terms_privacy_link_text"
                            style={{
                              backgroundImage: "none",
                              WebkitTextFillColor: ACCENT,
                              color: ACCENT,
                            }}
                          >
                            Privacy Policy
                          </a>
                          <a
                            href="https://www.mailsignature.com/terms-of-use"
                            target="_blank"
                            className="terms_privacy_link_text"
                            style={{
                              backgroundImage: "none",
                              WebkitTextFillColor: ACCENT,
                              color: ACCENT,
                            }}
                          >
                            Terms and Conditions
                          </a>
                        </div>
                      </form>
                      <div
                        className="success-message w-form-done"
                        role="region"
                        aria-live="polite"
                        style={{
                          display: status === "done" ? "block" : "none",
                          backgroundImage: "none",
                          backgroundColor: ACCENT,
                        }}
                      >
                        <div className="text-block-17">
                          Thank you! Your submission has been received!
                        </div>
                      </div>
                      <div
                        className="w-form-fail"
                        role="alert"
                        style={{ display: status === "error" ? "block" : "none" }}
                      >
                        <div>Oops! Something went wrong while submitting the form.</div>
                      </div>
                    </div>
                  </div>
                  <div className="email-line"></div>
                </div>
                <div
                  id="w-node-_618456de-809a-31b1-a887-f19bf8d320d5-e322de38"
                  className="video-wrap-content"
                >
                  <div className="video-wrapper">
                    <div className="videi-custom-code w-embed">
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster="/ces/img/6855b6472edfdd9f9fac8f80_42-_Increase_poster.jpg"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      >
                        <source
                          src="/ces/video/642dafb0d48498798cf36ad2_Brand_Looper_variant2-transcode-1-.mp4"
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
