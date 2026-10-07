"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { useReducedMotionPref } from "@/lib/hooks";

const SAVED_PER_MONTH = 4.7; // ₹ lakh / month, from decommissioning orphaned resources
const AI_AFTER = 70; // AI workload spend after RIs + commitment plans (relative, before = 100)

export default function CostViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const reduce = useReducedMotionPref();
  const [saved, setSaved] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setSaved(SAVED_PER_MONTH);
      return;
    }
    const ctrl = animate(0, SAVED_PER_MONTH, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: setSaved });
    return () => ctrl.stop();
  }, [inView, reduce]);

  return (
    <div ref={ref} className="flex h-full flex-col">
      <p className="font-mono text-[11px] text-faint">orphaned resources, decommissioned</p>
      <p className="mt-3 text-[clamp(2.75rem,6vw,4.25rem)] font-semibold leading-none tracking-[-0.04em] text-ink tabular-nums">
        ₹{saved.toFixed(1)}L<span className="text-2xl font-medium tracking-tight text-faint">/month</span>
      </p>
      <p className="mt-2 font-mono text-[12px] text-dim">
        ~₹{(SAVED_PER_MONTH * 12).toFixed(1)}L a year
      </p>

      <div className="my-7 h-px bg-line" />

      <p className="font-mono text-[11px] text-faint">AI workload spend · on-demand to RIs + commitment plans</p>
      <div className="mt-4 space-y-3 font-mono text-[11.5px]">
        <div className="flex items-center gap-3">
          <span className="w-12 shrink-0 text-faint">before</span>
          <div className="h-6 flex-1 rounded bg-white/[0.04]">
            <div className="h-full w-full rounded bg-white/15" />
          </div>
          <span className="w-10 shrink-0 text-right tabular-nums text-dim">100</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-12 shrink-0 text-faint">after</span>
          <div className="h-6 flex-1 rounded bg-white/[0.04]">
            <motion.div
              className="h-full rounded bg-accent/85"
              initial={{ width: "100%" }}
              animate={{ width: inView ? `${AI_AFTER}%` : "100%" }}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="w-10 shrink-0 text-right tabular-nums text-ink">{AI_AFTER}</span>
        </div>
      </div>
      <p className="mt-3 text-right font-mono text-[11.5px] text-ok">-30%</p>

      <p className="mt-auto pt-5 font-mono text-[10.5px] text-faint">bars to scale · indexed spend, not ₹</p>
    </div>
  );
}
