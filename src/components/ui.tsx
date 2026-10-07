"use client";

import { motion } from "framer-motion";
import { easeOut } from "@/lib/motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function Reveal({ children, className, delay = 0, y = 24 }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: easeOut, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Masked line reveal for headlines: text slides up from behind its own baseline. */
export function MaskLine({
  children,
  delay = 0,
  className,
  animateOnMount = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  animateOnMount?: boolean;
}) {
  const variants = {
    hidden: { y: "105%" },
    visible: { y: "0%", transition: { duration: 1, ease: easeOut, delay } },
  };
  // The trigger lives on the (unclipped) wrapper: the inner span starts fully
  // hidden by overflow, so it would never register as in view itself.
  return (
    <motion.span
      className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`}
      initial="hidden"
      {...(animateOnMount
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, margin: "0px 0px -10% 0px" } })}
    >
      <motion.span className="block" variants={variants}>
        {children}
      </motion.span>
    </motion.span>
  );
}

export function SectionHeader({
  index,
  label,
  title,
  lede,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
}) {
  return (
    <header className="mb-12 md:mb-16">
      <Reveal>
        <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          {label}
        </p>
      </Reveal>
      <h2 className="max-w-4xl text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
        <MaskLine>{title}</MaskLine>
      </h2>
      {lede && (
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-dim md:text-lg">{lede}</p>
        </Reveal>
      )}
    </header>
  );
}
