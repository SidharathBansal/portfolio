import { profile } from "@/data/profile";
import { container, sectionPad } from "@/lib/styles";
import { Reveal, SectionHeader } from "./ui";

export default function Writing() {
  return (
    <section id="writing" className={`relative border-t border-line ${sectionPad}`}>
      <div className={container}>
        <SectionHeader index="04" label="Writing" title="Notes from the platform team." />

        <ul className="border-t border-line">
          {profile.writing.map((a, i) => (
            <li key={a.url} className="border-b border-line">
              <Reveal delay={i * 0.06} y={16}>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid gap-3 py-8 md:grid-cols-[180px_1fr_auto] md:items-baseline md:gap-10 md:py-10"
                >
                  <span className="font-mono text-[11px] text-faint">
                    {a.outlet}
                    <span className="block text-faint/70">medium</span>
                  </span>
                  <span>
                    <span className="block text-xl font-medium leading-snug tracking-tight text-ink transition-colors group-hover:text-accent md:text-2xl">
                      {a.title}
                    </span>
                    <span className="mt-2 block max-w-2xl text-[15px] leading-relaxed text-dim">{a.summary}</span>
                  </span>
                  <span
                    aria-hidden
                    className="hidden font-mono text-lg text-faint transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent md:block"
                  >
                    ↗
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
