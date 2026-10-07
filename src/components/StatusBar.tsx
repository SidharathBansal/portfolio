"use client";

import { useEffect, useState } from "react";
import { profile, sections } from "@/data/profile";
import { openPalette, useActiveSection, useModKey } from "@/lib/hooks";

const ids = sections.map((s) => s.id);

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: profile.timezone,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Editor-style status bar pinned to the bottom of the viewport (md+). */
export default function StatusBar() {
  const active = useActiveSection(ids);
  const mod = useModKey();
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const t = setInterval(tick, 10_000);
    return () => clearInterval(t);
  }, []);

  const path = sections.find((s) => s.id === active)?.path ?? "~";

  return (
    <div
      role="contentinfo"
      aria-label="Status bar"
      className="fixed inset-x-0 bottom-0 z-40 hidden h-8 items-center justify-between border-t border-line bg-bg/85 px-4 font-mono text-[11px] text-faint backdrop-blur-xl md:flex"
    >
      <div className="flex items-center gap-5">
        <span className="flex items-center gap-2">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full rounded-full bg-ok animate-ping-soft" />
            <span className="relative inline-flex size-1.5 rounded-full bg-ok" />
          </span>
          all systems operational
        </span>
        <span className="text-dim" aria-live="polite">
          {path}
        </span>
      </div>
      <div className="flex items-center gap-5">
        <span suppressHydrationWarning>
          {profile.location.split(",")[0]} {time ?? "--:--"} IST
        </span>
        <button
          type="button"
          onClick={openPalette}
          className="rounded px-1.5 py-0.5 text-dim transition-colors hover:bg-white/5 hover:text-ink"
        >
          {mod}K commands
        </button>
      </div>
    </div>
  );
}
