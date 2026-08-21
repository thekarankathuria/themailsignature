import type { SolutionCta as SolutionCtaData } from "@/lib/ces/solutions";
import { Rich, TryButton } from "./parts";

/**
 * `.solution-cta` — the closing band on 19 of the 21 pages. (`freelancers` and `teachers`
 * close with the site-wide `.cta_section` instead, so the route renders the existing
 * `CesCta` for those two rather than forking this template.)
 *
 * Three decorative layers from the original are not emitted: `.cta-inner-top-gradient`,
 * `.cta-inner-bottom-gredient-block-2` and the full-bleed `.cta-image-wrap` wash. All three
 * are `display: none` under the white-surface theme (BUILDER_BRIEF theme override 4).
 */
export function SolutionCta({ cta }: { cta: SolutionCtaData }) {
  return (
    <div className="solution-cta">
      <div className="padding-section-medium">
        <div className="container-large">
          <div className="cta-box">
            <div className="cta-box-inner">
              <div className="hero_grid">
                <div className="section_header_container">
                  <div className="heading_block">
                    <h2 className={cta.h2Class}>
                      <Rich nodes={cta.heading} />
                    </h2>
                  </div>
                  <div className="paragraph_wrapper">
                    <p className="text-size-medium">{cta.paragraph}</p>
                  </div>
                </div>
              </div>
              <div className="spacer-xxlarge"></div>
              {cta.cta ? (
                <div className="div-block-594">
                  <TryButton button={cta.cta} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
