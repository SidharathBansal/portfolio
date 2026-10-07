# sidharath - portfolio

Personal site for Sidharath Bansal, Platform Engineer. Next.js 15 (App Router), React 19, Tailwind v4, framer-motion.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (also type-checks + lints)
```

## Editing content

All copy, numbers, links and quotes live in **`src/data/profile.ts`**. Components only read from it.

- To show a **Resume** button: put `resume.pdf` in `public/` and set `resumeUrl: "/resume.pdf"`.
- Recommendation `highlight`s must be exact substrings of their `quote`.

## Structure

```
src/app/            layout, page, globals.css, opengraph-image, icon
src/components/     one file per section + Nav, StatusBar, CommandPalette, DotField
src/components/visuals/   interactive case-study visuals (DomainGrid, EksTable, CostViz, PatchRace)
src/lib/            motion helpers, hooks, shared styles
```

Keyboard: `⌘K` / `Ctrl K` / `/` opens the command palette.

## Deploy

Push to GitHub and import into Vercel (no config needed). Optionally set `NEXT_PUBLIC_SITE_URL` to your domain so Open Graph URLs are absolute.

The previous version of the site is kept in `_archive/` (excluded from the build).
