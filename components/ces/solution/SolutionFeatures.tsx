import type { SolutionFeatures as SolutionFeaturesData } from "@/lib/ces/solutions";
import { Rich, SectionChipWrapper } from "./parts";

/**
 * `.features-section` — three cards under a chip + heading + lead paragraph.
 *
 * The trailing `.image-363` full-bleed artwork is dropped: it is `display: none` in the
 * original stylesheet at every breakpoint and it was authored for the near-black page the
 * theme no longer has (BUILDER_BRIEF theme override 4).
 *
 * The `w-node-*` ids on each card carry Webflow's grid-placement CSS, so they ride along in
 * the data rather than being regenerated.
 */
export function SolutionFeatures({ features }: { features: SolutionFeaturesData }) {
  return (
    <div id={features.id} className="features-section">
      <div className="padding-section-medium">
        <div className="container-large">
          <div className="email-deliverabity-wrapper">
            <div className="hero_grid">
              <div className={features.headerClass}>
                <SectionChipWrapper label={features.eyebrow} />
                <div className={features.headingBlockClass}>
                  <h2 className={features.h2Class}>
                    <Rich nodes={features.heading} />
                  </h2>
                </div>
                <div className={features.paragraphClass}>
                  <p className="text-size-medium">{features.paragraph}</p>
                </div>
              </div>
            </div>
            <div className="spacer-xxlarge"></div>
            <div className="features-div-wrap">
              {features.cards.map((card) => (
                <div
                  key={card.gridId || card.title}
                  id={card.gridId || undefined}
                  className={card.wrapperClass}
                >
                  {card.image ? (
                    <img
                      src={card.image.src}
                      loading="lazy"
                      sizes={card.image.sizes}
                      srcSet={card.image.srcset}
                      alt={card.image.alt}
                      className="deliverability-img"
                    />
                  ) : null}
                  <div className="content-wrapper">
                    <div className="text-wrapper deliverability-section">
                      <div className="text-size-medium _20px">{card.title}</div>
                      <div className="spacer-custom1 _8px"></div>
                      <div className="text-size-small text-align-center">{card.body}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
