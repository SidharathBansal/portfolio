import { profile } from "@/data/profile";
import { container, sectionPad } from "@/lib/styles";
import { Reveal, SectionHeader } from "./ui";
import DomainGrid from "./visuals/DomainGrid";
import EksTable from "./visuals/EksTable";
import CostViz from "./visuals/CostViz";
import PatchRace from "./visuals/PatchRace";

const VISUALS: Record<string, React.ComponentType> = {
  gateway: DomainGrid,
  eks: EksTable,
  cost: CostViz,
  patch: PatchRace,
};

export default function Work() {
  return (
    <section id="work" className={`relative border-t border-line ${sectionPad}`}>
      <div className={container}>
        <SectionHeader
          index="02"
          label="Selected work"
          title="Production changes, without the outage."
          lede="Four pieces of work I'm proud of. The numbers are real; the visuals are there to make them easier to picture."
        />

        <div className="space-y-6 md:space-y-8">
          {profile.work.map((w, i) => {
            const Visual = VISUALS[w.id];
            return (
              <Reveal key={w.id}>
                <article className="grid overflow-hidden rounded-2xl border border-line bg-surface/50 lg:grid-cols-[1fr_1.05fr]">
                  <div className="flex flex-col p-6 md:p-10">
                    <p className="flex items-center gap-3 font-mono text-[11px] text-faint">
                      <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                      {w.where}
                      <span className="text-line-strong">/</span>
                      {w.year}
                    </p>
                    <h3 className="mt-5 text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
                      {w.title}
                    </h3>
                    <p className="mt-4 max-w-lg leading-relaxed text-dim">{w.summary}</p>
                    <dl className="mt-auto flex flex-wrap gap-x-10 gap-y-4 pt-10">
                      {w.stats.map((s) => (
                        <div key={s.label}>
                          <dd className="text-2xl font-semibold tracking-tight text-ink">{s.value}</dd>
                          <dt className="mt-0.5 font-mono text-[11px] text-faint">{s.label}</dt>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div className="dot-grid border-t border-line bg-bg/60 p-6 md:p-10 lg:border-l lg:border-t-0">
                    <Visual />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-20 md:mt-28">
          <Reveal>
            <h3 className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">Also shipped</h3>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {profile.alsoShipped.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 0.06} y={16} className="flex flex-col bg-bg p-6 md:p-7">
                <p className="font-mono text-[13px] text-accent">{a.metric}</p>
                <h4 className="mt-4 text-[17px] font-medium tracking-tight text-ink">{a.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-dim">{a.body}</p>
                <p className="mt-auto pt-5 font-mono text-[11px] text-faint">{a.where}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
