"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile, sections } from "@/data/profile";
import { scrollToId } from "@/lib/motion";
import { PALETTE_EVENT } from "@/lib/hooks";

type Cmd = {
  id: string;
  group: "Navigate" | "Links" | "Contact";
  label: string;
  hint?: string;
  keywords?: string;
  hidden?: boolean; // only shown when the query matches
  run: () => void | string; // may return a toast message
};

const open = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

function buildCommands(): Cmd[] {
  const nav: Cmd[] = sections.map((s) => ({
    id: `go-${s.id}`,
    group: "Navigate",
    label: s.id === "top" ? "Go to top" : `Go to ${s.label}`,
    hint: s.path,
    keywords: s.id,
    run: () => scrollToId(s.id),
  }));

  const links: Cmd[] = [
    { id: "gh", group: "Links", label: "GitHub", hint: "github.com/sidharathbansal", run: () => open(profile.links.github) },
    { id: "li", group: "Links", label: "LinkedIn", hint: "in/sidharathbansal", run: () => open(profile.links.linkedin) },
    ...profile.openSource.prs.map<Cmd>((pr) => ({
      id: `pr-${pr.number}`,
      group: "Links",
      label: `PR #${pr.number}: ${pr.title.replace(/^feat: /, "")}`,
      hint: "merged",
      keywords: "open source nginx gateway fabric ngf pull request",
      run: () => open(pr.url),
    })),
    ...profile.writing.map<Cmd>((a, i) => ({
      id: `post-${i}`,
      group: "Links",
      label: a.title,
      hint: "medium",
      keywords: "article blog writing",
      run: () => open(a.url),
    })),
  ];
  if (profile.resumeUrl) {
    const url = profile.resumeUrl;
    links.unshift({ id: "cv", group: "Links", label: "Resume (PDF)", keywords: "cv", run: () => open(url) });
  }

  const contact: Cmd[] = [
    {
      id: "copy",
      group: "Contact",
      label: "Copy email address",
      hint: profile.email,
      keywords: "mail",
      run: () => {
        navigator.clipboard?.writeText(profile.email);
        return "Email copied to clipboard";
      },
    },
    {
      id: "mail",
      group: "Contact",
      label: "Send an email",
      keywords: "mail contact",
      run: () => {
        window.location.href = `mailto:${profile.email}`;
      },
    },
    {
      id: "sudo",
      group: "Contact",
      label: "sudo hire sidharath",
      hint: "permission granted",
      hidden: true,
      run: () => {
        window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("Let's talk")}`;
        return "[sudo] permission granted. Opening mail...";
      },
    },
  ];

  return [...nav, ...links, ...contact];
}

function matches(c: Cmd, q: string) {
  const hay = `${c.label} ${c.hint ?? ""} ${c.keywords ?? ""}`.toLowerCase();
  if (c.hidden) return q.length >= 3 && ("sudo hire sidharath".startsWith(q) || q.startsWith("sudo"));
  return q.split(/\s+/).every((w) => hay.includes(w));
}

export default function CommandPalette() {
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const commands = useMemo(buildCommands, []);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => commands.filter((c) => (q ? matches(c, q) : !c.hidden)), [commands, q]);

  const show = useCallback(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setIndex(0);
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    setOpen(false);
    restoreRef.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, [contenteditable=true]");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) hide();
        else show();
      } else if (e.key === "/" && !isOpen && !typing) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_EVENT, show);
    };
  }, [isOpen, show, hide]);

  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      html.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => setIndex(0), [q]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const run = (c: Cmd | undefined) => {
    if (!c) return;
    hide();
    // let the dialog close before scrolling / navigating
    setTimeout(() => {
      const msg = c.run();
      if (msg) setToast(msg);
    }, 60);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[index]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      hide();
    } else if (e.key === "Tab") {
      e.preventDefault(); // keep focus inside the dialog
    }
  };

  let lastGroup = "";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-4 pt-[14vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onMouseDown={(e) => e.target === e.currentTarget && hide()}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              className="w-full max-w-xl overflow-hidden rounded-xl border border-line-strong bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onKeyDown={onKeyDown}
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <span className="font-mono text-sm text-accent" aria-hidden>
                  ❯
                </span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="h-13 w-full bg-transparent font-mono text-sm text-ink placeholder:text-faint focus:outline-none"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="palette-list"
                  aria-activedescendant={results[index] ? `cmd-${results[index].id}` : undefined}
                  spellCheck={false}
                  autoComplete="off"
                />
                <kbd className="rounded border border-line-strong px-1.5 py-0.5 font-mono text-[10px] text-faint">esc</kbd>
              </div>

              <ul id="palette-list" ref={listRef} role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
                {results.length === 0 && (
                  <li className="px-3 py-8 text-center font-mono text-[13px] text-faint">
                    command not found: {query}
                  </li>
                )}
                {results.map((c, i) => {
                  const header = c.group !== lastGroup ? c.group : null;
                  lastGroup = c.group;
                  const on = i === index;
                  return (
                    <li key={c.id} role="presentation">
                      {header && (
                        <p className="px-3 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-faint first:pt-1">
                          {header}
                        </p>
                      )}
                      <div
                        id={`cmd-${c.id}`}
                        role="option"
                        aria-selected={on}
                        data-index={i}
                        onMouseMove={() => setIndex(i)}
                        onClick={() => run(c)}
                        className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                          on ? "bg-white/[0.06] text-ink" : "text-dim"
                        }`}
                      >
                        <span className={`truncate ${c.id === "sudo" ? "font-mono text-ok" : ""}`}>{c.label}</span>
                        {c.hint && <span className="shrink-0 font-mono text-[11px] text-faint">{c.hint}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[10.5px] text-faint">
                <span>↑↓ navigate · ↵ run</span>
                <span>try: sudo hire sidharath</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="fixed bottom-12 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-line-strong bg-surface px-4 py-2.5 font-mono text-[12px] text-ink shadow-xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <span className="mr-2 text-ok">✓</span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
