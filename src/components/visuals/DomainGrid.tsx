"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { useReducedMotionPref } from "@/lib/hooks";

const CELLS = 100;

// Deterministic shuffle so cells flip in a scattered (not left-to-right) order.
function order(seed: number) {
  let s = seed;
  const rand = () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const idx = Array.from({ length: CELLS }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const rank = new Array<number>(CELLS);
  idx.forEach((cell, r) => (rank[cell] = r));
  return rank;
}

export default function DomainGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const reduce = useReducedMotionPref();
  const [pct, setPct] = useState(0);
  const touched = useRef(false);
  const rank = useMemo(() => order(5519), []);

  useEffect(() => {
    if (!inView || touched.current) return;
    if (reduce) {
      setPct(100);
      return;
    }
    const ctrl = animate(0, 100, {
      duration: 3.6,
      ease: [0.45, 0, 0.25, 1],
      delay: 0.3,
      onUpdate: (v) => {
        if (!touched.current) setPct(Math.round(v));
      },
    });
    return () => ctrl.stop();
  }, [inView, reduce]);

  return (
    <div ref={ref} className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between font-mono text-[11px] text-faint">
        <span>production ingress</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-[2px] bg-white/15" /> kong
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-[2px] bg-accent" /> ngf
          </span>
        </span>
      </div>

      <div className="grid grid-cols-20 gap-1" role="img" aria-label={`${pct}% of domains served by NGINX Gateway Fabric`}>
        {rank.map((r, i) => {
          const on = r < pct;
          return (
            <span
              key={i}
              className={`aspect-square rounded-[2px] transition-[background-color,box-shadow] duration-500 ${
                on ? "bg-accent/85 shadow-[0_0_8px_rgba(138,180,255,0.35)]" : "bg-white/[0.09]"
              }`}
            />
          );
        })}
      </div>

      <div className="mt-6">
        <label htmlFor="ngf-scrub" className="sr-only">
          Migration progress
        </label>
        <input
          id="ngf-scrub"
          type="range"
          min={0}
          max={100}
          value={pct}
          onChange={(e) => {
            touched.current = true;
            setPct(Number(e.target.value));
          }}
          className="range"
          style={{ ["--fill" as string]: `${pct}%` }}
        />
        <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[11.5px]">
          <span className="text-ink">
            <span className="tabular-nums">{pct}%</span> <span className="text-faint">on ngf</span>
          </span>
          <span className="text-center text-faint">
            5xx <span className="text-ok">0</span>
          </span>
          <span className="text-right text-faint">
            downtime <span className="text-ok">0</span>
          </span>
        </div>
      </div>

      <p className="mt-auto pt-5 font-mono text-[10.5px] text-faint">illustrative · drag to scrub the migration</p>
    </div>
  );
}
