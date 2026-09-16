export function SectionHeading({
  eyebrow,
  title,
  lede,
  as: Tag = "h2",
  align = "center",
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  as?: "h1" | "h2";
  align?: "left" | "center";
  invert?: boolean;
}) {
  const alignment = align === "center" ? "mx-auto text-center" : "";
  const size = Tag === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl";
  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow && (
        <p className={`text-sm font-semibold uppercase tracking-wider ${invert ? "text-blue-brand-200" : "text-blue-brand-600"}`}>
          {eyebrow}
        </p>
      )}
      <Tag className={`mt-2 font-bold tracking-tight text-balance ${size} ${invert ? "text-white" : "text-navy-900"}`}>
        {title}
      </Tag>
      {lede && (
        <p className={`mt-4 text-lg leading-relaxed text-pretty ${invert ? "text-navy-100" : "text-ink-600"}`}>
          {lede}
        </p>
      )}
    </div>
  );
}
