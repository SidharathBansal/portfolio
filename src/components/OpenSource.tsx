import { profile } from "@/data/profile";
import { container, sectionPad } from "@/lib/styles";
import { Reveal, SectionHeader } from "./ui";

const { repo, repoUrl, prs } = profile.openSource;

function MergedIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 fill-current" aria-hidden>
      <path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z" />
    </svg>
  );
}

export default function OpenSource() {
  return (
    <section id="open-source" className={`relative border-t border-line ${sectionPad}`}>
      <div className={container}>
        <SectionHeader
          index="03"
          label="Open source"
          title={
            <>
              Fixed it at work. <span className="text-faint">Then fixed it upstream.</span>
            </>
          }
          lede={
            <>
              Two features I designed and merged into{" "}
              <a href={repoUrl} target="_blank" rel="noreferrer" className="font-mono text-[0.92em] text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent">
                {repo}
              </a>
              , both born from problems I hit running it in production.
            </>
          }
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {prs.map((pr, i) => (
            <Reveal key={pr.number} delay={i * 0.08} className="h-full">
              <a
                href={pr.url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-line bg-surface/50 p-6 transition-colors hover:border-merged/50 md:p-8"
              >
                <div className="flex flex-wrap items-center gap-3 font-mono text-[11.5px]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-merged/15 px-2.5 py-1 text-merged">
                    <MergedIcon /> Merged
                  </span>
                  <span className="text-dim">#{pr.number}</span>
                  <span className="text-faint">{pr.merged}</span>
                  <span className="ml-auto">
                    <span className="text-ok">+{pr.additions}</span> <span className="text-bad">-{pr.deletions}</span>
                  </span>
                </div>

                <h3 className="mt-5 font-mono text-[15px] leading-snug text-ink transition-colors group-hover:text-accent md:text-base">
                  {pr.title}
                </h3>

                <dl className="mt-6 space-y-4 text-[14.5px] leading-relaxed">
                  <div>
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">problem</dt>
                    <dd className="mt-1 text-dim">{pr.problem}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">change</dt>
                    <dd className="mt-1 text-dim">{pr.change}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">impact</dt>
                    <dd className="mt-1 font-medium text-ink">{pr.impact}</dd>
                  </div>
                </dl>

                <div className="mt-auto grid gap-3 pt-7 sm:grid-cols-2">
                  <pre className="overflow-x-auto rounded-lg border border-line bg-bg p-3.5 font-mono text-[11.5px] leading-[1.7]">
                    <span className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-faint">NginxProxy</span>
                    <code className="text-dim">{pr.yaml}</code>
                  </pre>
                  <pre className="overflow-x-auto rounded-lg border border-line bg-bg py-3.5 font-mono text-[11.5px] leading-[1.7]">
                    <span className="mb-1.5 block px-3.5 text-[10px] uppercase tracking-[0.14em] text-faint">rendered diff</span>
                    {pr.diff.map((d, j) => (
                      <code
                        key={j}
                        className={`block px-3.5 ${
                          d.op === "+"
                            ? "bg-ok/10 text-ok"
                            : d.op === "-"
                              ? "bg-bad/10 text-bad/90"
                              : "text-faint"
                        }`}
                      >
                        <span className="mr-2 select-none opacity-60">{d.op === " " ? " " : d.op}</span>
                        {d.text}
                      </code>
                    ))}
                  </pre>
                </div>
                <p className="mt-3 font-mono text-[10.5px] text-faint">illustrative config · view PR on GitHub ↗</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
