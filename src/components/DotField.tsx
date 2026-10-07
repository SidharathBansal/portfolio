"use client";

import { useEffect, useRef } from "react";

const GAP = 28;
const ACCENT = "138,180,255";

type Packet = { row: number; x: number; speed: number; tail: number };

/**
 * Hero background: a quiet dot grid (the same 28px paper as the rest of the site)
 * that brightens around the cursor, with the occasional packet travelling a row.
 */
export default function DotField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let ox = 0;
    let oy = 0;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let nextSpawn = 600;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const packets: Packet[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / GAP) + 1;
      rows = Math.ceil(h / GAP) + 1;
      ox = (w - (cols - 1) * GAP) / 2;
      oy = (h - (rows - 1) * GAP) / 2;
      if (reduce) draw(0);
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;

      for (let r = 0; r < rows; r++) {
        const y = oy + r * GAP;
        for (let c = 0; c < cols; c++) {
          const x = ox + c * GAP;
          const d = Math.hypot(x - mouse.x, y - mouse.y);
          const near = Math.max(0, 1 - d / 170);
          if (near > 0) {
            ctx.fillStyle = `rgba(${ACCENT},${0.1 + near * 0.6})`;
            ctx.beginPath();
            ctx.arc(x, y, 1 + near * 0.9, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = "rgba(255,255,255,0.075)";
            ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
          }
        }
      }

      if (reduce) return;

      nextSpawn -= dt;
      if (nextSpawn <= 0 && packets.length < 4 && rows > 2) {
        packets.push({
          row: 1 + Math.floor(Math.random() * (rows - 2)),
          x: -40,
          speed: 0.12 + Math.random() * 0.14,
          tail: 90 + Math.random() * 90,
        });
        nextSpawn = 900 + Math.random() * 1800;
      }

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.x += p.speed * dt;
        const y = oy + p.row * GAP;
        const g = ctx.createLinearGradient(p.x - p.tail, y, p.x, y);
        g.addColorStop(0, `rgba(${ACCENT},0)`);
        g.addColorStop(1, `rgba(${ACCENT},0.55)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x - p.tail, y);
        ctx.lineTo(p.x, y);
        ctx.stroke();
        ctx.fillStyle = `rgba(${ACCENT},0.95)`;
        ctx.beginPath();
        ctx.arc(p.x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
        if (p.x - p.tail > w) packets.splice(i, 1);
      }
    };

    const loop = (t: number) => {
      const dt = Math.min(48, t - last);
      last = t;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduce || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
      if (mouse.x < -1000) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
    };
    const onLeave = () => {
      mouse.tx = mouse.ty = -9999;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      start();
    }

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
