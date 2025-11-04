# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MakeLocal Web Summit Demo - A Next.js application showcasing local manufacturing through 3D printing. Users can browse products, personalize items with colors and text, and place demo orders to see the local manufacturing process in action.

## Commands

### Development
```bash
# Start development server (runs on http://localhost:3000)
bun dev

# Build for production
bun run build

# Start production server
bun start
```

### Code Quality
```bash
# Run linter (Biome)
bun run lint

# Format code
bun run format
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.0 with React Compiler enabled
- **Styling**: Tailwind CSS 4 + custom design system
- **TypeScript**: Strict mode enabled
- **Linting/Formatting**: Biome (replaces ESLint + Prettier)
- **Package Manager**: Bun

## Architecture

### App Structure
```
src/app/
  ├── layout.tsx       # Root layout with Plus Jakarta Sans font
  ├── page.tsx         # Home page (single-page demo)
  └── globals.css      # Design system tokens + Tailwind
```

### Path Aliases
- `@/*` maps to `src/*` (configured in tsconfig.json)

### Key Features
1. **Next.js App Router**: Uses React Server Components by default
2. **React Compiler**: Enabled in next.config.ts for automatic memoization
3. **Container Queries**: Uses Tailwind's `@container` for responsive components
4. **Dark Mode**: Class-based (`class="dark"` on `<html>`), always enabled in demo

## Design System

**Comprehensive documentation in STYLEGUIDE.md** - reference this file for all design decisions.

Key highlights:
- **Primary Color**: `#259df4` (bright blue)
- **Accent Color**: `#25f4a2` (teal green, for coordinator-specific features)
- **Typography**: Plus Jakarta Sans (400, 500, 700, 800)
- **Border Radius**: Cards and buttons use `rounded-xl` (24px)
- **Dark Mode**: Always provide dark variants (`bg-white dark:bg-slate-900`)

### Custom Tailwind Tokens
All CSS variables are defined in `src/app/globals.css`:
- Colors: `primary`, `electric-accent`, `background-light`, `background-dark`
- Typography: `font-display`, `font-sans`
- Radius: `radius-sm` through `radius-full`

### Material Symbols Icons
- Library: Material Symbols Outlined (loaded via Google Fonts CDN)
- Usage: `<span className="material-symbols-outlined">icon_name</span>`
- Common icons: `arrow_back`, `menu`, `shopping_bag`, `close`, `expand_more`

## Component Patterns

### Sticky Headers with Blur
```tsx
<header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
```

### Product Cards
Follow the pattern in `src/app/page.tsx` lines 88-132:
- Card wrapper: `rounded-xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-none`
- Product image: `aspect-square bg-cover rounded-lg`
- Color swatches: `size-6 rounded-full` with ring for selection
- Tags: `rounded-full bg-slate-200 dark:bg-slate-800 text-xs`

### Buttons
- Primary: `bg-primary text-white rounded-xl h-12 px-5`
- Secondary/Ghost: `bg-primary/20 text-primary rounded-lg h-9 px-3`
- Accent (coordinators): `bg-electric-accent text-slate-900`

## Biome Configuration

Configured in `biome.json`:
- **VCS**: Git integration enabled with `.gitignore` support
- **Formatter**: 2-space indentation
- **Linter**: Recommended rules + Next.js and React domains
- **Assist**: Auto-organize imports on save

## Important Notes

1. **React Compiler**: Automatic memoization enabled - avoid manual `useMemo`/`useCallback` unless necessary
2. **Server Components**: Default in App Router - add `"use client"` only when needed (interactivity, hooks)
3. **TypeScript Strict Mode**: All type errors must be resolved
4. **Container Queries**: Prefer `@container` over media queries for component-level responsiveness
5. **Dark Mode Always On**: The demo assumes dark mode via `class="dark"` on root HTML element

## Design System Reference

For detailed component specifications, color usage, typography scale, accessibility patterns, and complete examples, always reference `STYLEGUIDE.md`.

## Development Workflow

1. Code changes auto-reload via Next.js Fast Refresh
2. Run `bun run lint` before committing
3. Format code with `bun run format` (or rely on editor integration)
4. TypeScript compilation happens during `bun dev` and `bun run build`
