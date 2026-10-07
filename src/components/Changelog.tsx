import { profile } from "@/data/profile";
import { container, sectionPad } from "@/lib/styles";
import { Reveal, SectionHeader } from "./ui";

export default function Changelog() {
  return (
    <section id="changelog" className={`relative border-t border-line ${sectionPad}`}>
      <div className={container}>
        <SectionHeader index="05" label="Changelog" title="Experience, newest first." />

        <ol className="relative">
          {profile.changelog.map((c, i) => (
            <li key={c.where} className="relative grid gap-4 pb-14 last:pb-0 md:grid-cols-[200px_1fr] md:gap-12">
              <Reveal y={12}>
                <p className="font-mono text-[12px] text-faint md:pt-1.5 md:text-right">
                  {c.when}
                  {c.current && (
                    <span className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok/10 px-2 py-0.5 text-[10.5px] text-ok md:mt-2 md:ml-auto md:flex md:w-fit">
                      <span className="size-1.5 rounded-full bg-ok" />
                      current
                    </span>
                  )}
                </p>
              </Reveal>

              <div className="relative md:border-l md:border-line md:pl-10">
                <span
                  aria-hidden
                  className={`absolute -left-[5px] top-2.5 hidden size-[9px] rounded-full border-2 border-bg md:block ${
                    c.current ? "bg-ok" : i === profile.changelog.length - 1 ? "bg-faint" : "bg-accent"
                  }`}
                />
                <Reveal delay={0.05}>
                  <h3 className="text-2xl font-semibold tracking-tight text-ink md:text-[28px]">{c.where}</h3>
                  <p className="mt-1.5 text-[15px] text-dim">
                    {c.role} <span className="text-faint">· {c.place}</span>
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {c.notes.map((n) => (
                      <li key={n} className="flex gap-3 text-[15px] leading-relaxed text-dim">
                        <span aria-hidden className="mt-[3px] select-none font-mono text-[12px] text-ok">
                          +
                        </span>
                        {n}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
