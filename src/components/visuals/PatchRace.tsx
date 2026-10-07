"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { useReducedMotionPref } from "@/lib/hooks";

const MANUAL = 48; // hours
const AUTO = 1; // hours

export default function PatchRace() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const reduce = useReducedMotionPref();
  const [t, setT] = useState(0); // simulated hours elapsed
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setT(MANUAL);
      return;
    }
    setT(0);
    const ctrl = animate(0, MANUAL, { duration: 5.5, ease: "linear", delay: 0.3, onUpdate: setT });
    return () => ctrl.stop();
  }, [inView, reduce, run]);

  const autoDone = t >= AUTO;
  const manualDone = t >= MANUAL;
  const hh = Math.floor(t);

  const rows = [
    {
      name: "manual patching",
      sub: "server by server",
      width: (Math.min(t, MANUAL) / MANUAL) * 100,
      done: manualDone,
      total: MANUAL,
      bar: "bg-white/25",
    },
    {
      name: "ansible + azure devops",
      sub: "pipeline, 100+ servers",
      width: (Math.min(t, AUTO) / MANUAL) * 100,
      done: autoDone,
      total: AUTO,
      bar: "bg-accent",
    },
  ];

  return (
    <div ref={ref} className="flex h-full flex-col font-mono">
      <div className="mb-6 flex items-center justify-between text-[11px] text-faint">
        <span>
          patch window · T+<span className="tabular-nums text-ink">{String(hh).padStart(2, "0")}h</span>
        </span>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          disabled={!manualDone}
          className="rounded border border-line-strong px-2 py-0.5 text-dim transition-colors enabled:hover:text-ink disabled:opacity-40"
        >
          ↻ replay
        </button>
      </div>

      <div className="space-y-7">
        {rows.map((r) => (
          <div key={r.name}>
            <div className="mb-2 flex items-baseline justify-between gap-3 text-[11.5px]">
              <span className="text-ink">
                {r.name} <span className="text-faint">· {r.sub}</span>
              </span>
              <span className={r.done ? "text-ok" : "text-faint"}>
                {r.done ? `✓ ${r.total}h` : `${hh}h...`}
              </span>
            </div>
            <div className="relative h-7 rounded bg-white/[0.04]">
              <div className={`absolute inset-y-0 left-0 rounded ${r.bar}`} style={{ width: `${r.width}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-between text-[10.5px] text-faint" aria-hidden>
        <span>0h</span>
        <span>12h</span>
        <span>24h</span>
        <span>36h</span>
        <span>48h</span>
      </div>

      <p className="mt-auto pt-5 text-[10.5px] text-faint">to scale · the 1-hour bar really is that small</p>
    </div>
  );
}
