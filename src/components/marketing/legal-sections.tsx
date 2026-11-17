import { Reveal } from "@/components/ui/reveal";

type LegalSection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

export function LegalSections({ sections }: { sections: readonly LegalSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section, index) => (
        <Reveal key={section.title} delay={index === 0 ? 0 : 0.02}>
          <section
            id={slug(section.title)}
            className="scroll-mt-28 border-t border-line pt-7 first:border-0 first:pt-0"
          >
            <div className="flex items-baseline gap-3">
              <span className="mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-[clamp(19px,2.2vw,24px)] font-bold tracking-tight text-ink">
                {section.title}
              </h2>
            </div>

            {section.paragraphs ? (
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-[13.5px] leading-[1.8] text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            {section.items ? (
              <ul className="mt-4 space-y-2.5">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand dark:bg-lime" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        </Reveal>
      ))}
    </div>
  );
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
