# MakeLocal Design System Style Guide

This style guide documents the design system extracted from the high-fidelity designs and configured for our Next.js + Tailwind CSS project.

## Overview

The MakeLocal design system is modern, clean, and optimized for both light and dark modes. It features a bright blue primary color, soft neutral backgrounds, and the Plus Jakarta Sans typeface for a professional yet approachable look.

---

## Color Palette

### Primary Colors

```css
--primary: #259df4           /* Bright blue - primary brand color */
--electric-accent: #25f4a2   /* Teal green - accent for coordinators */
```

**Usage:**
- `primary`: Main CTAs, links, active states, focus rings
- `electric-accent`: Special coordinator-specific CTAs and highlights

### Background Colors

```css
--background-light: #f5f7f8  /* Off-white for light mode */
--background-dark: #101a22   /* Dark blue-gray for dark mode */
```

**Usage:**
- Use `bg-background-light dark:bg-background-dark` for main backgrounds
- Backgrounds support 80% opacity with backdrop blur for sticky headers/footers

### Neutral Colors (Tailwind Slate)

**Light Mode:**
- Text Primary: `slate-900` (#0f172a)
- Text Secondary: `slate-600` (#475569)
- Borders: `slate-200` (#e2e8f0)
- Subtle backgrounds: `slate-100` (#f1f5f9)
- Very subtle: `slate-50` (#f8fafc)

**Dark Mode:**
- Text Primary: `white` (#ffffff)
- Text Secondary: `slate-400` (#94a3b8)
- Borders: `slate-800` (#1e293b)
- Cards/elevated: `slate-900` (#0f172a)
- Subtle backgrounds: `slate-800` (#1e293b)

### Semantic Colors

```css
--destructive: #ef4444       /* Red for errors/destructive actions */
```

---

## Typography

### Font Family

**Primary:** Plus Jakarta Sans (weights: 400, 500, 700, 800)

```css
font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif
```

**Tailwind class:** `font-display` or `font-sans`

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing | Class |
|---------|------|--------|-------------|----------------|-------|
| Hero H1 | 2.5rem (40px) → 3rem (48px) | 800 | tight | -0.033em | `text-4xl md:text-5xl font-extrabold tracking-tighter` |
| H1 | 1.375rem (22px) | 700 | tight | -0.015em | `text-[22px] font-bold leading-tight tracking-[-0.015em]` |
| H2 | 1.125rem (18px) | 700 | tight | -0.015em | `text-lg font-bold leading-tight tracking-[-0.015em]` |
| H3 | 1rem (16px) | 700 | normal | 0 | `text-base font-bold leading-normal` |
| Body | 1rem (16px) | 400 | normal | 0 | `text-base font-normal leading-normal` |
| Small | 0.875rem (14px) | 400 | normal | 0 | `text-sm font-normal leading-normal` |
| Tiny | 0.75rem (12px) | 500 | - | 0 | `text-xs font-medium` |
| Button | 1rem (16px) | 700 | normal | 0.015em | `text-base font-bold leading-normal tracking-[0.015em]` |

### Font Weights

- Regular: 400
- Medium: 500
- Bold: 700
- Extra Bold: 800

---

## Border Radius

```css
--radius-sm: 0.25rem    /* 4px */
--radius: 0.5rem        /* 8px - default */
--radius-md: 0.5rem     /* 8px */
--radius-lg: 1rem       /* 16px */
--radius-xl: 1.5rem     /* 24px */
--radius-full: 9999px   /* Fully rounded */
```

**Common Patterns:**
- Cards: `rounded-xl` (24px)
- Buttons: `rounded-xl` (24px)
- Inputs: `rounded-lg` (16px)
- Tags/Badges: `rounded-full` (pill shape)
- Color swatches: `rounded-full`
- Product images: `rounded-lg`

---

## Components

### Buttons

#### Primary Button
```tsx
<button className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-base font-bold tracking-[0.015em] text-white">
  Add to queue
</button>
```

#### Secondary Button (Light/Ghost on Dark)
```tsx
<button className="flex h-12 px-5 rounded-xl bg-slate-100/20 dark:bg-slate-700/50 backdrop-blur-sm text-white text-base font-bold tracking-[0.015em]">
  Talk to us
</button>
```

#### Accent Button (Coordinator)
```tsx
<button className="flex h-12 px-5 rounded-xl bg-electric-accent text-slate-900 text-base font-bold tracking-[0.015em]">
  Start Your Journey
</button>
```

#### Tertiary/Ghost Button
```tsx
<button className="flex h-12 px-5 rounded-xl bg-transparent text-primary text-base font-bold tracking-[0.015em]">
  Browse more
</button>
```

#### Small Button
```tsx
<button className="flex h-9 px-3 rounded-lg bg-primary/20 text-primary text-sm font-bold tracking-[0.015em]">
  Personalize
</button>
```

### Icon Buttons
```tsx
<button className="flex h-12 w-12 items-center justify-center rounded-full text-current">
  <span className="material-symbols-outlined">arrow_back</span>
</button>
```

**Heights:**
- Large: `h-12` (48px)
- Small: `h-9` (36px)

**Padding:**
- Standard: `px-5` with `h-12`
- Small: `px-3` with `h-9`

---

### Cards

```tsx
<div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-none">
  {/* Card content */}
</div>
```

**Key patterns:**
- Rounded: `rounded-xl` (24px)
- Padding: `p-4` or `p-6`
- Background: `bg-white dark:bg-slate-900`
- Shadow: `shadow-sm dark:shadow-none` (subtle in light, none in dark)
- Borders: Optional, use `border border-slate-200 dark:border-slate-800`

---

### Forms

#### Text Input
```tsx
<input
  type="text"
  className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary"
  placeholder="Your text here"
/>
```

#### Label
```tsx
<label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">
  Your Initials
</label>
```

---

### Tags/Badges

```tsx
<span className="rounded-full bg-slate-200 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
  ~20 min print
</span>
```

**Pattern:**
- Fully rounded: `rounded-full`
- Subtle background: `bg-slate-200 dark:bg-slate-800`
- Small text: `text-xs font-medium`
- Padding: `px-3 py-1` or `px-2 py-1`

---

### Color Swatches

```tsx
{/* Selected state */}
<button className="size-10 rounded-full border-2 border-primary bg-red-500 ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark" />

{/* Unselected state */}
<button className="size-10 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-blue-500" />
```

**Sizes:**
- Standard: `size-10` (40px)
- Small: `size-8` (32px)
- Mini: `size-6` (24px)

**Selection indicator:** Combine `border-primary`, `ring-2`, `ring-primary`, and `ring-offset-2`

---

### Accordion/Details

```tsx
<details className="group p-4">
  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
    Pickup at booth
    <span className="transition-transform duration-300 group-open:rotate-180">
      <span className="material-symbols-outlined">expand_more</span>
    </span>
  </summary>
  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
    Content here...
  </p>
</details>
```

**Container:**
```tsx
<div className="flex flex-col divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
  {/* Multiple details elements */}
</div>
```

---

### Headers (Sticky with Backdrop Blur)

```tsx
<header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
  <div className="flex items-center p-4">
    {/* Header content */}
  </div>
</header>
```

**Pattern:**
- Sticky: `sticky top-0`
- Z-index: `z-10` (or `z-20`, `z-30` for overlays)
- Semi-transparent: `bg-background-light/80 dark:bg-background-dark/80`
- Blur: `backdrop-blur-sm`

---

### Footers (Fixed with Backdrop Blur)

```tsx
<footer className="fixed bottom-0 z-10 w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4">
  {/* Footer content */}
</footer>
```

---

### Icons

**Library:** Material Symbols Outlined

**CDN:**
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
```

**Usage:**
```tsx
<span className="material-symbols-outlined">arrow_back</span>
<span className="material-symbols-outlined text-3xl">widgets</span>
```

**Common icons:**
- `arrow_back` - Back navigation
- `shopping_bag` - Cart/queue
- `menu` - Menu toggle
- `close` - Close/dismiss
- `expand_more` - Dropdown/accordion
- `delete` - Remove item
- `store`, `palette`, `print`, `local_mall` - Feature icons

---

## Layout Patterns

### Container Queries

Uses Tailwind's `@container` utilities:

```tsx
<div className="@container">
  <div className="@[480px]:p-4 p-0">
    {/* Responsive content */}
  </div>
</div>
```

### Responsive Grid

```tsx
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 p-4">
  {/* Product cards */}
</div>
```

### Snap Scrolling

```tsx
<div className="flex snap-x snap-mandatory overflow-x-auto gap-4">
  <div className="w-full shrink-0 snap-center">
    {/* Scrollable items */}
  </div>
</div>
```

---

## Spacing

Uses Tailwind's default 4px-based spacing scale:

**Common gaps:**
- `gap-2` (8px)
- `gap-3` (12px)
- `gap-4` (16px)
- `gap-6` (24px)
- `gap-8` (32px)

**Common padding:**
- `p-4` (16px) - standard container padding
- `p-6` (24px) - card padding
- `px-3 py-1` - tag/badge
- `px-4` - horizontal page padding
- `py-3` - input padding

---

## Dark Mode

### Implementation

Dark mode uses Tailwind's class-based dark mode:

```html
<html class="dark">
```

### Pattern

Always provide dark mode variants:

```tsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
```

**Common pairings:**
- `bg-white dark:bg-slate-900`
- `text-slate-900 dark:text-white`
- `text-slate-600 dark:text-slate-400`
- `border-slate-200 dark:border-slate-800`
- `bg-slate-200 dark:bg-slate-800`

---

## Animations

### Transitions

```tsx
/* Accordion icon rotation */
<span className="transition-transform duration-300 group-open:rotate-180">

/* Smooth opacity */
<div className="transition-opacity duration-200">
```

### Marquee

```css
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.marquee {
  display: inline-block;
  white-space: nowrap;
  animation: marquee 30s linear infinite;
}
```

---

## Accessibility

### Focus States

All interactive elements use primary color for focus rings:

```tsx
focus:border-primary focus:ring-primary
focus:ring-2 focus:ring-primary focus:ring-offset-2
```

### Semantic HTML

- Use proper heading hierarchy (h1, h2, h3)
- Use `<button>` for clickable actions
- Use `<details>` and `<summary>` for accordions
- Provide `alt` attributes for images

---

## Usage Examples

### Product Card (Complete)

```tsx
<div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-none">
  <div className="w-full bg-slate-200 dark:bg-slate-800 aspect-square bg-cover rounded-lg"
       style={{ backgroundImage: 'url(...)' }} />

  <div className="flex flex-col gap-3">
    <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">
      Keychain
    </p>
    <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
      A stylish and durable keychain, personalized with your initials.
    </p>

    <div className="flex gap-2 flex-wrap">
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
        ~20 min print
      </span>
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
        PLA
      </span>
    </div>

    <div className="flex items-center gap-2 pt-2">
      <button className="size-6 rounded-full bg-red-500 border-2 border-primary ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-slate-900" />
      <button className="size-6 rounded-full bg-blue-500 border-2 border-slate-300 dark:border-slate-700" />
      <button className="size-6 rounded-full bg-green-500 border-2 border-slate-300 dark:border-slate-700" />

      <button className="flex-1 ml-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-primary/20 text-primary text-sm font-bold leading-normal tracking-[0.015em]">
        <span className="truncate">Personalize</span>
      </button>
    </div>
  </div>
</div>
```

---

## Component Library Compatibility

### Shadcn/UI

This design system is fully compatible with shadcn/ui. The CSS variables in `globals.css` follow shadcn conventions:

- `--primary`, `--secondary`, `--accent`, etc.
- `--radius` for border radius
- `--background`, `--foreground` for theming

You can use shadcn components directly, and they'll inherit the MakeLocal design tokens.

---

## Quick Reference

**Primary Action:** Blue button with `bg-primary text-white`
**Secondary Action:** Ghost/outline with `text-primary` or subtle background
**Accent (Coordinators):** `bg-electric-accent text-slate-900`

**Cards:** `rounded-xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-none`
**Inputs:** `rounded-lg focus:border-primary focus:ring-primary`
**Tags:** `rounded-full bg-slate-200 dark:bg-slate-800 text-xs`

**Sticky Headers/Footers:** Semi-transparent background + `backdrop-blur-sm`
**Text Hierarchy:** `slate-900/white` → `slate-600/slate-400` → `slate-500/slate-500`

**Spacing:** Use `gap-4` and `p-4` as defaults, scale up/down as needed.
