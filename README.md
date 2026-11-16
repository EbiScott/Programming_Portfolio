# Programming Portfolio

A brutalist one-page portfolio for full-stack and backend work: APIs, Python
bots, automation, and the front ends that ship with them.

Live: https://ebi-programming.vercel.app

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind v4 (CSS-first) with a custom brutalist system
- Static export to `out/`, deployed on Vercel
- A local Node content editor (no dependencies) for day-to-day edits

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

The static site is written to `out/`.

## Checks

```bash
npm run test          # formatting tests (node:test)
npm run check:content # validates app/content/site.json
npm run lint
npm run typecheck
```

## Edit content

Everything that changes over time lives in `app/content/site.json`. Use the
local editor rather than editing the JSON by hand:

```bash
npm run edit
```

It opens http://localhost:4321. Save writes the JSON locally; Publish commits
`app/content/site.json` and `public/` and pushes to GitHub, which triggers a
Vercel rebuild.

## Structure

```
app/
  components/        # page sections, tiles, lightbox
  content/site.json  # profile, experience, projects, toolbox, certs, posts
  content/site.ts    # typed access to the JSON
  globals.css        # the brutalist design system
  layout.tsx         # fonts + metadata
  page.tsx           # section composition
public/              # résumé and uploaded images
scripts/
  editor/            # local editor server + UI (never deployed)
  gen-site.mjs       # one-time baseline content generator
  check-content.mjs  # content validation
  format.test.mjs    # formatting tests
```
