# Architecture Overview

## Executive Summary
MakeLocal WebSummit Microsite is a single Next.js 16 application using the App Router to render a marketing/demo experience for on-site 3D printing.

## Technology Stack
- Next.js 16.0.1 (App Router)
- React 19.2.0 with React Compiler
- Tailwind CSS 4
- TypeScript (strict mode)

## Architecture Pattern
Single-page marketing site rendered via Next.js server components with a single entry point `src/app/page.tsx`. Styling tokens live in `globals.css`, aligned with the design system documented in `STYLEGUIDE.md`.

## Data & State
No backend integration yet; personalization and order flows are mocked in UI components. Future API calls will target endpoints described in `docs/makelocal-api/`.

## UI Composition
- `layout.tsx` wires global fonts and theming.
- `globals.css` defines Tailwind tokens and design system variables.
- `page.tsx` composes hero, product grid, queue banner, and placeholders for upcoming sections (checkout, status, coordinator mode).

## Development Workflow
Use Bun/Next dev server for iteration (`bun dev`). Lint/format enforced via Biome.

## Deployment Considerations
Next.js static export or server rendering on Vercel/Fly.io. Ensure environment supports React 19 and Tailwind 4.

## Future Integrations
- Connect to MakeLocal API endpoints (see `docs/makelocal-api/`).
- Implement real-time queue via WebSockets or polling.
- Add coordinator mode drawer leveraging accent color tokens.
