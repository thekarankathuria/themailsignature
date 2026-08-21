/**
 * The `Video Tutorials` block — ported 1:1 from the Webflow original.
 *
 * support.html renders it as the second `.section_hero` and tutorials.html renders it as
 * its only `.section_hero`; the two subtrees are byte-identical, so both pages import
 * this one component.
 *
 * The cards came out of a Webflow CMS collection (`.w-dyn-list`), which is why the
 * wrappers carry the `w-dyn-*` classes and the `role="list"`/`role="listitem"` pair.
 * They are kept because `app/ces.css` places the grid on `.tutorial-video-list`.
 *
 * The Loom embeds stay remote: they are third-party players, not site assets, so the
 * asset-map rule about website-files.com URLs does not apply to them. The original
 * protocol-relative `//cdn.embedly.com` src is written out as `https:` here.
 *
 * Theme: the chip SVG gradient stops are flattened to the flat accent (#EA4335).
 */

type Tutorial = {
  paddingTop: string;
  src: string;
  width: number;
  height: number;
  title: string;
  date: string;
};

const TUTORIALS: Tutorial[] = [
  {
    paddingTop: "75%",
    src: "https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.loom.com%2Fembed%2F15e184c2762045b3a8d3078fb073b378&display_name=Loom&url=https%3A%2F%2Fwww.loom.com%2Fshare%2F15e184c2762045b3a8d3078fb073b378%3Fsid%3D15d181a9-94cc-4c13-804d-8321f4430ec3&image=https%3A%2F%2Fcdn.loom.com%2Fsessions%2Fthumbnails%2F15e184c2762045b3a8d3078fb073b378-782b5259fd3cc918.gif&type=text%2Fhtml&schema=loom",
    width: 1672,
    height: 1254,
    title: "How to setup your first signature/acct",
    date: "July 15, 20225",
  },
  {
    paddingTop: "75%",
    src: "https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.loom.com%2Fembed%2Ff1508c22e4164c08812ea5b5ab139dbb&display_name=Loom&url=https%3A%2F%2Fwww.loom.com%2Fshare%2Ff1508c22e4164c08812ea5b5ab139dbb%3Fsid%3D26ba3d9b-8010-47bb-806d-7b81c120b041&image=https%3A%2F%2Fcdn.loom.com%2Fsessions%2Fthumbnails%2Ff1508c22e4164c08812ea5b5ab139dbb-765e9221156a766a.gif&type=text%2Fhtml&schema=loom",
    width: 1672,
    height: 1254,
    title: "How Generate Signatures for Your Entire Team",
    date: "July 15, 2025",
  },
  {
    paddingTop: "75%",
    src: "https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.loom.com%2Fembed%2F741690ad5cb5415692a4862f3e807120&display_name=Loom&url=https%3A%2F%2Fwww.loom.com%2Fshare%2F741690ad5cb5415692a4862f3e807120%3Fsid%3D2181efe7-567a-411c-a4cf-1d5bf69af247&image=https%3A%2F%2Fcdn.loom.com%2Fsessions%2Fthumbnails%2F741690ad5cb5415692a4862f3e807120-9aa283a6c49aa677.gif&type=text%2Fhtml&schema=loom",
    width: 1672,
    height: 1254,
    title: "How to edit your signature",
    date: "July 15, 2025",
  },
  {
    paddingTop: "75%",
    src: "https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.loom.com%2Fembed%2Fec46b9dccafb46e79e1480c476d4598d&display_name=Loom&url=https%3A%2F%2Fwww.loom.com%2Fshare%2Fec46b9dccafb46e79e1480c476d4598d%3Fsid%3D98d46cd0-4a9f-4e76-b92f-dd6f920d5c16&image=https%3A%2F%2Fcdn.loom.com%2Fsessions%2Fthumbnails%2Fec46b9dccafb46e79e1480c476d4598d-a05bf3ec26a6521b.gif&type=text%2Fhtml&schema=loom",
    width: 1672,
    height: 1254,
    title: "Gmail Desktop/Phone Setup",
    date: "July 15, 2025",
  },
  {
    paddingTop: "75%",
    src: "https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.loom.com%2Fembed%2Fdd7750eabd3e43d8ad93cc01f4622b05&display_name=Loom&url=https%3A%2F%2Fwww.loom.com%2Fshare%2Fdd7750eabd3e43d8ad93cc01f4622b05%3Fsid%3Dfef661c3-5d6c-4699-98d6-a2c38daeed21&image=https%3A%2F%2Fcdn.loom.com%2Fsessions%2Fthumbnails%2Fdd7750eabd3e43d8ad93cc01f4622b05-1c625d801430aea7.gif&type=text%2Fhtml&schema=loom",
    width: 1672,
    height: 1254,
    title: "Apple Mail Mac Setup",
    date: "July 15, 2025",
  },
  {
    paddingTop: "75.00977708251858%",
    src: "https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.loom.com%2Fembed%2Fdf87195091a24c169342ee41671c0499&display_name=Loom&url=https%3A%2F%2Fwww.loom.com%2Fshare%2Fdf87195091a24c169342ee41671c0499%3Fsid%3Def6f1b9b-737b-440a-9519-944a5b31b70a&image=https%3A%2F%2Fcdn.loom.com%2Fsessions%2Fthumbnails%2Fdf87195091a24c169342ee41671c0499-31b696ee03ecd672.gif&type=text%2Fhtml&schema=loom",
    width: 2557,
    height: 1918,
    title: "Apple Mail Setup iPhone",
    date: "July 15, 2025",
  },
  {
    paddingTop: "75%",
    src: "https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.loom.com%2Fembed%2F89296b05d8934ec3bf7034fc4111c2e7&display_name=Loom&url=https%3A%2F%2Fwww.loom.com%2Fshare%2F89296b05d8934ec3bf7034fc4111c2e7%3Fsid%3D5cd2937c-89dc-4fea-a9c4-22c55bf98f73&image=https%3A%2F%2Fcdn.loom.com%2Fsessions%2Fthumbnails%2F89296b05d8934ec3bf7034fc4111c2e7-8b6a05f5c2bd7c8b.gif&type=text%2Fhtml&schema=loom",
    width: 1672,
    height: 1254,
    title: "Outlook Signature Setup with Mail Signature",
    date: "July 15, 2025",
  },
  {
    paddingTop: "75.00977708251858%",
    src: "https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.loom.com%2Fembed%2F62c901cede7549438ae31759614e709d&display_name=Loom&url=https%3A%2F%2Fwww.loom.com%2Fshare%2F62c901cede7549438ae31759614e709d%3Fsid%3Dfe613c5c-f703-43f5-98be-3441da4643a6&image=https%3A%2F%2Fcdn.loom.com%2Fsessions%2Fthumbnails%2F62c901cede7549438ae31759614e709d-914568bd8217d05b.gif&type=text%2Fhtml&schema=loom",
    width: 2557,
    height: 1918,
    title: "Outlook App iPhone Setup",
    date: "July 15, 2025",
  },
];

export function CesVideoTutorials({ isPageHeading = false }: { isPageHeading?: boolean } = {}) {
  // /tutorials renders this as its only section, so its heading is that page's <h1>.
  // /support renders it below its own hero, where it has to stay an <h2>.
  const Heading = isPageHeading ? "h1" : "h2";
  return (
    <div className="section_hero">
      <div className="padding-section-medium _64px">
        <div className="container-large">
          <div className="tutorial-video-wrapper">
            <div className="hero_content">
              <div className="spacer-xlarge hide"></div>
              <div className="section-tag-block">
                <div className="section-sub-inner-box different-6">
                  <div className="section-sub-tag-title different-7">
                    <div className="bullet-list-icon different-8">
                      <div className="html-code different-9 w-embed">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_2003_12337_vt)">
                            <path
                              d="M13.3661 7.84124L6.36608 15.3412C6.29189 15.4204 6.19398 15.4733 6.0871 15.4919C5.98022 15.5106 5.87019 15.4939 5.77359 15.4445C5.677 15.3952 5.59909 15.3157 5.55162 15.2181C5.50415 15.1206 5.4897 15.0102 5.51045 14.9037L6.4267 10.3206L2.82483 8.96812C2.74747 8.93918 2.67849 8.89154 2.62404 8.82944C2.56959 8.76733 2.53138 8.69271 2.5128 8.61224C2.49423 8.53176 2.49589 8.44794 2.51761 8.36826C2.53934 8.28858 2.58047 8.21552 2.63733 8.15562L9.63733 0.655618C9.71151 0.576453 9.80942 0.523563 9.9163 0.504929C10.0232 0.486295 10.1332 0.502928 10.2298 0.552319C10.3264 0.60171 10.4043 0.681178 10.4518 0.778732C10.4992 0.876285 10.5137 0.986631 10.493 1.09312L9.5742 5.68124L13.1761 7.03187C13.2529 7.061 13.3213 7.10859 13.3753 7.17045C13.4293 7.2323 13.4673 7.30651 13.4858 7.38652C13.5044 7.46652 13.5029 7.54986 13.4816 7.62917C13.4603 7.70848 13.4197 7.78132 13.3636 7.84124H13.3661Z"
                              fill="url(#paint0_linear_2003_12337_vt)"
                            ></path>
                          </g>
                          <defs>
                            <linearGradient
                              id="paint0_linear_2003_12337_vt"
                              x1="2.5"
                              y1="7.99843"
                              x2="13.4987"
                              y2="7.99843"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#EA4335"></stop>
                              <stop offset="1" stopColor="#EA4335"></stop>
                            </linearGradient>
                            <clipPath id="clip0_2003_12337_vt">
                              <rect width="16" height="16" fill="white"></rect>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <div className="button-text different-10">
                      Learn here
                      <br />
                    </div>
                  </div>
                </div>
                <div className="gradient-line"></div>
              </div>
              <div>
                <div className="heading_block">
                  <Heading className="heading">
                    <span className="highlight_text">Video</span> Tutorials
                  </Heading>
                </div>
              </div>
              <div className="paragraph_wrapper">
                <p className="text-size-medium">Learn with step-by-step video guides</p>
              </div>
            </div>
            <div className="spacer-xxlarge"></div>
            <div className="tutorial-video-wrapper w-dyn-list">
              <div role="list" className="tutorial-video-list w-dyn-items">
                {TUTORIALS.map((tutorial) => (
                  <div role="listitem" className="w-dyn-item" key={tutorial.src}>
                    <div className="video-card">
                      <div
                        style={{ paddingTop: tutorial.paddingTop }}
                        className="w-video w-embed"
                      >
                        <iframe
                          className="embedly-embed"
                          src={tutorial.src}
                          width={tutorial.width}
                          height={tutorial.height}
                          scrolling="no"
                          title="Loom embed"
                          frameBorder="0"
                          allow="autoplay; fullscreen; encrypted-media; picture-in-picture;"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="video-text-wrapper">
                        <div className="video-heading">{tutorial.title}</div>
                        <div className="spacer-custom1 _12px"></div>
                        <div className="view-date">{tutorial.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
