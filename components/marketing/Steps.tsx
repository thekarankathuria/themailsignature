import Image from "next/image";

export type Step = {
  title: string;
  body: string;
  image?: { src: string; alt: string; width: number; height: number };
};

export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="mt-12 grid gap-8 lg:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title} className="flex flex-col">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
            {index + 1}
          </span>
          <h3 className="mt-4 text-lg font-semibold text-navy-900">{step.title}</h3>
          <p className="mt-2 leading-relaxed text-ink-600">{step.body}</p>
          {/* mt-auto keeps the screenshots on one line when the text above
              them wraps to different heights. */}
          {step.image && (
            <div className="mt-auto pt-5">
              <Image
                src={step.image.src}
                alt={step.image.alt}
                width={step.image.width}
                height={step.image.height}
                className="rounded-card border border-ink-200 shadow-sm"
              />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
