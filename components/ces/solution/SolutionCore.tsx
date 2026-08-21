import type { SolutionCoreSection } from "@/lib/ces/solutions";
import { Rich, SectionChipWrapper, TryButton } from "./parts";

/**
 * `.core-feature-section` — the six-tile benefit grid. Each page renders it twice: the first
 * pass is the industry's own list, the second is the product-wide one that closes with a CTA.
 *
 * Two per-page quirks are carried in the data rather than forked into a second template:
 * `solution_real-estate-firms.html` wraps both passes in `.supercharge-your-emails` instead
 * of `.core-feature-section` (the only difference in the stylesheet is which selector owns
 * `position: relative`), and it also carries a `.bg-img-mobile` texture wash that the
 * white-surface theme hides, so that layer is not emitted at all. `solution_marketers.html`
 * nests its first pass one level deeper, inside `.padding-global`.
 */
export function SolutionCore({ section }: { section: SolutionCoreSection }) {
  const body = (
    <div className="padding-section-medium">
        <div className="container-large">
          <div className="supercharge-main-wrapper">
            <div className="hero_grid">
              <div className={section.headerClass}>
                <SectionChipWrapper label={section.eyebrow} />
                <div>
                  <div className="heading_block">
                    <h2 className={section.h2Class}>
                      <Rich nodes={section.heading} />
                    </h2>
                  </div>
                </div>
                <div className={section.paragraphClass}>
                  <p className="text-size-medium">{section.paragraph}</p>
                </div>
              </div>
            </div>
            <div className="spacer-xlarge"></div>
            <div className="core-feature-wrap">
              {section.cards.map((card, index) => (
                <div key={`${card.title}-${index}`} className="card-benefits">
                  <div className="tag-main-wrapper">
                    <div className="tag-border fix-width">
                      <div className="tag-text fixwidth p-12px">
                        {card.icon ? (
                          <img
                            src={card.icon.src}
                            loading="lazy"
                            alt={card.icon.alt}
                            className="benefit-img"
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="gradient-line"></div>
                  </div>
                  <div className="spacer-medium"></div>
                  <h3 className="text-size-medium text-color">{card.title}</h3>
                  <div className="spacer-xsmall"></div>
                  <div className="text-size-small">{card.body}</div>
                </div>
              ))}
            </div>
            {section.cta ? (
              <>
                <div className="spacer-xlarge"></div>
                <TryButton button={section.cta} />
              </>
            ) : null}
          </div>
        </div>
      </div>
  );

  return (
    <div className={section.wrapperClass}>
      {section.paddingGlobal ? <div className="padding-global">{body}</div> : body}
    </div>
  );
}
