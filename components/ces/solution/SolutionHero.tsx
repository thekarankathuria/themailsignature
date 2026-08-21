import type { SolutionHero as SolutionHeroData } from "@/lib/ces/solutions";
import { Rich, SectionChip, TryButton } from "./parts";
import { SolutionLottie } from "./SolutionLottie";

/**
 * `.section_hero` on every `/solution/<slug>` page.
 *
 * The original's `.background-image` wash is dropped: `app/ces-extra.css` already forces
 * `.background-image { display: none }` for the white-surface theme (BUILDER_BRIEF theme
 * override 4), so shipping the `<img>` would only cost a request.
 */
export function SolutionHero({ hero }: { hero: SolutionHeroData }) {
  return (
    <div className="section_hero">
      <div className="container-large">
        <div className="hero-grid-relative">
          <div className="hero_grid">
            <div className="soluation">
              <div className="about-hero-text-wrapper">
                <SectionChip label={hero.eyebrow} />
                <div className={hero.spacerClasses[0]}></div>
                <div className={hero.headingWrapClass || undefined}>
                  <div className="heading_block text-align-left">
                    <h1 className={hero.h1Class}>
                      <Rich nodes={hero.h1} />
                    </h1>
                  </div>
                  <div className="heading_block text-align-left">
                    <h2 className={hero.h2Class}>{hero.h2}</h2>
                  </div>
                </div>
                <div className={hero.spacerClasses[1]}></div>
                <p className={hero.paragraphClass}>{hero.paragraph}</p>
                <div className={hero.spacerClasses[2]}></div>
                <div className="solution-btn-wrap">
                  {hero.cta ? (
                    <div className="button-wrapper">
                      <TryButton button={hero.cta} />
                    </div>
                  ) : null}
                  <div className="text-size-regular">{hero.subline}</div>
                </div>
              </div>
              <div className="video-wrapper-about relative solution">
                {hero.image ? (
                  <img
                    src={hero.image.src}
                    loading="lazy"
                    sizes={hero.image.sizes}
                    srcSet={hero.image.srcset}
                    alt={hero.image.alt}
                    className="commercial-img"
                  />
                ) : null}
                <SolutionLottie
                  className="sign_example_lottie hero-lottie"
                  src={hero.lottie}
                  mode="loop"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
