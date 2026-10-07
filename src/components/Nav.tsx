"use client";

import { useEffect, useState } from "react";
import { profile, sections } from "@/data/profile";
import { container } from "@/lib/styles";
import { scrollToId } from "@/lib/motion";
import { openPalette, useActiveSection, useModKey } from "@/lib/hooks";

const NAV = ["work", "open-source", "writing", "changelog", "contact"] as const;
const ids = sections.map((s) => s.id);

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(ids);
  const mod = useModKey();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? "border-line bg-bg/75 backdrop-blur-xl" : "border-transparent"
      }`}
    >
      <nav aria-label="Primary" className={`${container} flex h-16 items-center justify-between`}>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("top");
          }}
          className="group flex items-center gap-2.5 font-mono text-[13px] text-dim"
        >
          <span className="grid size-7 place-items-center rounded-md border border-line-strong bg-surface text-[11px] font-semibold text-ink transition-colors group-hover:border-accent/60">
            sb
          </span>
          <span className="hidden sm:inline">
            ~/{profile.handle}
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((id) => {
            const s = sections.find((x) => x.id === id)!;
            const on = active === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(id);
                  }}
                  aria-current={on ? "true" : undefined}
                  className={`rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                    on ? "text-ink" : "text-faint hover:text-ink"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={openPalette}
          aria-label="Open command menu"
          className="flex items-center gap-2 rounded-md border border-line-strong bg-surface/80 px-2.5 py-1.5 font-mono text-[12px] text-dim transition-colors hover:border-accent/50 hover:text-ink"
        >
          <span className="md:hidden">menu</span>
          <span className="hidden md:inline">{mod}K</span>
        </button>
      </nav>
    </header>
  );
}
