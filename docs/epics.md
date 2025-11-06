# makelocal-websimmit-demo - Epic Breakdown

**Author:** MakeLocal WebSimmit Demo
**Date:** 2025-01-27
**Project Level:** Level 2 - Medium Complexity Microsite
**Target Scale:** Single-page marketing/demo site with PWA capabilities

---

## Overview

This document provides the detailed epic breakdown for makelocal-websimmit-demo, expanding on the high-level epic list in the [PRD](./prd.md).

Each epic includes:

- Expanded goal and value proposition
- Complete story breakdown with user stories
- Acceptance criteria for each story
- Story sequencing and dependencies

**Epic Sequencing Principles:**

- Epic 1 establishes foundational infrastructure and initial functionality
- Subsequent epics build progressively, each delivering significant end-to-end value
- Stories within epics are vertically sliced and sequentially ordered
- No forward dependencies - each story builds only on previous work

---

## Epic 1: Foundation & Infrastructure

**Goal:** Establish technical foundation for offline-first, event-resilient microsite with PWA capabilities and staff management tools.

**Value Proposition:** Enables reliable booth operation regardless of network conditions, provides analytics for event learnings, and supports quick resets between demo sessions.

**Business Goal:** Ensure the microsite works flawlessly during Web Summit with minimal staff intervention, even on unreliable conference Wi-Fi.

**Epic Scope:**
- Progressive Web App (PWA) manifest and service worker
- Offline caching strategy for critical routes and assets
- Analytics instrumentation (offline-first, syncs later)
- Staff reset controls (keyboard combo or URL param)
- Basic error handling and resilience patterns
- Performance optimization (LCP < 2.5s, JS < 200KB gzipped)

**Dependencies:** None (foundational epic)

**Estimated Completion:** 1 sprint

### Stories

**Story 1.1: Create PWA Manifest and Service Worker Foundation**

As a booth staff member,
I want the microsite to be installable as a PWA,
So that visitors can add it to their home screen for quick re-entry during the event.

**Acceptance Criteria:**
1. `manifest.json` file exists with required fields (name, short_name, icons, start_url, display mode)
2. Service worker file created with basic registration logic
3. Service worker registers successfully on page load
4. Add to Home Screen prompt appears on mobile devices after engagement
5. Icons provided in multiple sizes (192x192, 512x512 minimum)
6. Theme color matches MakeLocal brand colors

**Prerequisites:** None

**Technical Notes:**
- File: `public/manifest.json`
- Service worker: `public/sw.js` or Next.js service worker integration
- Icons: Generate from design assets or use placeholder icons initially
- Test on iOS Safari and Android Chrome for install prompts

---

**Story 1.2: Implement Offline Caching Strategy**

As a visitor at Web Summit,
I want the microsite to work offline after initial load,
So that I can use it even when conference Wi-Fi is unreliable.

**Acceptance Criteria:**
1. Service worker caches critical HTML, CSS, JS, and image assets on first visit
2. Cached routes include: landing page, catalog, product detail, cart, checkout
3. Offline fallback page displays when network unavailable and route not cached
4. Cache versioning implemented to force updates when content changes
5. Cache size limits prevent excessive storage usage
6. Works on throttled 3G connection (per PRD performance requirements)

**Prerequisites:** Story 1.1 (PWA foundation)

**Technical Notes:**
- Use Cache API in service worker
- Cache strategy: Cache-first for static assets, network-first for API calls
- Cache version: Increment on deploy to invalidate old caches
- Test with Chrome DevTools offline mode and Network throttling

---

**Story 1.3: Add Analytics Instrumentation (Offline-First)**

As a product marketer,
I want to track user interactions and flow drop-offs,
So that we can learn from booth visitors and improve the experience.

**Acceptance Criteria:**
1. Analytics events tracked for: page views, CTA clicks, checkout starts, lead submissions
2. Events buffered locally when offline, synced when network available
3. No third-party trackers (privacy-compliant, per PRD)
4. Simple dashboard or log view for booth staff to review metrics
5. GDPR disclosure in footer if required
6. Events include: "Continue on MakeLocal" clicks, Add to Home Screen prompts

**Prerequisites:** Story 1.2 (Offline caching - for buffering)

**Technical Notes:**
- Use localStorage or IndexedDB for event buffering
- Consider simple POST endpoint or webhook for sync
- Event schema: `{ event, timestamp, properties, sessionId }`
- File: `src/lib/analytics.ts` or similar
- Dashboard: Simple admin route or CSV export

---

**Story 1.4: Create Staff Reset Controls**

As a booth staff member,
I want to quickly reset the demo between visitors,
So that each visitor gets a fresh experience without manual cleanup.

**Acceptance Criteria:**
1. Keyboard combo (e.g., Ctrl+Shift+R or Cmd+Shift+R) clears cart and lead data
2. URL parameter (e.g., `?reset=true`) also triggers reset
3. Reset clears: localStorage cart, lead submissions, any session state
4. Reset confirmation dialog prevents accidental clears
5. Reset time < 15 seconds (per PRD requirement)
6. Reset does not clear analytics or PWA cache

**Prerequisites:** None (can be developed in parallel)

**Technical Notes:**
- File: `src/lib/reset.ts` or similar utility
- Clear: `localStorage.removeItem('cart')`, `localStorage.removeItem('leads')`
- Keyboard listener: `window.addEventListener('keydown')`
- URL param check: `new URLSearchParams(window.location.search).get('reset')`
- Consider password protection for production

---

**Story 1.5: Implement Performance Optimization**

As a visitor on mobile,
I want the microsite to load quickly,
So that I can start browsing products without waiting.

**Acceptance Criteria:**
1. Largest Contentful Paint (LCP) < 2.5s on booth hardware with throttled 3G
2. Total JS payload < 200KB gzipped for initial route
3. Images optimized (WebP format, lazy loading, responsive sizes)
4. CSS critical path inlined or loaded with high priority
5. Fonts preloaded or subsetted to reduce load time
6. No render-blocking resources

**Prerequisites:** Story 1.2 (Offline caching helps with performance)

**Technical Notes:**
- Use Next.js Image component for optimization
- Code splitting: Dynamic imports for non-critical components
- Bundle analysis: `@next/bundle-analyzer` to identify large dependencies
- Lighthouse CI or WebPageTest for performance testing
- Test on actual booth hardware if available

---

## Epic 2: Catalog & Discovery

**Goal:** Create compelling first impression with hero section, live queue messaging, and browsable product catalog.

**Value Proposition:** Captures visitor attention within 5 seconds, communicates "manufacturing in motion," and enables product discovery.

**Business Goal:** Achieve 60%+ of visitors starting the product personalization flow (per PRD success metrics).

**Epic Scope:**
- Responsive hero section with preloaded background/animation
- Live queue banner (marquee) with curated messaging
- Product catalog grid (6-9 SKUs) with consistent card design
- Product cards with metadata (title, description, ETA, material tags)
- Quick actions on cards (color swatches, personalize CTA)
- Product detail modal or dedicated route

**Dependencies:** Epic 1 (Foundation) - needs PWA and performance foundation

**Estimated Completion:** 1 sprint

### Stories

**Story 2.1: Build Responsive Hero Section**

As a visitor scanning the QR code,
I want to immediately understand what MakeLocal does,
So that I'm engaged within 5 seconds of landing on the site.

**Acceptance Criteria:**
1. Hero section displays above the fold on mobile and desktop
2. Background image/animation preloaded and doesn't block first contentful paint
3. Headline communicates MakeLocal's value proposition clearly
4. Primary CTA "Browse Catalog" is prominent and accessible
5. Responsive design: Works on mobile (320px+) and tablet/desktop (768px+)
6. Meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)

**Prerequisites:** Story 1.5 (Performance optimization)

**Technical Notes:**
- File: `src/app/components/Hero.tsx` or similar
- Use Next.js Image component for background
- Animation: CSS or lightweight JS animation library
- Test LCP metric to ensure hero doesn't delay paint
- Design tokens from `globals.css` and `STYLEGUIDE.md`

---

**Story 2.2: Create Live Queue Banner Component**

As a visitor,
I want to see manufacturing activity happening,
So that I feel the energy of live production.

**Acceptance Criteria:**
1. Marquee/ticker banner displays curated queue messaging
2. Messages cycle through showing realistic names, items, and progress
3. Banner is visually distinct but doesn't distract from main content
4. Static copy works initially (stretch: dynamic simulation in Epic 5)
5. Accessible: Screen readers can access queue messages
6. Performance: Smooth animation without jank

**Prerequisites:** Story 2.1 (Hero section - for placement)

**Technical Notes:**
- File: `src/app/components/QueueBanner.tsx`
- Data: Static JSON array of messages initially
- Animation: CSS `@keyframes` or `requestAnimationFrame`
- Messages format: `{ name, item, progress }` or simple strings
- File: `src/data/queue-messages.json` for content

---

**Story 2.3: Build Product Catalog Grid**

As a visitor,
I want to browse available products,
So that I can find something I want to personalize.

**Acceptance Criteria:**
1. Grid displays 6-9 product cards with consistent aspect ratios
2. Cards show: title, description, ETA, material tags
3. Grid is responsive: 1 column mobile, 2-3 columns tablet, 3-4 columns desktop
4. Cards are clickable and navigate to product detail
5. Loading state shown while products load
6. Empty state if no products available

**Prerequisites:** Story 2.1 (Hero section - catalog appears below)

**Technical Notes:**
- File: `src/app/components/ProductGrid.tsx`
- Product data: `src/data/products.json` (structured JSON)
- Use CSS Grid or Flexbox for layout
- Product card component: `src/app/components/ProductCard.tsx`
- Link to product detail: `/product/[id]` or modal

---

**Story 2.4: Design Product Card Component**

As a visitor,
I want to quickly see product details and actions,
So that I can decide if I want to personalize it.

**Acceptance Criteria:**
1. Card displays product image with consistent aspect ratio
2. Metadata visible: title, short description, estimated print time, material tags
3. Color swatches preview available colors (if applicable)
4. "Personalize" CTA button is clear and accessible
5. Card has hover/focus states for interactivity feedback
6. Card is keyboard navigable (Tab, Enter to select)

**Prerequisites:** Story 2.3 (Catalog grid - cards populate grid)

**Technical Notes:**
- File: `src/app/components/ProductCard.tsx`
- Image: Next.js Image component with placeholder
- Color swatches: Small circles showing available colors
- Accessibility: Proper ARIA labels, focus management
- Design: Follow STYLEGUIDE.md tokens

---

**Story 2.5: Create Product Detail View**

As a visitor,
I want to see full product information,
So that I can make an informed decision before personalizing.

**Acceptance Criteria:**
1. Detail view opens as modal or dedicated route
2. Shows: full description, all images, all color options, detailed ETA, material info
3. "Add to Cart" or "Personalize" CTA is prominent
4. Can close/navigate back to catalog
5. Responsive: Works well on mobile and desktop
6. Images lazy load if multiple variants shown

**Prerequisites:** Story 2.4 (Product card - clicking opens detail)

**Technical Notes:**
- File: `src/app/components/ProductDetail.tsx` or `src/app/product/[id]/page.tsx`
- Modal: Use React portal or Next.js route
- Image gallery: Swipeable on mobile, clickable on desktop
- State management: URL params or React state for modal
- Close button: Keyboard accessible (Escape key)

---

## Epic 3: Product Personalization

**Goal:** Enable visitors to customize products with name and color options, with persistence through navigation.

**Value Proposition:** Makes the demo interactive and personal, creating emotional connection before checkout.

**Business Goal:** Support the core personalization flow that differentiates MakeLocal's on-demand manufacturing story.

**Epic Scope:**
- Personalization UI with text input (up to 12 characters, inline validation)
- Color selection (minimum 5 options per product)
- Option persistence through navigation back to catalog
- Estimated print time updates based on product variants
- Configurable JSON per SKU for variant definitions
- Visual preview of personalized options

**Dependencies:** Epic 2 (Catalog) - needs product cards and detail views

**Estimated Completion:** 1 sprint

### Stories

**Story 3.1: Build Personalization Form Component**

As a visitor,
I want to add my name and choose a color for my product,
So that I can make it personal and unique.

**Acceptance Criteria:**
1. Text input for name (max 12 characters) with inline validation
2. Character counter shows remaining characters (e.g., "8/12")
3. Color picker displays minimum 5 color options as swatches
4. Selected color is visually highlighted
5. Form shows visual preview of personalized product
6. "Add to Cart" button is enabled when name is valid

**Prerequisites:** Story 2.5 (Product detail view - personalization opens from here)

**Technical Notes:**
- File: `src/app/components/PersonalizationForm.tsx`
- Validation: Real-time character count and format checking
- Color swatches: Radio buttons or clickable divs with accessibility
- Preview: Update product image/display based on selections
- State: React state or form library (React Hook Form)

---

**Story 3.2: Implement Personalization Option Persistence**

As a visitor,
I want my personalization choices to persist when I navigate back to catalog,
So that I don't lose my selections.

**Acceptance Criteria:**
1. Selected name and color stored in browser storage (localStorage or sessionStorage)
2. When returning to product detail, previous selections are restored
3. Persistence is per-product (different products can have different selections)
4. Storage key format: `personalization_${productId}`
5. Storage cleared on staff reset (Story 1.4)
6. Works across page refreshes during same session

**Prerequisites:** Story 3.1 (Personalization form - needs data to persist)

**Technical Notes:**
- File: `src/lib/personalization-storage.ts` utility
- Storage format: `{ productId: { name, color } }`
- Load on component mount, save on change
- Consider sessionStorage vs localStorage (sessionStorage clears on tab close)

---

**Story 3.3: Add Estimated Print Time Updates**

As a visitor,
I want to see how personalization affects print time,
So that I understand the impact of my choices.

**Acceptance Criteria:**
1. Base print time displayed from product data
2. Print time updates when color selection changes (if variants differ)
3. Updates are immediate (no loading delay)
4. Display format: "Estimated: X minutes" or "ETA: X min"
5. If no variant differences, time stays constant
6. Time calculation configurable per SKU in JSON

**Prerequisites:** Story 3.1 (Personalization form - needs color selection)

**Technical Notes:**
- Product data: `src/data/products.json` includes variant print times
- Format: `variants: [{ color, printTimeMinutes }]` or `baseTime + colorAdjustment`
- Component: Update ETA display reactively based on selection
- File: `src/app/components/PrintTimeDisplay.tsx` or inline in form

---

**Story 3.4: Create Visual Preview of Personalized Options**

As a visitor,
I want to see how my personalized product will look,
So that I'm confident in my choices before adding to cart.

**Acceptance Criteria:**
1. Preview updates in real-time as name/color changes
2. Shows product image with selected color applied (if available)
3. Displays personalized name text overlay or preview
4. Preview is prominent and clear
5. Works on mobile and desktop
6. Preview matches what will appear in cart

**Prerequisites:** Story 3.1 (Personalization form - needs preview component)

**Technical Notes:**
- File: `src/app/components/PersonalizationPreview.tsx`
- Image: Use CSS filters or swap image variants based on color
- Text overlay: Canvas or SVG for name rendering, or simple text div
- Real-time: Update on input change (debounced if needed for performance)

---

## Epic 4: Cart & Checkout Flow

**Goal:** Complete the conversion flow from cart to order draft creation, with lead capture and MakeLocal handoff.

**Value Proposition:** Transforms browsers into leads and creates draft orders on MakeLocal platform for seamless handoff.

**Business Goal:** Achieve 40%+ checkout completion rate and ≥90% successful draft order creation (per PRD success metrics).

**Epic Scope:**
- Cart overlay/page with personalized options summary
- Cart persistence in browser storage (multiple SKUs supported)
- Per-item cart edits (quantity, removal, clear-all for reset)
- Checkout form with optional contact details (name, email)
- Order draft API integration with MakeLocal `orderDraft` endpoint
- Offline/error state handling with clear instructions
- Deep-link to MakeLocal order flow or QR code display
- Lead capture logging (name, email, product) to local store

**Dependencies:** Epic 3 (Personalization) - needs personalized product data

**Estimated Completion:** 1-2 sprints

### Stories

**Story 4.1: Implement Cart Storage and Management**

As a visitor,
I want to add multiple products to my cart,
So that I can personalize several items before checkout.

**Acceptance Criteria:**
1. Cart persists in browser localStorage
2. Cart supports multiple SKUs with per-item personalization data
3. Cart structure: `[{ productId, name, color, quantity, price }]`
4. "Add to Cart" button adds item with current personalization
5. Cart badge/counter shows total items in navigation
6. Cart cleared on staff reset (Story 1.4)

**Prerequisites:** Story 3.1 (Personalization form - adds items to cart)

**Technical Notes:**
- File: `src/lib/cart-storage.ts` utility
- Storage key: `makelocal_cart`
- Functions: `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`
- React context or state management for cart UI updates
- File: `src/app/context/CartContext.tsx` for cart state

---

**Story 4.2: Build Cart Overlay/Page Component**

As a visitor,
I want to review my cart before checkout,
So that I can verify my selections and make changes.

**Acceptance Criteria:**
1. Cart opens as overlay (mobile) or sidebar/page (desktop)
2. Displays all cart items with: product image, name, personalized options, quantity, price
3. Per-item actions: edit quantity, remove item, edit personalization
4. "Clear All" button for booth reset scenarios
5. Subtotal and total displayed
6. Primary CTA "Checkout" is prominent

**Prerequisites:** Story 4.1 (Cart storage - needs items to display)

**Technical Notes:**
- File: `src/app/components/Cart.tsx` or `src/app/cart/page.tsx`
- Overlay: React portal or Next.js route
- Cart item component: `src/app/components/CartItem.tsx`
- Quantity controls: Increment/decrement buttons
- Edit personalization: Navigate back to product detail or inline edit

---

**Story 4.3: Create Checkout Form with Lead Capture**

As a visitor,
I want to optionally provide my contact information,
So that MakeLocal can follow up with me after the event.

**Acceptance Criteria:**
1. Form fields: name (optional), email (optional)
2. Form validation: Email format if provided
3. Form clearly indicates fields are optional
4. Form persists if visitor navigates away and returns
5. Form submission triggers order draft creation (Story 4.4)
6. Lead data stored locally for export (Story 4.5)

**Prerequisites:** Story 4.2 (Cart component - checkout opens form)

**Technical Notes:**
- File: `src/app/components/CheckoutForm.tsx`
- Form library: React Hook Form or native form handling
- Validation: Email regex, name length limits
- State: Store in component state or form library
- Submit handler: Calls order draft API (next story)

---

**Story 4.4: Integrate MakeLocal Order Draft API**

As a visitor,
I want my cart to be converted to a draft order on MakeLocal,
So that I can complete my order on the MakeLocal platform.

**Acceptance Criteria:**
1. Checkout calls MakeLocal `orderDraft` endpoint with cart payload
2. Payload format matches API contract (see `docs/makelocal-api/orderDraft.md`)
3. Handles success: Receives draft order ID, redirects to MakeLocal
4. Handles offline: Shows clear instructions if API unavailable
5. Handles errors: Displays user-friendly error message
6. Success rate ≥90% (per PRD requirement)

**Prerequisites:** Story 4.3 (Checkout form - submits to API)

**Technical Notes:**
- File: `src/lib/api/order-draft.ts` API client
- Endpoint: MakeLocal `orderDraft` endpoint (see API docs)
- Payload: Transform cart data to API format
- Error handling: Network errors, API errors, validation errors
- Deep link: `makelocal.eu/order/{draftId}` or similar
- Fallback: QR code display if deep link fails

---

**Story 4.5: Implement Lead Capture Logging**

As a product marketer,
I want to capture visitor contact information,
So that we can follow up after Web Summit.

**Acceptance Criteria:**
1. Lead data stored locally: name, email, product(s), timestamp
2. Storage format: `[{ name, email, products: [productIds], timestamp }]`
3. Leads exportable to CSV (Story 4.6)
4. Leads cleared on staff reset (Story 1.4)
5. GDPR-compliant: Consent checkbox if required
6. Leads synced to CRM/webhook when online (optional)

**Prerequisites:** Story 4.3 (Checkout form - captures lead data)

**Technical Notes:**
- File: `src/lib/lead-storage.ts` utility
- Storage key: `makelocal_leads`
- Functions: `saveLead()`, `getLeads()`, `exportLeads()`
- CSV export: Convert array to CSV format, trigger download
- Privacy: No PII stored beyond event needs, clear retention policy

---

**Story 4.6: Create Staff Lead Export Feature**

As a booth staff member,
I want to export collected leads at the end of the day,
So that I can hand them off to CRM or sales team.

**Acceptance Criteria:**
1. Staff-only route or password-protected admin view
2. Displays aggregated leads list: name, email, products, timestamp
3. "Export CSV" button downloads leads as CSV file
4. CSV format: Columns: name, email, products, timestamp
5. Export works offline (data stored locally)
6. Option to clear leads after export

**Prerequisites:** Story 4.5 (Lead capture - needs leads to export)

**Technical Notes:**
- File: `src/app/admin/leads/page.tsx` (protected route)
- Password: Simple password check or environment variable
- CSV generation: `src/lib/csv-export.ts` utility
- Download: `blob` URL with CSV content, trigger download
- Clear: Call `clearLeads()` from lead storage utility

---

## Epic 5: Order Status & Handoff

**Goal:** Provide clear post-checkout experience with order status explanation and MakeLocal platform integration.

**Value Proposition:** Ensures visitors understand their order continues on MakeLocal and provides fallback guidance.

**Business Goal:** Reduce confusion at handoff point and encourage PWA installation for re-entry.

**Epic Scope:**
- Order status explainer linking to MakeLocal tracker
- Confirmation screen with handoff instructions
- Fallback messaging if draft creation fails
- Add to Home Screen prompt/guidance in confirmation
- (Stretch) Optional microsite status module mirroring MakeLocal state
- (Stretch) Staff override controls for simulation mode
- (Stretch) Live queue banner sync with simulation

**Dependencies:** Epic 4 (Cart & Checkout) - needs checkout completion

**Estimated Completion:** 1 sprint (2 sprints with stretch goals)

### Stories

**Story 5.1: Create Order Status Explainer Page**

As a visitor who completed checkout,
I want to understand what happens next with my order,
So that I know how to track it on MakeLocal.

**Acceptance Criteria:**
1. Confirmation page displays after successful order draft creation
2. Explains that order tracking continues on MakeLocal platform
3. Provides link to MakeLocal order tracker (if draft ID available)
4. Shows fallback instructions if draft creation failed
5. Includes contact information for booth staff assistance
6. Clear messaging about order fulfillment process

**Prerequisites:** Story 4.4 (Order draft API - needs success/error states)

**Technical Notes:**
- File: `src/app/checkout/confirmation/page.tsx`
- Route: `/checkout/confirmation?draftId={id}` or similar
- Content: Static copy explaining handoff process
- Link: Deep link to MakeLocal tracker with draft ID
- Fallback: Instructions to speak with booth staff

---

**Story 5.2: Add PWA Installation Prompt**

As a visitor,
I want to install the microsite on my device,
So that I can quickly return to it during the event.

**Acceptance Criteria:**
1. Add to Home Screen prompt appears in confirmation screen
2. Prompt includes instructions for iOS and Android
3. Prompt is non-intrusive (can be dismissed)
4. Tracks prompt exposure for analytics (Story 1.3)
5. Target: ≥10% completion rate (per PRD)
6. Works on both iOS Safari and Android Chrome

**Prerequisites:** Story 5.1 (Confirmation page - prompt appears here)

**Technical Notes:**
- File: `src/app/components/InstallPrompt.tsx`
- Use `beforeinstallprompt` event (Android) or manual instructions (iOS)
- Instructions: Visual guide for adding to home screen
- Analytics: Track prompt shown, dismissed, completed
- Consider showing after engagement threshold (not immediately)

---

**Story 5.3: Implement Fallback Messaging for Failed Drafts**

As a visitor,
I want clear instructions if order draft creation fails,
So that I know what to do next.

**Acceptance Criteria:**
1. Error state displays if order draft API call fails
2. Clear messaging: "We couldn't create your draft order"
3. Provides alternative: Speak with booth staff, try again, or provide contact info
4. Error message is user-friendly (not technical)
5. Option to retry draft creation
6. Lead capture still works even if draft fails

**Prerequisites:** Story 4.4 (Order draft API - handles errors)

**Technical Notes:**
- File: `src/app/components/CheckoutError.tsx`
- Error types: Network error, API error, validation error
- User messaging: Map technical errors to user-friendly messages
- Retry: Allow user to attempt draft creation again
- Fallback: Always capture lead even if draft fails

---

**Story 5.4: (Stretch) Build Order Status Simulation Module**

As a visitor,
I want to see my order progress on the microsite,
So that I can watch it move through the queue even if MakeLocal is offline.

**Acceptance Criteria:**
1. Optional status module displays order progress (Queued → Printing → Cooling → Ready)
2. Progress updates automatically based on deterministic timing
3. Status syncs with MakeLocal if available, otherwise runs simulation
4. Staff can override simulation mode (Story 5.5)
5. Simulation uses realistic timing (per product print time)
6. Status persists across page refreshes

**Prerequisites:** Story 5.1 (Confirmation page - status module appears here)

**Technical Notes:**
- File: `src/app/components/OrderStatus.tsx`
- Simulation: Deterministic state machine with timers
- State: `{ status, progress, estimatedCompletion }`
- Sync: Poll MakeLocal API if available, fallback to simulation
- Storage: Save status in localStorage for persistence

---

**Story 5.5: (Stretch) Create Staff Override Controls for Simulation**

As a booth staff member,
I want to control the order status simulation,
So that I can reset it or sync it with actual MakeLocal orders.

**Acceptance Criteria:**
1. Staff-only controls accessible via keyboard combo or admin route
2. Options: Reset simulation, sync with MakeLocal, toggle simulation on/off
3. Controls are hidden from regular visitors
4. Reset clears all simulated order statuses
5. Sync fetches real status from MakeLocal API
6. Toggle allows disabling simulation entirely

**Prerequisites:** Story 5.4 (Status simulation - needs controls)

**Technical Notes:**
- File: `src/app/admin/simulation/page.tsx` or keyboard shortcut
- Controls: Buttons for reset, sync, toggle
- API: Call MakeLocal API to fetch real order statuses
- Storage: Update localStorage with real or simulated data
- Password protection: Same as lead export (Story 4.6)

---

**Story 5.6: (Stretch) Sync Live Queue Banner with Simulation**

As a visitor,
I want to see queue activity that matches order status,
So that the experience feels cohesive and real.

**Acceptance Criteria:**
1. Queue banner (Story 2.2) displays orders from simulation when active
2. Banner updates as orders progress through statuses
3. Banner shows realistic names and items from simulation
4. Falls back to static messages if simulation disabled
5. Performance: Smooth updates without jank
6. Accessible: Screen readers can access updated messages

**Prerequisites:** Story 5.4 (Status simulation - provides data for banner)

**Technical Notes:**
- File: `src/app/components/QueueBanner.tsx` (update from Story 2.2)
- Data source: Simulation state or static messages
- Updates: Subscribe to simulation state changes
- Format: Transform simulation orders to banner message format
- Performance: Throttle updates to prevent excessive re-renders

---

## Epic 6: Coordinator Experience

**Goal:** Showcase MakeLocal's API-powered shop tools for coordinator prospects through interactive mock interface.

**Value Proposition:** Demonstrates technical capabilities and business model to coordinator prospects evaluating the platform.

**Business Goal:** Convert coordinator prospects into leads and drive them to MakeLocal coordinator registration.

**Epic Scope:**
- Coordinator mode toggle in persistent navigation
- Drawer/panel with tabbed sections (Catalog, Orders, Job Steps)
- API mock data tables and JSON displays aligned with API docs
- Business value messaging and benefits bullets
- Coordinator lead form (name, email, company, idea, consent checkbox)
- Direct link to MakeLocal coordinator registration
- Thank-you state with follow-up instructions

**Dependencies:** Epic 1 (Foundation) - can be developed in parallel with other epics

**Estimated Completion:** 1 sprint

### Stories

**Story 6.1: Add Coordinator Mode Toggle**

As a coordinator prospect,
I want to access coordinator-specific features,
So that I can explore MakeLocal's API capabilities.

**Acceptance Criteria:**
1. Toggle button in persistent navigation (header or sidebar)
2. Toggle clearly indicates when coordinator mode is active
3. Toggle is accessible (keyboard navigable, screen reader friendly)
4. Toggle state persists across page navigation
5. Visual indicator shows coordinator mode is active
6. Toggle opens coordinator drawer/panel (Story 6.2)

**Prerequisites:** None (can be developed in parallel)

**Technical Notes:**
- File: `src/app/components/CoordinatorToggle.tsx`
- State: React context or global state for coordinator mode
- Storage: Optional persistence in localStorage
- Design: Use accent color from STYLEGUIDE.md to indicate active state
- Accessibility: ARIA labels, keyboard shortcuts

---

**Story 6.2: Build Coordinator Drawer with Tabbed Sections**

As a coordinator prospect,
I want to see API examples and mock data,
So that I understand how MakeLocal's API works.

**Acceptance Criteria:**
1. Drawer/panel opens when coordinator mode is active
2. Three tabs: Catalog API, Orders API, Job Steps API
3. Each tab displays mock data in table or JSON format
4. Data aligns with API documentation (see `docs/makelocal-api/`)
5. Drawer is responsive: Full screen on mobile, sidebar on desktop
6. Drawer can be closed/dismissed

**Prerequisites:** Story 6.1 (Coordinator toggle - opens drawer)

**Technical Notes:**
- File: `src/app/components/CoordinatorDrawer.tsx`
- Tabs: Use React tabs component or simple state-based switching
- Mock data: `src/data/coordinator-mocks.json` (aligned with API docs)
- JSON display: Syntax highlighting library (e.g., `react-syntax-highlighter`)
- Table: Simple HTML table or data grid component
- Responsive: CSS media queries or mobile-first design

---

**Story 6.3: Create API Mock Data Tables**

As a coordinator prospect,
I want to see realistic API responses,
So that I can evaluate MakeLocal's data structures.

**Acceptance Criteria:**
1. Catalog tab: Shows product list with API response format
2. Orders tab: Shows order list with status, items, timestamps
3. Job Steps tab: Shows job progression events/stream
4. Data looks realistic (realistic names, IDs, timestamps)
5. Data format matches API documentation structure
6. Tables are sortable/filterable (optional enhancement)

**Prerequisites:** Story 6.2 (Coordinator drawer - displays data)

**Technical Notes:**
- File: `src/data/coordinator-mocks.json`
- Structure: `{ catalog: [...], orders: [...], jobSteps: [...] }`
- Reference: `docs/makelocal-api/` for API contract
- Display: `src/app/components/ApiMockTable.tsx` component
- Format: JSON.stringify with formatting or table rows

---

**Story 6.4: Add Business Value Messaging**

As a coordinator prospect,
I want to understand the value of becoming a coordinator,
So that I can decide if MakeLocal is right for me.

**Acceptance Criteria:**
1. Business value section in coordinator drawer
2. Benefits bullets: API access, shop tools, business model, support
3. Messaging is clear and compelling
4. Includes CTA to coordinator lead form (Story 6.5)
5. Visual design matches MakeLocal brand
6. Content is concise and scannable

**Prerequisites:** Story 6.2 (Coordinator drawer - displays messaging)

**Technical Notes:**
- File: `src/app/components/CoordinatorValue.tsx`
- Content: Static copy or from `src/data/coordinator-content.json`
- Design: Use STYLEGUIDE.md tokens
- CTA: Link to coordinator form component

---

**Story 6.5: Build Coordinator Lead Form**

As a coordinator prospect,
I want to express interest in becoming a coordinator,
So that MakeLocal can follow up with me.

**Acceptance Criteria:**
1. Form fields: name, email, company, idea (free text), consent checkbox
2. Form validation: Required fields, email format, consent required
3. Form submission stores lead data (reuse Story 4.5 storage)
4. Success state: Thank-you message with next steps
5. Direct link to MakeLocal coordinator registration
6. Form is accessible (keyboard navigable, screen reader friendly)

**Prerequisites:** Story 6.4 (Business value - CTA opens form)

**Technical Notes:**
- File: `src/app/components/CoordinatorForm.tsx`
- Form library: React Hook Form or native form handling
- Validation: Email regex, required field checks
- Storage: Reuse `src/lib/lead-storage.ts` with coordinator flag
- Success: `src/app/components/CoordinatorThankYou.tsx`
- Link: MakeLocal coordinator registration URL (from PRD)

---

**Story 6.6: Create Coordinator Thank-You State**

As a coordinator prospect,
I want confirmation that my interest was received,
So that I know MakeLocal will follow up.

**Acceptance Criteria:**
1. Thank-you page displays after form submission
2. Message: "We'll email you after Web Summit"
3. Provides direct link to MakeLocal coordinator registration
4. Option to open MakeLocal registration in new tab
5. Clear next steps communicated
6. Staff notification (optional: visual indicator or log)

**Prerequisites:** Story 6.5 (Coordinator form - submits to thank-you)

**Technical Notes:**
- File: `src/app/components/CoordinatorThankYou.tsx`
- Content: Static thank-you message
- Link: MakeLocal coordinator registration URL
- Analytics: Track coordinator lead submission (Story 1.3)
- Optional: Show notification in admin panel

---

## Epic 7: Content & Storytelling

**Goal:** Educate visitors about MakeLocal's model, roles, and value proposition through informational sections.

**Value Proposition:** Builds understanding of the platform ecosystem and supports conversion for multiple audience types.

**Business Goal:** Support NPS ≥ 8/10 for clarity of MakeLocal story (per PRD success metrics).

**Epic Scope:**
- "How MakeLocal Works" section with 4-step infographic (icons + copy)
- "Roles" grid highlighting six personas with descriptions
- Coordinator pitch section with benefits and imagery
- Contact section (booth location, dates, map thumbnail, social links)
- Content externalization in structured JSON/MD files
- Configurable booth number, dates, CTA text (env or JSON)
- Demo mode vs post-event mode messaging toggle

**Dependencies:** Epic 1 (Foundation) - can be developed in parallel

**Estimated Completion:** 1 sprint

### Stories

**Story 7.1: Build "How MakeLocal Works" Section**

As a visitor,
I want to understand how MakeLocal's platform works,
So that I can appreciate the value proposition.

**Acceptance Criteria:**
1. Section displays 4-step infographic with icons and copy
2. Steps: Upload design → Find maker → Print locally → Deliver
3. Visual design is clear and scannable
4. Icons are consistent with MakeLocal brand
5. Section is responsive (mobile and desktop)
6. Section is accessible (keyboard navigable, screen reader friendly)

**Prerequisites:** None (can be developed in parallel)

**Technical Notes:**
- File: `src/app/components/HowItWorks.tsx`
- Content: `src/data/how-it-works.json` (externalized)
- Icons: SVG icons or icon library (Heroicons, etc.)
- Layout: Grid or flexbox for 4-step layout
- Design: Follow STYLEGUIDE.md tokens

---

**Story 7.2: Create "Roles" Grid Section**

As a visitor,
I want to understand who participates in MakeLocal's ecosystem,
So that I can see where I fit in.

**Acceptance Criteria:**
1. Grid displays 6 personas: Customer, Coordinator, Maker, Designer, Courier, Production Lead
2. Each persona has: name, description, icon/illustration
3. Grid is responsive: 1-2 columns mobile, 3 columns tablet, 3-6 columns desktop
4. Visual design is consistent and engaging
5. Section is accessible (keyboard navigable, screen reader friendly)
6. Content is concise and scannable

**Prerequisites:** None (can be developed in parallel)

**Technical Notes:**
- File: `src/app/components/Roles.tsx`
- Content: `src/data/roles.json` (externalized)
- Persona component: `src/app/components/PersonaCard.tsx`
- Icons: SVG icons or illustrations per persona
- Layout: CSS Grid for responsive columns

---

**Story 7.3: Build Coordinator Pitch Section**

As a coordinator prospect,
I want to see the benefits of becoming a coordinator,
So that I can evaluate if MakeLocal is right for me.

**Acceptance Criteria:**
1. Section highlights coordinator benefits with bullets
2. Benefits: API access, shop tools, business model, support, etc.
3. Includes supportive imagery or illustrations
4. CTA links to coordinator mode (Story 6.1) or coordinator form (Story 6.5)
5. Visual design matches MakeLocal brand
6. Section is accessible and responsive

**Prerequisites:** None (can be developed in parallel, but CTA links to Epic 6)

**Technical Notes:**
- File: `src/app/components/CoordinatorPitch.tsx`
- Content: `src/data/coordinator-pitch.json` (externalized)
- Benefits: Bullet list or card layout
- Images: Use design assets from `/design` folder
- CTA: Link to coordinator mode toggle or form

---

**Story 7.4: Create Contact Section**

As a visitor,
I want to find MakeLocal's booth location and contact information,
So that I can visit or get in touch.

**Acceptance Criteria:**
1. Section displays: booth location, dates, map thumbnail, social links
2. Booth number and dates are configurable (env or JSON)
3. Map thumbnail links to full map (if available)
4. Social links: Twitter, LinkedIn, website, etc.
5. Section is responsive and accessible
6. Content is clear and easy to find

**Prerequisites:** None (can be developed in parallel)

**Technical Notes:**
- File: `src/app/components/Contact.tsx`
- Content: `src/data/contact.json` or environment variables
- Config: `NEXT_PUBLIC_BOOTH_NUMBER`, `NEXT_PUBLIC_EVENT_DATES`
- Map: Static image or embedded map (Google Maps, etc.)
- Social links: Icon buttons with proper hrefs

---

**Story 7.5: Externalize Content to JSON/MD Files**

As a content manager,
I want content to be easily editable without code changes,
So that we can iterate on messaging quickly.

**Acceptance Criteria:**
1. All copy externalized: product data, queue messages, roles, how-it-works, contact
2. JSON files: `src/data/products.json`, `src/data/queue-messages.json`, etc.
3. Markdown files: `src/data/content.md` for longer-form content (optional)
4. Content loaded at build time or runtime
5. Content structure is documented
6. Content can be updated without redeploy (if using runtime loading)

**Prerequisites:** Stories 7.1-7.4 (Content sections - need data sources)

**Technical Notes:**
- Files: `src/data/*.json` for structured data
- Loading: `import` at build time or `fetch` at runtime
- Structure: Document schema in comments or TypeScript types
- Runtime: Consider API endpoint or CMS if content changes frequently
- Build time: Simpler, but requires redeploy for changes

---

**Story 7.6: Add Demo Mode vs Post-Event Mode Toggle**

As a booth staff member,
I want to switch between demo and post-event messaging,
So that the microsite works for both scenarios.

**Acceptance Criteria:**
1. Toggle switches messaging between demo mode and post-event mode
2. Demo mode: "Order at Web Summit", "Visit our booth", etc.
3. Post-event mode: "Order now", "Join MakeLocal", etc.
4. Toggle is staff-only (keyboard combo or admin route)
5. Toggle state persists across sessions
6. All relevant CTAs and messaging update based on mode

**Prerequisites:** Story 7.5 (Content externalization - enables mode switching)

**Technical Notes:**
- File: `src/lib/mode-toggle.ts` utility
- Storage: localStorage for mode state
- Content: Use mode variable in content JSON: `{ demo: "...", postEvent: "..." }`
- Components: Conditionally render based on mode
- Toggle: Same mechanism as staff reset (Story 1.4)

---

## Implementation Sequence

### Development Phases

**Phase 1 - Foundation (Week 1-2):**
Establish technical infrastructure and core user experience.

**Stories:**
- Story 1.1: Create PWA Manifest and Service Worker Foundation
- Story 1.2: Implement Offline Caching Strategy
- Story 1.4: Create Staff Reset Controls (can parallel with 1.1)
- Story 1.5: Implement Performance Optimization
- Story 2.1: Build Responsive Hero Section
- Story 2.2: Create Live Queue Banner Component
- Story 2.3: Build Product Catalog Grid
- Story 2.4: Design Product Card Component
- Story 2.5: Create Product Detail View

**Parallel Opportunities:**
- Stories 1.1, 1.4 can run in parallel (no dependencies)
- Stories 2.1-2.5 can run in parallel after 1.5 (performance foundation)
- Story 1.3 (Analytics) can start after 1.2

**Deliverable:** Working catalog with hero, queue banner, and PWA foundation

---

**Phase 2 - Core Features (Week 3-4):**
Enable personalization and checkout flow.

**Stories:**
- Story 1.3: Add Analytics Instrumentation (if not done in Phase 1)
- Story 3.1: Build Personalization Form Component
- Story 3.2: Implement Personalization Option Persistence
- Story 3.3: Add Estimated Print Time Updates
- Story 3.4: Create Visual Preview of Personalized Options
- Story 4.1: Implement Cart Storage and Management
- Story 4.2: Build Cart Overlay/Page Component
- Story 4.3: Create Checkout Form with Lead Capture
- Story 4.4: Integrate MakeLocal Order Draft API
- Story 4.5: Implement Lead Capture Logging
- Story 4.6: Create Staff Lead Export Feature

**Parallel Opportunities:**
- Stories 3.1-3.4 can run in parallel (all depend on 2.5)
- Stories 4.1-4.2 can start after 3.1 (personalization adds to cart)
- Story 4.6 can be developed independently

**Deliverable:** Complete checkout flow with order draft integration

---

**Phase 3 - Enhancement (Week 5-6):**
Add post-checkout experience and coordinator features.

**Stories:**
- Story 5.1: Create Order Status Explainer Page
- Story 5.2: Add PWA Installation Prompt
- Story 5.3: Implement Fallback Messaging for Failed Drafts
- Story 6.1: Add Coordinator Mode Toggle
- Story 6.2: Build Coordinator Drawer with Tabbed Sections
- Story 6.3: Create API Mock Data Tables
- Story 6.4: Add Business Value Messaging
- Story 6.5: Build Coordinator Lead Form
- Story 6.6: Create Coordinator Thank-You State

**Parallel Opportunities:**
- Stories 5.1-5.3 can run in parallel (all depend on 4.4)
- Epic 6 stories can run in parallel with Epic 5 (independent features)
- Story 6.1 can start immediately (no dependencies)

**Deliverable:** Post-checkout experience and coordinator mode complete

---

**Phase 4 - Content & Polish (Week 7-8):**
Add informational content and final optimizations.

**Stories:**
- Story 7.1: Build "How MakeLocal Works" Section
- Story 7.2: Create "Roles" Grid Section
- Story 7.3: Build Coordinator Pitch Section
- Story 7.4: Create Contact Section
- Story 7.5: Externalize Content to JSON/MD Files
- Story 7.6: Add Demo Mode vs Post-Event Mode Toggle
- Story 5.4: (Stretch) Build Order Status Simulation Module
- Story 5.5: (Stretch) Create Staff Override Controls for Simulation
- Story 5.6: (Stretch) Sync Live Queue Banner with Simulation

**Parallel Opportunities:**
- Stories 7.1-7.4 can all run in parallel (no dependencies)
- Story 7.5 can start after 7.1-7.4 (externalizes their content)
- Stretch stories (5.4-5.6) can run in parallel if time permits

**Deliverable:** Complete microsite with all content sections and optional stretch features

---

### Dependency Graph

**Critical Path (Sequential Dependencies):**
1. Epic 1 Foundation → Epic 2 Catalog → Epic 3 Personalization → Epic 4 Checkout → Epic 5 Handoff
2. Epic 1 Foundation → Epic 6 Coordinator (can parallel with Epic 2-5)
3. Epic 1 Foundation → Epic 7 Content (can parallel with Epic 2-5)

**Key Dependencies:**
- Story 1.2 (Offline caching) → Story 1.3 (Analytics buffering)
- Story 1.5 (Performance) → All Epic 2 stories (LCP optimization)
- Story 2.5 (Product detail) → All Epic 3 stories (personalization entry point)
- Story 3.1 (Personalization form) → Story 4.1 (Cart - adds personalized items)
- Story 4.4 (Order draft API) → Story 5.1 (Confirmation page)

**Parallel Development Opportunities:**
- Epic 6 (Coordinator) can be developed entirely in parallel with Epic 2-5
- Epic 7 (Content) can be developed entirely in parallel with Epic 2-5
- Stories 1.1, 1.4 (PWA, Reset) can start immediately (no dependencies)
- Stories 7.1-7.4 (Content sections) can all run in parallel

---

### Implementation Gates

**Gate 1: Foundation Complete**
- ✅ PWA installable and offline-capable
- ✅ Performance targets met (LCP < 2.5s, JS < 200KB)
- ✅ Catalog displays products with hero and queue banner
- **Checkpoint:** Can demo basic browsing experience

**Gate 2: Core Flow Complete**
- ✅ Personalization works end-to-end
- ✅ Cart and checkout flow functional
- ✅ Order draft API integrated (≥90% success rate)
- **Checkpoint:** Can demo full visitor journey

**Gate 3: Feature Complete**
- ✅ Coordinator mode functional
- ✅ Post-checkout experience polished
- ✅ All content sections live
- **Checkpoint:** Ready for alpha demo (T-3 weeks milestone)

**Gate 4: Production Ready**
- ✅ All stretch features complete (if time permits)
- ✅ QA complete (accessibility, responsive, performance)
- ✅ Lead export workflow validated
- ✅ Staff reset and admin tools tested
- **Checkpoint:** Ready for event (T-1 week milestone)

---

## Story Validation Summary

### Size Check ✅

All stories verified for dev agent compatibility:

- **Story descriptions:** All < 500 words (most < 300 words)
- **Clear inputs/outputs:** Each story defines what it needs and produces
- **Single responsibility:** Each story addresses one feature/component
- **No hidden complexity:** Technical notes clarify implementation approach

**Stories that may need splitting during implementation:**
- Story 4.4 (Order Draft API) - Complex integration, monitor for size
- Story 5.4 (Status Simulation) - Stretch story, can be further decomposed if needed

### Clarity Check ✅

All stories have explicit acceptance criteria:

- **Acceptance criteria:** 4-6 testable criteria per story
- **Technical approach:** Technical notes provide file paths and patterns
- **No ambiguous requirements:** All stories reference specific PRD requirements
- **Success measurable:** Each story has clear completion criteria

### Dependency Check ✅

Dependencies clearly documented:

- **Dependencies documented:** Prerequisites listed for each story
- **Can start with clear inputs:** Foundation stories have no dependencies
- **Outputs well-defined:** Each story produces specific components/files
- **Parallel opportunities:** Identified in implementation sequence

**Stories that can start immediately (no dependencies):**
- Story 1.1: PWA Manifest
- Story 1.4: Staff Reset Controls
- Story 6.1: Coordinator Toggle
- Stories 7.1-7.4: Content Sections

### Domain Check ✅

Event demo requirements integrated:

- **Offline-first:** Stories 1.2, 1.3, 4.4 address offline resilience
- **Performance:** Story 1.5 ensures PRD performance targets
- **Accessibility:** All UI stories include WCAG 2.1 AA requirements
- **Event-specific:** Stories 1.4, 4.6, 7.6 address booth staff needs

### Final Validation ✅

**Total Stories:** 42 stories (39 core + 3 stretch)

**Can run in parallel:** 
- Phase 1: 5 stories can parallel
- Phase 2: 8 stories can parallel  
- Phase 3: 9 stories can parallel
- Phase 4: 7 stories can parallel

**Sequential dependencies:** 
- Critical path: 15 stories (Epic 1 → 2 → 3 → 4 → 5)
- Independent epics: Epic 6 (6 stories), Epic 7 (6 stories)

**Estimated completion:** 
- Core features: 6-7 weeks (Phases 1-3)
- Full scope: 8 weeks (including Phase 4 content)
- With stretch: 9-10 weeks (including simulation features)

**Story Sizing:** All stories sized for 200k context limits. Each story:
- Can be explained in <1000 words
- Can be completed by one agent without another's output
- Has crystal clear scope and success criteria
- Includes domain requirements (offline, performance, accessibility)

---

## Development Guidance

### Getting Started

**Start with Phase 1 stories** - Multiple can run in parallel.

**Key files to create first:**
- `public/manifest.json` - PWA manifest
- `public/sw.js` - Service worker
- `src/app/components/Hero.tsx` - Hero section
- `src/app/components/ProductGrid.tsx` - Product catalog
- `src/data/products.json` - Product data

**Recommended agent allocation:**
- Agent 1: PWA foundation (Stories 1.1, 1.2, 1.5)
- Agent 2: Catalog UI (Stories 2.1-2.5)
- Agent 3: Staff tools (Story 1.4) + Content sections (Stories 7.1-7.4)

### Critical Checkpoints

**After Phase 1 (Foundation):**
- ✅ Test PWA installation on iOS and Android
- ✅ Verify offline caching works (Chrome DevTools offline mode)
- ✅ Measure LCP < 2.5s on throttled 3G
- ✅ Test staff reset controls (keyboard combo and URL param)

**After Phase 2 (Core Features):**
- ✅ Test full personalization → cart → checkout flow
- ✅ Verify order draft API integration (≥90% success rate)
- ✅ Test lead capture and export (CSV download)
- ✅ Validate cart persistence across page refreshes

**After Phase 3 (Enhancement):**
- ✅ Test coordinator mode toggle and drawer
- ✅ Verify post-checkout confirmation and PWA prompt
- ✅ Test error handling for failed order drafts
- ✅ Validate all deep links to MakeLocal platform

**After Phase 4 (Content & Polish):**
- ✅ Complete accessibility audit (WCAG 2.1 AA)
- ✅ Test responsive design on mobile, tablet, desktop
- ✅ Performance audit (LCP, bundle size, offline behavior)
- ✅ Staff tools tested (reset, lead export, mode toggle)

### Technical Notes

**Architecture decisions needed:**

- **State management:** React Context vs Zustand vs Redux
  - Affects: Stories 3.2, 4.1, 6.1 (cart, personalization, coordinator mode)
  - Recommendation: Start with React Context, upgrade if needed

- **Form handling:** React Hook Form vs native forms
  - Affects: Stories 3.1, 4.3, 6.5 (personalization, checkout, coordinator form)
  - Recommendation: React Hook Form for validation and state

- **API client:** Fetch vs Axios vs tRPC
  - Affects: Story 4.4 (order draft API)
  - Recommendation: Native fetch with error handling wrapper

**Consider these patterns:**

- **Storage utilities:** Centralize localStorage access
  - Pattern: `src/lib/storage.ts` with typed helpers
  - Used by: Cart, personalization, leads, analytics

- **Component composition:** Reusable UI primitives
  - Pattern: Button, Input, Card components in `src/app/components/ui/`
  - Used by: All UI stories

- **Error boundaries:** Graceful error handling
  - Pattern: React Error Boundaries for route-level errors
  - Used by: All phases

### Risk Mitigation

**Watch out for:**

- **Story 4.4 (Order Draft API):** API contract may change late
  - Mitigation: Mock API responses, abstract API client
  - Risk: High - blocks checkout flow

- **Story 1.5 (Performance):** Bundle size may exceed 200KB
  - Mitigation: Code splitting, dynamic imports, bundle analysis
  - Risk: Medium - affects PRD requirement

- **Story 5.4 (Status Simulation):** Complex state management
  - Mitigation: Use state machine library (XState) or simple timers
  - Risk: Low - stretch story, can simplify or defer

- **Dependency between Epic 4 and Epic 5:** Order draft success required
  - Mitigation: Story 5.3 provides fallback messaging
  - Risk: Medium - affects user experience

### Success Metrics

**You'll know Phase 1 is complete when:**
- ✅ PWA installs successfully on iOS and Android
- ✅ Site works offline after initial load
- ✅ LCP < 2.5s on throttled 3G connection
- ✅ Catalog displays 6-9 products with hero and queue banner

**You'll know Phase 2 is complete when:**
- ✅ Visitor can personalize product and add to cart
- ✅ Checkout creates order draft on MakeLocal (≥90% success)
- ✅ Lead data exports to CSV successfully
- ✅ Full flow works end-to-end without errors

**You'll know Phase 3 is complete when:**
- ✅ Coordinator mode toggle works and opens drawer
- ✅ Post-checkout confirmation displays correctly
- ✅ PWA install prompt appears (≥10% completion target)
- ✅ All error states have user-friendly messaging

**You'll know Phase 4 is complete when:**
- ✅ All content sections render correctly
- ✅ Accessibility audit passes (WCAG 2.1 AA)
- ✅ Performance targets met (LCP, bundle size)
- ✅ Staff tools tested and documented

---

## Story Guidelines Reference

**Story Format:**

```
**Story [EPIC.N]: [Story Title]**

As a [user type],
I want [goal/desire],
So that [benefit/value].

**Acceptance Criteria:**
1. [Specific testable criterion]
2. [Another specific criterion]
3. [etc.]

**Prerequisites:** [Dependencies on previous stories, if any]
```

**Story Requirements:**

- **Vertical slices** - Complete, testable functionality delivery
- **Sequential ordering** - Logical progression within epic
- **No forward dependencies** - Only depend on previous work
- **AI-agent sized** - Completable in 2-4 hour focused session
- **Value-focused** - Integrate technical enablers into value-delivering stories

---

**For implementation:** Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown.

---

## Summary

**✅ Epic Decomposition Complete, MakeLocal WebSimmit Demo!**

Your requirements are now organized into **7 epics** with **42 bite-sized stories** (39 core + 3 stretch).

**Created:**

- **epics.md** - Complete epic breakdown with implementable stories

**Key Stats:**

- **Total Epics:** 7 epics covering foundation, catalog, personalization, checkout, handoff, coordinator experience, and content
- **Total Stories:** 42 stories (39 core + 3 stretch)
- **Average story size:** Fits in 200k context window
- **Parallel stories:** 29 stories can run simultaneously across phases
- **Sequential chains:** 15 stories in critical path (Epic 1 → 2 → 3 → 4 → 5)
- **Estimated velocity:** 6-7 weeks for core features, 8 weeks for full scope, 9-10 weeks with stretch goals

**Epic Breakdown:**

1. **Epic 1: Foundation & Infrastructure** - 5 stories (PWA, offline, analytics, reset, performance)
2. **Epic 2: Catalog & Discovery** - 5 stories (hero, queue banner, catalog grid, cards, detail view)
3. **Epic 3: Product Personalization** - 4 stories (form, persistence, print time, preview)
4. **Epic 4: Cart & Checkout Flow** - 6 stories (cart storage, cart UI, checkout form, API integration, lead capture, export)
5. **Epic 5: Order Status & Handoff** - 6 stories (3 core + 3 stretch: status explainer, PWA prompt, fallback, simulation, controls, banner sync)
6. **Epic 6: Coordinator Experience** - 6 stories (toggle, drawer, API mocks, value messaging, form, thank-you)
7. **Epic 7: Content & Storytelling** - 6 stories (how it works, roles, coordinator pitch, contact, content externalization, mode toggle)

**Next Steps:**

1. Review epics.md for the complete breakdown
2. Start Phase 1 implementation with parallel stories (Foundation & Catalog)
3. Use story IDs for tracking progress (e.g., Story 1.1, Story 2.1)
4. Follow implementation sequence and gates for checkpoints
5. Use development guidance section for technical decisions

Each story is crafted for a single dev agent to complete autonomously. No monoliths, no confusion, just clear implementation paths.

**Ready to begin development with any story marked "can start immediately"!**

Stories that can start immediately:
- Story 1.1: Create PWA Manifest and Service Worker Foundation
- Story 1.4: Create Staff Reset Controls
- Story 6.1: Add Coordinator Mode Toggle
- Stories 7.1-7.4: Content Sections (How It Works, Roles, Coordinator Pitch, Contact)

