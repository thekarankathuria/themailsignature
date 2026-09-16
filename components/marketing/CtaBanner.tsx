import { ButtonLink } from "./ButtonLink";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function CtaBanner({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: { label: string; href: string };
}) {
  return (
    <Section tone="navy">
      <SectionHeading title={title} lede={body} invert />
      <div className="mt-8 flex justify-center">
        <ButtonLink href={cta.href} variant="light">
          {cta.label}
        </ButtonLink>
      </div>
    </Section>
  );
}
