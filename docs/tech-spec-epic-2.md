# Epic Technical Specification: Catalog & Discovery

Date: 2025-11-06
Author: MakeLocal WebSimmit Demo
Epic ID: 2
Status: Draft

---

## Overview

Epic 2 creates the compelling first impression and product discovery experience for the MakeLocal Web Summit microsite. This epic focuses on building the visual foundation that captures visitor attention within 5 seconds, communicates "manufacturing in motion" through live queue messaging, and enables product discovery through a browsable catalog. The epic aligns with the PRD's core requirement for "Immediate Awe" (Section 4) and supports the business goal of achieving 60%+ of visitors starting the product personalization flow.

The catalog and discovery experience builds on Epic 1's foundation (PWA and performance optimization) to deliver a responsive, accessible, and performant browsing experience. This epic establishes the UI patterns and component architecture that will be extended in Epic 3 (Product Personalization) and Epic 4 (Cart & Checkout Flow).

## Objectives and Scope

### In-Scope

- **Responsive Hero Section**
  - Hero displays above the fold on mobile and desktop
  - Background image/animation preloaded without blocking first contentful paint
  - Headline communicates MakeLocal's value proposition clearly
  - Primary CTA "Browse Catalog" is prominent and accessible
  - Responsive design: Works on mobile (320px+) and tablet/desktop (768px+)
  - Meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)

- **Live Queue Banner Component**
  - Marquee/ticker banner displays curated queue messaging
  - Messages cycle through showing realistic names, items, and progress
  - Banner is visually distinct but doesn't distract from main content
  - Static copy works initially (stretch: dynamic simulation in Epic 5)
  - Accessible: Screen readers can access queue messages
  - Performance: Smooth animation without jank

- **Product Catalog Grid**
  - Grid displays 6-9 product cards with consistent aspect ratios
  - Cards show: title, description, ETA, material tags
  - Grid is responsive: 1 column mobile, 2-3 columns tablet, 3-4 columns desktop
  - Cards are clickable and navigate to product detail
  - Loading state shown while products load
  - Empty state if no products available

- **Product Card Component**
  - Card displays product image with consistent aspect ratio
  - Metadata visible: title, short description, estimated print time, material tags
  - Color swatches preview available colors (if applicable)
  - "Personalize" CTA button is clear and accessible
  - Card has hover/focus states for interactivity feedback
  - Card is keyboard navigable (Tab, Enter to select)

- **Product Detail View**
  - Detail view opens as modal or dedicated route
  - Shows: full description, all images, all color options, detailed ETA, material info
  - "Add to Cart" or "Personalize" CTA is prominent
  - Can close/navigate back to catalog
  - Responsive: Works well on mobile and desktop
  - Images lazy load if multiple variants shown

### Out-of-Scope

- Product personalization functionality (deferred to Epic 3)
- Cart functionality (deferred to Epic 4)
- Dynamic queue simulation (deferred to Epic 5 stretch goals)
- Product search or filtering (not in PRD scope)
- Product comparison features (not in PRD scope)
- Backend API integration for product data (uses static JSON initially)

## System Architecture Alignment

Epic 2 aligns with the Next.js 16 App Router architecture documented in the Architecture Overview. Components will be built as React Server Components where possible, with Client Components for interactive elements (hero animations, queue banner, product cards). The architecture follows the single-page marketing site pattern with components composed in `src/app/page.tsx`.

The epic builds on Epic 1's performance optimizations (LCP < 2.5s, JS < 200KB gzipped) and leverages Next.js Image component for optimized image loading. The component structure establishes patterns for:

- **Component composition**: Reusable UI components (Hero, QueueBanner, ProductCard, ProductGrid) that will be extended in subsequent epics
- **Data loading**: Static JSON data files (`src/data/products.json`, `src/data/queue-messages.json`) loaded at build time or runtime
- **Routing patterns**: Product detail view using Next.js dynamic routes (`/product/[id]`) or modal patterns
- **State management**: Component-level state for UI interactions (modal open/close, selected product) that will inform Epic 3's personalization state

All components will follow the design system tokens defined in `globals.css` and `STYLEGUIDE.md`, ensuring visual consistency across the microsite. The responsive design patterns established here will be reused throughout Epic 3-7.

## Detailed Design

### Services and Modules

| Module | Location | Responsibilities | Inputs | Outputs | Owner |
|--------|----------|------------------|--------|---------|-------|
| **Hero Component** | `src/app/components/Hero.tsx` | Displays hero section with headline, CTA, background image/animation | Product data, design tokens | Hero JSX with optimized image | Frontend Team |
| **Queue Banner Component** | `src/app/components/QueueBanner.tsx` | Displays marquee/ticker with queue messages | Queue message data (JSON) | Animated banner JSX | Frontend Team |
| **Product Grid Component** | `src/app/components/ProductGrid.tsx` | Renders responsive grid of product cards | Product data array | Grid layout with ProductCard components | Frontend Team |
| **Product Card Component** | `src/app/components/ProductCard.tsx` | Displays individual product card with image, metadata, CTAs | Product object | Product card JSX | Frontend Team |
| **Product Detail Component** | `src/app/components/ProductDetail.tsx` or `src/app/product/[id]/page.tsx` | Shows full product information in modal or route | Product ID, product data | Product detail view JSX | Frontend Team |
| **Product Data Loader** | `src/lib/products.ts` or `src/data/products.json` | Loads and provides product data | Static JSON file or API | Product data array | Frontend Team |
| **Queue Message Loader** | `src/lib/queue-messages.ts` or `src/data/queue-messages.json` | Loads and provides queue message data | Static JSON file | Queue message array | Frontend Team |
| **Image Optimizer** | Next.js Image component | Optimizes product images (WebP, lazy loading, responsive) | Image source, dimensions | Optimized Image component | Next.js Framework |
| **Modal Manager** | `src/app/components/Modal.tsx` (if modal pattern) | Manages product detail modal state | Open/close state, product data | Modal overlay with content | Frontend Team |

### Data Models and Contracts

#### Product Data Schema

```typescript
interface Product {
  id: string;                    // Unique product identifier (e.g., "keychain-001")
  title: string;                  // Product name (e.g., "Keychain")
  description: string;            // Short description for card
  fullDescription?: string;       // Full description for detail view
  image: string;                 // Main product image URL or path
  images?: string[];              // Additional images for detail view (gallery)
  estimatedPrintTime: number;    // Print time in minutes (e.g., 20)
  material: string[];             // Material tags (e.g., ["PLA", "PETG"])
  colors?: ProductColor[];         // Available color options
  price?: number;                // Optional price (not in PRD scope, but may be needed)
  category?: string;              // Optional category (not in PRD scope)
}

interface ProductColor {
  id: string;                     // Color identifier (e.g., "red", "blue")
  name: string;                   // Display name (e.g., "Fire Red")
  hex: string;                    // Hex color code (e.g., "#ef4444")
  image?: string;                 // Optional color-specific image variant
}

// Product data file structure (src/data/products.json)
interface ProductsData {
  products: Product[];
  lastUpdated?: string;           // ISO timestamp
  version?: string;               // Data version for cache invalidation
}
```

#### Queue Message Schema

```typescript
interface QueueMessage {
  id: string;                     // Unique message identifier
  name: string;                   // Customer name (e.g., "Sarah M.")
  item: string;                   // Product name (e.g., "Custom Keychain")
  progress?: string;              // Optional progress indicator (e.g., "Printing...")
  timestamp?: number;             // Optional timestamp (for sorting/filtering)
}

// Queue message data file structure (src/data/queue-messages.json)
interface QueueMessagesData {
  messages: QueueMessage[];
  cycleDuration?: number;         // Animation cycle duration in seconds (default: 30)
  lastUpdated?: string;           // ISO timestamp
}
```

#### Component State Models

```typescript
// Product Grid State
interface ProductGridState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProductId: string | null;  // For modal/route navigation
}

// Product Detail State (if modal pattern)
interface ProductDetailState {
  isOpen: boolean;
  product: Product | null;
  selectedColorId: string | null;    // For Epic 3 (preview)
  selectedImageIndex: number;        // For image gallery
}

// Queue Banner State
interface QueueBannerState {
  messages: QueueMessage[];
  currentIndex: number;
  isAnimating: boolean;
}
```

### APIs and Interfaces

#### Product Data API

```typescript
// Product data loading interface
interface ProductDataAPI {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductsByCategory(category: string): Promise<Product[]>;
}

// Implementation (static JSON or future API)
class ProductDataService implements ProductDataAPI {
  async getAllProducts(): Promise<Product[]> {
    // Load from src/data/products.json or API endpoint
    const data = await import('@/data/products.json');
    return data.products;
  }
  
  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getAllProducts();
    return products.find(p => p.id === id) || null;
  }
}
```

#### Queue Message API

```typescript
// Queue message loading interface
interface QueueMessageAPI {
  getMessages(): Promise<QueueMessage[]>;
  getRandomMessage(): Promise<QueueMessage>;
}

// Implementation (static JSON initially)
class QueueMessageService implements QueueMessageAPI {
  async getMessages(): Promise<QueueMessage[]> {
    // Load from src/data/queue-messages.json
    const data = await import('@/data/queue-messages.json');
    return data.messages;
  }
  
  async getRandomMessage(): Promise<QueueMessage> {
    const messages = await this.getMessages();
    return messages[Math.floor(Math.random() * messages.length)];
  }
}
```

#### Component Props Interfaces

```typescript
// Hero Component Props
interface HeroProps {
  headline: string;               // Main headline text
  subheadline?: string;           // Optional subheadline
  ctaText: string;                // CTA button text (e.g., "Browse Catalog")
  ctaHref?: string;               // CTA link destination (default: "#catalog")
  backgroundImage?: string;       // Optional background image URL
  backgroundAnimation?: boolean;  // Enable background animation
}

// Product Card Props
interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;  // Click handler for navigation
  showColorSwatches?: boolean;            // Show color previews (default: true)
  showPersonalizeCTA?: boolean;          // Show "Personalize" button (default: true)
}

// Product Grid Props
interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyState?: React.ReactNode;   // Custom empty state component
  onProductClick?: (product: Product) => void;
  columns?: {                      // Responsive column configuration
    mobile: number;                // Default: 1
    tablet: number;                // Default: 2-3
    desktop: number;               // Default: 3-4
  };
}

// Queue Banner Props
interface QueueBannerProps {
  messages: QueueMessage[];
  cycleDuration?: number;          // Animation duration in seconds (default: 30)
  pauseOnHover?: boolean;           // Pause animation on hover (default: true)
  ariaLabel?: string;               // Accessibility label
}
```

### Workflows and Sequencing

#### Page Load and Initialization Flow

```
1. User navigates to microsite (src/app/page.tsx)
   ↓
2. Layout loads (src/app/layout.tsx) - applies fonts, theme
   ↓
3. Page component initializes
   ↓
4. Parallel data loading:
   ├─ Load products from src/data/products.json
   ├─ Load queue messages from src/data/queue-messages.json
   └─ Preload hero background image (if applicable)
   ↓
5. Components render in order:
   ├─ Hero component (above fold)
   ├─ Queue Banner component (below hero)
   └─ Product Grid component (below banner)
   ↓
6. Next.js Image component optimizes images (WebP conversion, lazy loading)
   ↓
7. Queue banner animation starts (CSS animation or requestAnimationFrame)
   ↓
8. User can interact with product cards
```

#### Product Discovery Flow

```
User views catalog
   ↓
Product Grid displays 6-9 product cards
   ↓
User clicks/taps product card
   ├─ If modal pattern: Product Detail modal opens
   │   ├─ Modal displays full product information
   │   ├─ User can view image gallery (if multiple images)
   │   ├─ User can see all color options
   │   └─ User clicks "Personalize" or "Add to Cart"
   │       └─ Navigate to personalization (Epic 3) or cart (Epic 4)
   │
   └─ If route pattern: Navigate to /product/[id]
       ├─ Product detail page loads
       ├─ Shows full product information
       └─ User clicks "Personalize" or "Add to Cart"
           └─ Navigate to personalization (Epic 3) or cart (Epic 4)
```

#### Queue Banner Animation Flow

```
Component mounts
   ↓
Load queue messages from JSON
   ↓
Initialize animation state (currentIndex = 0)
   ↓
Start CSS animation or requestAnimationFrame loop
   ↓
Every cycleDuration seconds:
   ├─ Update currentIndex (increment or random)
   ├─ Display message at currentIndex
   ├─ Animate message transition (fade, slide, or marquee)
   └─ Repeat cycle
   ↓
(Optional) User hovers over banner
   ├─ Pause animation (if pauseOnHover enabled)
   └─ Resume on mouse leave
```

#### Responsive Layout Flow

```
Page loads
   ↓
Detect viewport width
   ├─ Mobile (< 768px):
   │   ├─ Hero: Full width, single column
   │   ├─ Queue Banner: Full width, single line
   │   └─ Product Grid: 1 column, stacked cards
   │
   ├─ Tablet (768px - 1024px):
   │   ├─ Hero: Full width, centered content
   │   ├─ Queue Banner: Full width, single line
   │   └─ Product Grid: 2-3 columns, responsive cards
   │
   └─ Desktop (> 1024px):
       ├─ Hero: Full width, centered content (max-width container)
       ├─ Queue Banner: Full width, single line
       └─ Product Grid: 3-4 columns, responsive cards
   ↓
User resizes window
   ↓
Layout adapts using CSS Grid/Flexbox responsive breakpoints
   ↓
Product cards maintain aspect ratio and consistent sizing
```

#### Image Loading and Optimization Flow

```
Product card renders
   ↓
Next.js Image component receives image source
   ↓
Image optimization:
   ├─ Convert to WebP format (if supported)
   ├─ Generate responsive sizes (srcset)
   ├─ Generate blur placeholder (if provided)
   └─ Lazy load if below fold
   ↓
Image loads:
   ├─ If above fold: Load immediately (high priority)
   └─ If below fold: Load on scroll (lazy loading)
   ↓
Image displays with optimized format and size
   ↓
(If lazy loading) User scrolls to image
   ↓
Image loads on demand
   ↓
Fade-in transition (optional)
```

## Non-Functional Requirements

### Performance

**Target Metrics (inherited from Epic 1):**
- **Largest Contentful Paint (LCP)**: < 2.5 seconds on booth hardware with throttled 3G connection
- **First Contentful Paint (FCP)**: < 1.8 seconds
- **Time to Interactive (TTI)**: < 3.5 seconds
- **Hero Section LCP**: Hero image must not delay LCP (preload or optimize)

**Implementation Strategies:**

1. **Hero Section Optimization**
   - Preload hero background image with `<link rel="preload">` or Next.js Image priority
   - Use CSS animations instead of JavaScript where possible (reduces JS bundle size)
   - Ensure hero content is above the fold and doesn't block first contentful paint
   - Test LCP metric to verify hero doesn't delay paint

2. **Image Optimization**
   - Use Next.js Image component for all product images (automatic WebP conversion, lazy loading)
   - Product card images lazy load if below fold (reduces initial load)
   - Responsive image sizes (srcset) for different viewport widths
   - Blur placeholders for progressive image loading

3. **Queue Banner Performance**
   - Use CSS `@keyframes` for marquee animation (GPU-accelerated)
   - Avoid JavaScript animation loops that cause reflows
   - Throttle message updates if using JavaScript animation
   - Test animation performance (60fps target)

4. **Component Code Splitting**
   - Product Detail component can be code-split (dynamic import) if using modal pattern
   - Lazy load product detail route if using Next.js route pattern
   - Reduce initial JS bundle size by deferring non-critical components

5. **Data Loading Optimization**
   - Load product data at build time (static JSON) or use Next.js static generation
   - Cache queue messages in component state (avoid re-fetching)
   - Minimize data file sizes (compress JSON, remove unnecessary fields)

**Performance Testing:**
- Measure LCP with hero section visible
- Test image loading performance (WebP conversion, lazy loading)
- Verify queue banner animation runs at 60fps
- Test on throttled 3G connection (Chrome DevTools)
- Lighthouse audit for performance score

### Security

**Security Requirements:**

1. **Content Security**
   - No user-generated content in Epic 2 (static product data only)
   - Sanitize product data if loaded from external source (future)
   - Validate product data schema to prevent injection attacks

2. **Image Security**
   - Use Next.js Image component (handles image optimization securely)
   - Validate image URLs if loaded from external sources (future)
   - Prevent image hotlinking if required (CORS headers)

3. **Component Security**
   - No XSS vulnerabilities (React handles escaping by default)
   - Validate component props (TypeScript type checking)
   - No sensitive data exposed in component state

4. **Data File Security**
   - Static JSON files are safe (no code execution)
   - Validate JSON schema to prevent malformed data
   - No external API calls in Epic 2 (reduces attack surface)

**Security Testing:**
- XSS vulnerability scanning
- Component prop validation (TypeScript)
- JSON schema validation
- No external dependencies with known vulnerabilities

### Reliability/Availability

**Availability Requirements:**

1. **Offline Support (inherited from Epic 1)**
   - Product data cached by service worker (Epic 1)
   - Queue messages cached locally
   - Components render correctly when offline (after initial load)

2. **Error Handling**
   - Graceful handling of missing product data (empty state)
   - Fallback UI if queue messages fail to load
   - Error boundaries for component failures (React Error Boundaries)

3. **Data Resilience**
   - Product data loads from static JSON (no network dependency after initial load)
   - Queue messages load from static JSON (no network dependency)
   - Fallback to default messages if queue data unavailable

4. **Component Resilience**
   - Product grid handles empty product array (empty state)
   - Queue banner handles empty message array (hides or shows default)
   - Product detail handles missing product (404 or redirect)

**Reliability Testing:**
- Test offline rendering (after initial load)
- Test error states (missing data, network failures)
- Test empty states (no products, no messages)
- Test component error boundaries

### Observability

**Logging Requirements:**

1. **Analytics Events (inherited from Epic 1)**
   - Track hero CTA clicks ("Browse Catalog" button)
   - Track product card clicks (which products viewed)
   - Track product detail views (modal or route opens)
   - Track queue banner visibility (impressions)

2. **Performance Metrics**
   - Measure hero LCP contribution
   - Track image load times (product images)
   - Monitor queue banner animation performance (fps)

3. **User Interaction Tracking**
   - Product discovery flow: Hero → Catalog → Product Detail
   - Most viewed products (for content optimization)
   - Queue banner engagement (hover, pause interactions)

**Observability Implementation:**
- Use Epic 1's analytics module (`src/lib/analytics.ts`) for event tracking
- Track events: `hero_cta_click`, `product_card_click`, `product_detail_view`, `queue_banner_view`
- Performance metrics via Performance API (inherited from Epic 1)
- Simple dashboard or log view for booth staff (Epic 1)

## Dependencies and Integrations

### Runtime Dependencies

**Core Framework (from package.json):**
- **Next.js 16.0.1**: React framework with App Router, Image optimization, static generation
- **React 19.2.0**: UI library with React Compiler support
- **React DOM 19.2.0**: React rendering for web browsers
- **TypeScript ^5**: Type safety and developer experience

**Styling:**
- **Tailwind CSS ^4**: Utility-first CSS framework for responsive design
- **@tailwindcss/postcss ^4**: PostCSS plugin for Tailwind CSS processing

**Development Tools:**
- **@biomejs/biome 2.2.0**: Linting and formatting
- **babel-plugin-react-compiler 1.0.0**: React Compiler plugin
- **@types/node ^20**, **@types/react ^19**, **@types/react-dom ^19**: TypeScript definitions

### Epic Dependencies

**Epic 1 (Foundation & Infrastructure) - REQUIRED:**
- **PWA Foundation**: Service worker registration, manifest.json (for offline support)
- **Performance Optimization**: LCP < 2.5s target, bundle size < 200KB (affects component design)
- **Analytics Module**: Event tracking for user interactions (`src/lib/analytics.ts`)
- **Design System**: Design tokens from `globals.css` and `STYLEGUIDE.md`

**No Dependencies on Epic 3-7:**
- Epic 2 is independent and can be developed in parallel with Epic 3-7
- Epic 3 (Personalization) will extend Epic 2's Product Detail component
- Epic 4 (Cart) will extend Epic 2's Product Card component

### Data Dependencies

**Static Data Files:**
- **Product Data**: `src/data/products.json` (created in Epic 2)
- **Queue Messages**: `src/data/queue-messages.json` (created in Epic 2)

**Design Assets:**
- **Hero Background Image**: From `/design` folder or design assets
- **Product Images**: From `/design` folder or product photography
- **Icons**: Material Symbols Outlined (loaded via Google Fonts CDN)

### Browser APIs

**Image Optimization:**
- **Next.js Image API**: Automatic image optimization, WebP conversion, lazy loading
- **Intersection Observer API**: For lazy loading detection (used by Next.js Image)

**Animation APIs:**
- **CSS Animations**: For queue banner marquee animation
- **requestAnimationFrame**: Optional for JavaScript-based animations

### Integration Points Established in Epic 2

**Component Integration Points:**
- **Product Card → Product Detail**: Click handler pattern for navigation
- **Hero → Product Grid**: CTA "Browse Catalog" scrolls to catalog section
- **Product Detail → Epic 3**: "Personalize" button will navigate to personalization (Epic 3)
- **Product Detail → Epic 4**: "Add to Cart" button will add to cart (Epic 4)

**Data Integration Points:**
- **Product Data Schema**: Establishes structure for Epic 3 (personalization) and Epic 4 (cart)
- **Queue Message Schema**: Establishes structure for Epic 5 (dynamic simulation)

### No External Service Dependencies

Epic 2 uses only static data files and design assets. No external APIs or services required, ensuring:
- Offline-first functionality (works without network after initial load)
- Fast initial load (no external API calls)
- Event resilience (no single point of failure)

## Acceptance Criteria (Authoritative)

### Story 2.1: Build Responsive Hero Section

1. Hero section displays above the fold on mobile and desktop
2. Background image/animation preloaded and doesn't block first contentful paint
3. Headline communicates MakeLocal's value proposition clearly
4. Primary CTA "Browse Catalog" is prominent and accessible
5. Responsive design: Works on mobile (320px+) and tablet/desktop (768px+)
6. Meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)

### Story 2.2: Create Live Queue Banner Component

7. Marquee/ticker banner displays curated queue messaging
8. Messages cycle through showing realistic names, items, and progress
9. Banner is visually distinct but doesn't distract from main content
10. Static copy works initially (stretch: dynamic simulation in Epic 5)
11. Accessible: Screen readers can access queue messages
12. Performance: Smooth animation without jank

### Story 2.3: Build Product Catalog Grid

13. Grid displays 6-9 product cards with consistent aspect ratios
14. Cards show: title, description, ETA, material tags
15. Grid is responsive: 1 column mobile, 2-3 columns tablet, 3-4 columns desktop
16. Cards are clickable and navigate to product detail
17. Loading state shown while products load
18. Empty state if no products available

### Story 2.4: Design Product Card Component

19. Card displays product image with consistent aspect ratio
20. Metadata visible: title, short description, estimated print time, material tags
21. Color swatches preview available colors (if applicable)
22. "Personalize" CTA button is clear and accessible
23. Card has hover/focus states for interactivity feedback
24. Card is keyboard navigable (Tab, Enter to select)

### Story 2.5: Create Product Detail View

25. Detail view opens as modal or dedicated route
26. Shows: full description, all images, all color options, detailed ETA, material info
27. "Add to Cart" or "Personalize" CTA is prominent
28. Can close/navigate back to catalog
29. Responsive: Works well on mobile and desktop
30. Images lazy load if multiple variants shown

## Traceability Mapping

| AC # | Acceptance Criteria | Spec Section(s) | Component(s)/API(s) | Test Idea |
|------|---------------------|-----------------|---------------------|-----------|
| 1 | Hero displays above fold | Services and Modules, Workflows | Hero Component (`src/app/components/Hero.tsx`) | Test hero renders above fold, verify viewport positioning |
| 2 | Background doesn't block FCP | Performance, Workflows | Hero Component, Next.js Image | Test FCP timing, verify background preload/optimization |
| 3 | Headline communicates value | Objectives and Scope | Hero Component | Verify headline text matches PRD value proposition |
| 4 | CTA "Browse Catalog" prominent | Services and Modules | Hero Component | Test CTA visibility, accessibility, click handler |
| 5 | Responsive design (320px+, 768px+) | Workflows and Sequencing | Hero Component, CSS | Test responsive breakpoints, verify layout at 320px, 768px, 1024px |
| 6 | WCAG 2.1 AA contrast (4.5:1) | Security, Objectives and Scope | Hero Component, Design System | Test color contrast ratios, verify accessibility compliance |
| 7 | Marquee banner displays messages | Services and Modules, Workflows | Queue Banner Component (`src/app/components/QueueBanner.tsx`) | Test banner renders messages, verify message display |
| 8 | Messages cycle through | Workflows and Sequencing | Queue Banner Component | Test message cycling, verify animation loop |
| 9 | Banner visually distinct | Objectives and Scope | Queue Banner Component, Design System | Test visual design, verify doesn't distract from content |
| 10 | Static copy works initially | Objectives and Scope | Queue Banner Component, Queue Message Data | Test static messages load and display correctly |
| 11 | Screen readers access messages | Security, Objectives and Scope | Queue Banner Component | Test ARIA labels, screen reader compatibility |
| 12 | Smooth animation (no jank) | Performance, Workflows | Queue Banner Component | Test animation performance (60fps), verify no jank |
| 13 | Grid displays 6-9 cards | Services and Modules, Objectives and Scope | Product Grid Component (`src/app/components/ProductGrid.tsx`) | Test grid renders correct number of cards, verify product count |
| 14 | Cards show metadata | Data Models and Contracts | Product Card Component (`src/app/components/ProductCard.tsx`) | Test card displays title, description, ETA, material tags |
| 15 | Responsive grid (1/2-3/3-4 columns) | Workflows and Sequencing | Product Grid Component, CSS | Test responsive columns at mobile/tablet/desktop breakpoints |
| 16 | Cards clickable, navigate to detail | Workflows and Sequencing | Product Card Component, Product Detail Component | Test card click handler, verify navigation to detail view |
| 17 | Loading state shown | Services and Modules | Product Grid Component | Test loading state displays while products load |
| 18 | Empty state if no products | Services and Modules | Product Grid Component | Test empty state displays when products array is empty |
| 19 | Card displays image with aspect ratio | Data Models and Contracts, APIs and Interfaces | Product Card Component, Next.js Image | Test image displays with consistent aspect ratio |
| 20 | Metadata visible | Data Models and Contracts | Product Card Component | Test card displays title, description, ETA, material tags |
| 21 | Color swatches preview colors | Data Models and Contracts | Product Card Component | Test color swatches display available colors |
| 22 | "Personalize" CTA accessible | Services and Modules, Objectives and Scope | Product Card Component | Test CTA button visibility, accessibility, click handler |
| 23 | Hover/focus states | Objectives and Scope | Product Card Component, CSS | Test hover and focus states, verify visual feedback |
| 24 | Keyboard navigable (Tab, Enter) | Security, Objectives and Scope | Product Card Component | Test keyboard navigation, verify Tab and Enter key support |
| 25 | Detail view opens (modal or route) | Services and Modules, Workflows | Product Detail Component (`src/app/components/ProductDetail.tsx` or route) | Test detail view opens on card click, verify modal/route pattern |
| 26 | Shows full product information | Data Models and Contracts | Product Detail Component | Test detail view displays full description, images, colors, ETA, material |
| 27 | "Add to Cart" or "Personalize" CTA prominent | Services and Modules | Product Detail Component | Test CTA visibility, accessibility, click handler |
| 28 | Can close/navigate back | Workflows and Sequencing | Product Detail Component | Test close button/navigation, verify returns to catalog |
| 29 | Responsive (mobile and desktop) | Workflows and Sequencing | Product Detail Component, CSS | Test responsive layout at mobile/tablet/desktop breakpoints |
| 30 | Images lazy load if multiple variants | Performance, Workflows | Product Detail Component, Next.js Image | Test image lazy loading, verify multiple images load on demand |

## Risks, Assumptions, Open Questions

### Risks

**Risk 1: Hero Image LCP Impact**
- **Description**: Hero background image may delay Largest Contentful Paint if not optimized
- **Impact**: High - Violates PRD performance requirement (LCP < 2.5s)
- **Mitigation**: Preload hero image, use Next.js Image priority, optimize image size/format, test LCP metric
- **Owner**: Frontend Team

**Risk 2: Queue Banner Animation Performance**
- **Description**: Marquee animation may cause jank or performance issues on low-end devices
- **Impact**: Medium - Affects user experience, may distract from content
- **Mitigation**: Use CSS animations (GPU-accelerated), test on target devices, provide pause-on-hover option
- **Owner**: Frontend Team

**Risk 3: Product Data File Size**
- **Description**: Product JSON file may become large with 6-9 products and images, affecting load time
- **Impact**: Medium - May delay initial page load
- **Mitigation**: Optimize image references (use paths, not base64), compress JSON, lazy load non-critical data
- **Owner**: Frontend Team

**Risk 4: Modal vs Route Pattern Decision**
- **Description**: Unclear whether product detail should use modal or Next.js route pattern
- **Impact**: Low - Both patterns work, but affects implementation approach
- **Mitigation**: Choose pattern early (recommend route for better SEO and URL sharing), document decision
- **Owner**: Frontend Team

**Risk 5: Design Asset Availability**
- **Description**: Product images and hero background may not be available at implementation time
- **Impact**: Medium - Blocks visual implementation, may delay Epic 2 completion
- **Mitigation**: Use placeholder images initially, coordinate with design team, create fallback images
- **Owner**: Frontend Team, Design Team

### Assumptions

**Assumption 1: Product Data Structure**
- Product data will be available as static JSON file with 6-9 products
- **Validation**: Verify product data file exists and contains required fields

**Assumption 2: Design System Availability**
- Design tokens from `globals.css` and `STYLEGUIDE.md` are sufficient for Epic 2 components
- **Validation**: Verify design tokens cover all component needs (colors, spacing, typography)

**Assumption 3: Browser Support**
- Modern browsers support CSS animations, Intersection Observer (for lazy loading)
- **Validation**: Test on target browsers (Chrome, Firefox, Safari, Edge)

**Assumption 4: Image Optimization**
- Next.js Image component handles all image optimization automatically
- **Validation**: Test image optimization (WebP conversion, lazy loading, responsive sizes)

**Assumption 5: Epic 1 Completion**
- Epic 1 (Foundation) is complete and provides PWA, performance optimization, analytics
- **Validation**: Verify Epic 1 components are available before Epic 2 implementation

### Open Questions

**Question 1: Product Detail Pattern**
- **Question**: Should product detail use modal pattern or Next.js route pattern (`/product/[id]`)?
- **Status**: Open - Recommend route pattern for better SEO and URL sharing
- **Owner**: Frontend Team
- **Resolution Target**: Before Story 2.5 implementation

**Question 2: Queue Message Content**
- **Question**: What specific queue messages should be displayed? Who provides the content?
- **Status**: Open - Need content from product/marketing team
- **Owner**: Product/Marketing Team
- **Resolution Target**: Before Story 2.2 implementation

**Question 3: Product Images**
- **Question**: Are product images available? What format/size? Where are they hosted?
- **Status**: Open - Coordinate with design team
- **Owner**: Design Team, Frontend Team
- **Resolution Target**: Before Story 2.3 implementation

**Question 4: Hero Background Animation**
- **Question**: What type of background animation should the hero use? CSS-only or JavaScript?
- **Status**: Open - Recommend CSS-only for performance
- **Owner**: Frontend Team
- **Resolution Target**: Before Story 2.1 implementation

**Question 5: Color Swatch Display**
- **Question**: Should color swatches show on product cards or only in detail view?
- **Status**: Open - PRD suggests "quick actions on cards (color swatches)"
- **Owner**: Frontend Team, Design Team
- **Resolution Target**: Before Story 2.4 implementation

## Test Strategy Summary

### Test Levels

**Unit Tests:**
- **Scope**: Individual components and utilities
- **Components**: Hero, QueueBanner, ProductCard, ProductGrid, ProductDetail, data loaders
- **Framework**: Jest or Vitest (TBD)
- **Coverage Target**: 70%+ for component logic, 90%+ for utilities

**Integration Tests:**
- **Scope**: Component interactions, data loading, navigation
- **Components**: Product Grid → Product Card → Product Detail flow
- **Framework**: React Testing Library
- **Coverage Target**: Critical user flows (hero CTA → catalog → product detail)

**End-to-End Tests:**
- **Scope**: User flows, responsive design, accessibility
- **Scenarios**: 
  - Hero CTA click → scroll to catalog
  - Product card click → product detail opens
  - Queue banner animation cycles
  - Responsive layout at different viewport sizes
- **Framework**: Playwright or Cypress
- **Coverage Target**: Critical user journeys

**Performance Tests:**
- **Scope**: LCP, image loading, animation performance
- **Tools**: Lighthouse CI, WebPageTest, Chrome DevTools
- **Targets**: 
  - Hero LCP < 2.5s on throttled 3G
  - Queue banner animation 60fps
  - Product images lazy load correctly
- **Frequency**: Every deployment, fail build if targets not met

**Accessibility Tests:**
- **Scope**: WCAG 2.1 AA compliance, keyboard navigation, screen readers
- **Tools**: axe-core, Lighthouse accessibility audit, manual keyboard testing
- **Target**: WCAG 2.1 AA compliance
- **Frequency**: Before Epic 2 completion

### Test Scenarios

**Hero Component Tests:**
1. Hero displays above fold on mobile and desktop
2. Background image preloads without blocking FCP
3. Headline text matches PRD value proposition
4. CTA "Browse Catalog" is clickable and accessible
5. Responsive layout works at 320px, 768px, 1024px
6. Color contrast meets WCAG 2.1 AA (4.5:1)

**Queue Banner Tests:**
1. Banner displays queue messages
2. Messages cycle through correctly
3. Animation runs smoothly (60fps, no jank)
4. Banner is accessible (screen reader, ARIA labels)
5. Animation pauses on hover (if enabled)
6. Static messages load from JSON correctly

**Product Grid Tests:**
1. Grid displays 6-9 product cards
2. Cards show correct metadata (title, description, ETA, material)
3. Responsive columns: 1 mobile, 2-3 tablet, 3-4 desktop
4. Cards are clickable and navigate to detail
5. Loading state displays while products load
6. Empty state displays when no products available

**Product Card Tests:**
1. Card displays product image with consistent aspect ratio
2. Metadata visible (title, description, ETA, material tags)
3. Color swatches display available colors
4. "Personalize" CTA button is accessible
5. Hover and focus states work correctly
6. Keyboard navigation (Tab, Enter) works

**Product Detail Tests:**
1. Detail view opens as modal or route
2. Shows full product information (description, images, colors, ETA, material)
3. "Add to Cart" or "Personalize" CTA is prominent
4. Can close/navigate back to catalog
5. Responsive layout works on mobile and desktop
6. Images lazy load if multiple variants shown

### Test Data and Fixtures

**Product Test Data:**
- Mock product JSON with 6-9 products
- Products with various configurations (with/without colors, multiple images)
- Edge cases: missing images, missing descriptions, empty arrays

**Queue Message Test Data:**
- Mock queue message JSON with 5-10 messages
- Messages with various formats (with/without progress, timestamps)
- Edge cases: empty array, single message, very long messages

**Performance Test Data:**
- Throttled 3G network profiles
- Booth hardware simulation (if available)
- Image optimization baselines

### Test Environment Requirements

**Development:**
- Local development server (Next.js dev)
- Chrome DevTools for performance testing
- Network throttling for performance testing
- Responsive design testing (device emulation)

**Staging:**
- Production-like environment
- Real device testing (iOS and Android)
- Performance monitoring tools
- Accessibility testing tools

**CI/CD:**
- Automated component tests
- Lighthouse CI integration
- TypeScript type checking
- Bundle size validation

### Test Execution Strategy

**Pre-Commit:**
- TypeScript type checking
- Linting (Biome)
- Unit tests for components

**Pull Request:**
- Full unit test suite
- Integration tests for component flows
- Bundle size validation
- Lighthouse performance audit

**Pre-Deployment:**
- Full test suite (unit, integration, E2E)
- Performance tests on staging
- Accessibility audit
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Responsive design testing (mobile, tablet, desktop)

**Post-Deployment:**
- Smoke tests on production
- Performance monitoring (RUM)
- Error tracking and monitoring

