"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotionPref } from "@/lib/hooks";

const ENVS = ["dev", "staging", "production"] as const;
const FROM = "1.32";
const TARGETS = ["1.33", "1.34"];

type Row = { version: string; status: "ACTIVE" | "UPDATING" };
type Frame = { rows: Row[]; log: string };

// EKS control planes move one minor version at a time, so every env goes
// 1.32 to 1.33 before anything goes to 1.34.
function buildFrames(): Frame[] {
  let rows: Row[] = ENVS.map(() => ({ version: FROM, status: "ACTIVE" }));
  const frames: Frame[] = [{ rows, log: `all clusters on ${FROM}` }];
  for (const target of TARGETS) {
    ENVS.forEach((env, i) => {
      rows = rows.map((r, j) => (j === i ? { ...r, status: "UPDATING" } : r));
      frames.push({ rows, log: `${env}: control plane ${rows[i].version} -> ${target}` });
      rows = rows.map((r, j) => (j === i ? { version: target, status: "ACTIVE" } : r));
      frames.push({ rows, log: `${env}: ${target} ACTIVE` });
    });
  }
  frames.push({ rows, log: "done: 3 environments on 1.34, no service disruption" });
  return frames;
}

export default function EksTable() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const reduce = useReducedMotionPref();
  const frames = useMemo(buildFrames, []);
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setStep(frames.length - 1);
      return;
    }
    setStep(0);
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= frames.length - 1) clearInterval(t);
    }, 620);
    return () => clearInterval(t);
  }, [inView, reduce, run, frames.length]);

  const frame = frames[step];
  const finished = step === frames.length - 1;

  return (
    <div ref={ref} className="flex h-full flex-col font-mono text-[12px]">
      <div className="mb-4 flex items-center justify-between text-[11px] text-faint">
        <span>$ kubectl get clusters --watch</span>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          disabled={!finished}
          className="rounded border border-line-strong px-2 py-0.5 text-dim transition-colors enabled:hover:text-ink disabled:opacity-40"
        >
          ↻ replay
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full text-left">
          <thead className="bg-white/[0.03] text-[10.5px] uppercase tracking-[0.12em] text-faint">
            <tr>
              <th className="px-3 py-2.5 font-normal">env</th>
              <th className="px-3 py-2.5 font-normal">version</th>
              <th className="px-3 py-2.5 font-normal">status</th>
              <th className="hidden px-3 py-2.5 font-normal sm:table-cell">traffic</th>
            </tr>
          </thead>
          <tbody>
            {ENVS.map((env, i) => {
              const r = frame.rows[i];
              const updating = r.status === "UPDATING";
              return (
                <tr key={env} className="border-t border-line">
                  <td className="px-3 py-3 text-ink">{env}</td>
                  <td className="px-3 py-3 tabular-nums text-dim">
                    <span key={r.version} className="inline-block animate-[fadein_.4s_ease]">
                      v{r.version}
                    </span>
                  </td>
                  <td className={`px-3 py-3 ${updating ? "text-warn" : "text-ok"}`}>
                    <span className="flex items-center gap-2">
                      <span className={`size-1.5 rounded-full ${updating ? "bg-warn animate-pulse" : "bg-ok"}`} />
                      {r.status}
                    </span>
                  </td>
                  <td className="hidden px-3 py-3 text-ok sm:table-cell">serving</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-1" aria-hidden>
        {frames.slice(1).map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < step ? "bg-accent" : "bg-white/10"}`}
          />
        ))}
      </div>

      <p className="mt-4 min-h-[1.5em] text-[11.5px] text-dim" aria-live="polite">
        <span className="text-faint">›</span> {frame.log}
      </p>

      <p className="mt-auto pt-5 text-[10.5px] text-faint">illustrative · upgrade order: dev, staging, production</p>
    </div>
  );
}
