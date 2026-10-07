import { profile } from "@/data/profile";
import { container, sectionPad } from "@/lib/styles";
import { Reveal, SectionHeader } from "./ui";

export default function Toolkit() {
  return (
    <section id="toolkit" className={`relative border-t border-line ${sectionPad}`}>
      <div className={container}>
        <SectionHeader index="06" label="Toolkit" title="What I reach for." />

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {profile.toolkit.map((g, i) => (
            <Reveal key={g.group} delay={(i % 3) * 0.06} y={16} className="bg-bg p-6 md:p-7">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">{g.group}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {g.items.map((t) => (
                  <li
                    key={t}
                    className="rounded-md border border-line-strong bg-surface px-2.5 py-1 text-[13px] text-dim transition-colors hover:border-accent/50 hover:text-ink"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
