import type { SolutionTopUsers as SolutionTopUsersData } from "@/lib/ces/solutions";
import { Rich, SectionChipWrapper, TryButton } from "./parts";
import { SolutionLottie } from "./SolutionLottie";

/**
 * `.top_user_examples_evan` — six animated signature previews, each with a hover CTA.
 *
 * The closing "Get Started" row is optional: `solution_marketers.html` ends the section at
 * the grid, with no trailing `.spacer-xlarge` either, so both are gated on the data.
 */
export function SolutionTopUsers({ topUsers }: { topUsers: SolutionTopUsersData }) {
  return (
    <section className="top_user_examples_evan">
      <div className="padding-section-medium">
        <div className="container-large">
          <div className="section-inner-wrap">
            <div className="hero_grid">
              <div className={topUsers.headerClass}>
                <SectionChipWrapper label={topUsers.eyebrow} />
                <div>
                  <div className="heading_block">
                    <h2 className={topUsers.h2Class}>
                      <Rich nodes={topUsers.heading} />
                    </h2>
                  </div>
                </div>
                <div className={topUsers.paragraphClass}>
                  <p className="text-size-medium">{topUsers.paragraph}</p>
                </div>
              </div>
            </div>
            <div className="spacer-xlarge"></div>
            <div className="top_user_grid-evan">
              {topUsers.items.map((item, index) => (
                <div key={`${item.lottie}-${index}`} className="top-user-example-wrapper">
                  {item.cta ? (
                    <div className="esign_example_hover-evan">
                      <TryButton
                        button={item.cta}
                        anchorClass="try-for-free_btn--b is-small-30 w-inline-block"
                        innerClass="button-inner-2 is-small-165"
                        labelClass="text-block-303 is-small-75"
                      />
                    </div>
                  ) : null}
                  <SolutionLottie className="sign_example_lottie" src={item.lottie} mode="on-view" />
                </div>
              ))}
            </div>
            {topUsers.cta ? (
              <>
                <div className="spacer-xlarge"></div>
                <div className="button-wrap">
                  <TryButton button={topUsers.cta} />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
