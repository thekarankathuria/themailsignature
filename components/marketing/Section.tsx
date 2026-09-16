import { Container } from "@/components/site/Container";

const TONES = {
  white: "bg-white",
  tint: "bg-navy-50",
  navy: "bg-navy-900 text-white",
} as const;

export function Section({
  id,
  tone = "white",
  className = "",
  children,
}: {
  id?: string;
  tone?: keyof typeof TONES;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${TONES[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
