# Epic Technical Specification: Foundation & Infrastructure

Date: 2025-11-06
Author: MakeLocal WebSimmit Demo
Epic ID: 1
Status: Draft

---

## Overview

Epic 1 establishes the foundational technical infrastructure required for the MakeLocal Web Summit microsite to operate reliably during the event. This epic focuses on creating an offline-first Progressive Web App (PWA) that can function seamlessly on unreliable conference Wi-Fi, provides analytics capabilities for event learnings, and includes staff management tools for quick resets between demo sessions. The epic aligns with the PRD's core requirement for event resilience and ensures the microsite works flawlessly with minimal staff intervention.

The foundation enables all subsequent epics by providing PWA capabilities, offline caching, performance optimization, and essential infrastructure for analytics and staff controls. This epic has no dependencies and can be developed in parallel with other foundational work.

## Objectives and Scope

### In-Scope

- **Progressive Web App (PWA) Infrastructure**
  - Web app manifest (`manifest.json`) with required fields (name, short_name, icons, start_url, display mode)
  - Service worker registration and basic lifecycle management
  - Add to Home Screen prompt support for mobile devices

- **Offline Caching Strategy**
  - Service worker caching for critical HTML, CSS, JS, and image assets
  - Cache-first strategy for static assets, network-first for API calls
  - Cache versioning to force updates when content changes
  - Offline fallback page for uncached routes
  - Cache size limits to prevent excessive storage usage

- **Analytics Instrumentation (Offline-First)**
  - Event tracking for page views, CTA clicks, checkout starts, lead submissions
  - Local buffering when offline, sync when network available
  - Privacy-compliant (no third-party trackers)
  - Simple dashboard or log view for booth staff
  - GDPR disclosure in footer if required

- **Staff Reset Controls**
  - Keyboard combo (Ctrl+Shift+R or Cmd+Shift+R) to clear cart and lead data
  - URL parameter (`?reset=true`) trigger
  - Reset confirmation dialog to prevent accidental clears
  - Reset time < 15 seconds (per PRD requirement)

- **Performance Optimization**
  - Largest Contentful Paint (LCP) < 2.5s on booth hardware with throttled 3G
  - Total JS payload < 200KB gzipped for initial route
  - Image optimization (WebP format, lazy loading, responsive sizes)
  - Critical CSS inlined or loaded with high priority
  - Fonts preloaded or subsetted

### Out-of-Scope

- Real-time queue synchronization (deferred to Epic 5 stretch goals)
- Complex state management beyond localStorage/sessionStorage
- Backend API integrations (deferred to Epic 4)
- Multi-language support (English only per PRD)
- Advanced analytics dashboards (simple log view sufficient)

## System Architecture Alignment

Epic 1 aligns with the Next.js 16 App Router architecture documented in the Architecture Overview. The PWA infrastructure integrates with Next.js's static export capabilities and service worker support. The service worker will be deployed as `public/sw.js` and registered in the root layout or app entry point.

The architecture follows a single-page marketing site pattern with server-side rendering capabilities. The offline caching strategy leverages Next.js's static asset optimization and the Cache API in the service worker. Performance optimizations align with Next.js Image component, code splitting via dynamic imports, and Tailwind CSS 4's optimized build output.

The foundation establishes patterns for:
- **Storage utilities**: Centralized localStorage access for cart, personalization, leads, and analytics buffering
- **Service worker lifecycle**: Registration, activation, and update patterns that will be extended in Epic 2 for route caching
- **Performance monitoring**: LCP measurement and bundle size tracking that will inform subsequent epic implementations

All components created in this epic will be compatible with React 19.2.0 and TypeScript strict mode, following the established architecture patterns.

## Detailed Design

### Services and Modules

| Module | Location | Responsibilities | Inputs | Outputs | Owner |
|--------|----------|------------------|--------|---------|-------|
| **Service Worker** | `public/sw.js` | Manages offline caching, cache versioning, fetch interception | Install/activate events, fetch requests | Cached responses, cache updates | Frontend Team |
| **PWA Manifest** | `public/manifest.json` | Defines app metadata, icons, display mode, theme colors | Build-time configuration | Installable PWA behavior | Frontend Team |
| **Service Worker Registration** | `src/app/layout.tsx` or `src/app/register-sw.ts` | Registers service worker on app initialization | Page load event | Service worker registration promise | Frontend Team |
| **Analytics Module** | `src/lib/analytics.ts` | Tracks events, buffers offline, syncs when online | Event objects (type, properties, timestamp) | Buffered events, sync status | Product/Engineering |
| **Analytics Storage** | `src/lib/analytics-storage.ts` | Manages localStorage/IndexedDB for event buffering | Analytics events | Stored events array, sync queue | Frontend Team |
| **Reset Utility** | `src/lib/reset.ts` | Clears cart, leads, personalization data via keyboard/URL | Keyboard events, URL params | Cleared storage, confirmation state | Frontend Team |
| **Storage Utilities** | `src/lib/storage.ts` | Centralized localStorage wrappers with type safety | Storage keys, values | Typed storage operations | Frontend Team |
| **Performance Monitor** | `src/lib/performance.ts` | Measures LCP, bundle size, reports metrics | Performance API, build metrics | Performance reports | Frontend Team |
| **Cache Manager** | `public/sw.js` (within service worker) | Manages cache versioning, size limits, cleanup | Cache names, versions, size limits | Cache instances, cleanup results | Frontend Team |

### Data Models and Contracts

#### Analytics Event Schema

```typescript
interface AnalyticsEvent {
  event: string;              // Event type: 'page_view' | 'cta_click' | 'checkout_start' | 'lead_submit' | 'install_prompt'
  timestamp: number;          // Unix timestamp (milliseconds)
  properties: {
    [key: string]: string | number | boolean | null;
  };
  sessionId: string;          // Unique session identifier
  userId?: string;            // Optional user identifier (if available)
}

// Storage format in localStorage/IndexedDB
interface AnalyticsBuffer {
  events: AnalyticsEvent[];
  lastSyncTimestamp: number | null;
  syncInProgress: boolean;
}
```

#### Cache Version Schema

```typescript
interface CacheVersion {
  version: string;            // Semantic version or timestamp (e.g., "1.0.0" or "2025-11-06T12:00:00Z")
  buildId: string;           // Next.js build ID or git commit hash
  timestamp: number;         // Unix timestamp when cache was created
}

// Stored in cache metadata
interface CacheMetadata {
  version: CacheVersion;
  routes: string[];           // List of cached routes
  assets: string[];          // List of cached static assets
  size: number;              // Approximate cache size in bytes
}
```

#### Storage Keys Schema

```typescript
// Centralized storage key constants
const STORAGE_KEYS = {
  CART: 'makelocal_cart',
  LEADS: 'makelocal_leads',
  PERSONALIZATION: 'makelocal_personalization',
  ANALYTICS_BUFFER: 'makelocal_analytics_buffer',
  SESSION_ID: 'makelocal_session_id',
  CACHE_VERSION: 'makelocal_cache_version',
} as const;
```

#### Service Worker Cache Names

```typescript
const CACHE_NAMES = {
  STATIC_ASSETS: 'makelocal-static-v1',      // CSS, JS, fonts
  IMAGES: 'makelocal-images-v1',              // Product images, icons
  ROUTES: 'makelocal-routes-v1',             // HTML pages
  OFFLINE_FALLBACK: 'makelocal-offline-v1',  // Offline fallback page
} as const;
```

### APIs and Interfaces

#### Service Worker API

**Install Event Handler**
```typescript
self.addEventListener('install', (event: ExtendableEvent) => {
  // Pre-cache critical assets
  event.waitUntil(
    caches.open(CACHE_NAMES.STATIC_ASSETS)
      .then(cache => cache.addAll([...criticalAssets]))
  );
});
```

**Activate Event Handler**
```typescript
self.addEventListener('activate', (event: ExtendableEvent) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => !Object.values(CACHE_NAMES).includes(name))
          .map(name => caches.delete(name))
      );
    })
  );
});
```

**Fetch Event Handler**
```typescript
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Cache-first for static assets
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
  }
  // Network-first for API calls
  else if (isApiCall(url)) {
    event.respondWith(networkFirst(request));
  }
  // Fallback for uncached routes
  else {
    event.respondWith(networkFirstWithFallback(request));
  }
});
```

#### Analytics API

```typescript
// Public API
interface AnalyticsAPI {
  track(event: string, properties?: Record<string, any>): void;
  pageView(path: string, properties?: Record<string, any>): void;
  sync(): Promise<void>;
  getBufferedEvents(): AnalyticsEvent[];
  clearBuffer(): void;
}

// Implementation
class Analytics implements AnalyticsAPI {
  track(event: string, properties = {}): void {
    const eventData: AnalyticsEvent = {
      event,
      timestamp: Date.now(),
      properties,
      sessionId: this.getSessionId(),
    };
    this.bufferEvent(eventData);
    this.attemptSync();
  }
  
  private bufferEvent(event: AnalyticsEvent): void {
    // Store in localStorage/IndexedDB
  }
  
  async sync(): Promise<void> {
    // Attempt to sync buffered events to server
  }
}
```

#### Reset API

```typescript
interface ResetAPI {
  clearCart(): void;
  clearLeads(): void;
  clearPersonalization(): void;
  clearAll(): Promise<void>;
  isResetRequested(): boolean;  // Check URL param or keyboard combo
}

// Implementation
class ResetUtility implements ResetAPI {
  clearAll(): Promise<void> {
    return new Promise((resolve) => {
      if (confirm('Clear all demo data? This cannot be undone.')) {
        this.clearCart();
        this.clearLeads();
        this.clearPersonalization();
        // Note: Does NOT clear analytics or cache
        resolve();
      }
    });
  }
  
  isResetRequested(): boolean {
    // Check URL param: ?reset=true
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === 'true') return true;
    
    // Check keyboard combo (handled by event listener)
    return false;
  }
}
```

#### Storage API

```typescript
interface StorageAPI<T> {
  get(key: string): T | null;
  set(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}

// Typed wrapper implementation
class TypedStorage {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
```

### Workflows and Sequencing

#### Service Worker Registration Flow

```
1. App Initialization (layout.tsx or app entry)
   ↓
2. Check if service workers are supported
   ↓
3. Register service worker (navigator.serviceWorker.register('/sw.js'))
   ↓
4. Service worker installs (install event)
   ↓
5. Pre-cache critical static assets
   ↓
6. Service worker activates (activate event)
   ↓
7. Clean up old caches
   ↓
8. Service worker ready (controlling pages)
   ↓
9. Fetch events intercepted by service worker
```

#### Offline Caching Flow

```
User Request → Service Worker Intercepts
   ↓
Check Cache Strategy:
   ├─ Static Asset → Cache-First
   │   ├─ Cache Hit → Return cached asset
   │   └─ Cache Miss → Fetch from network → Cache → Return
   │
   ├─ API Call → Network-First
   │   ├─ Network Success → Return response → Cache (optional)
   │   └─ Network Failure → Return cached response (if available) or error
   │
   └─ Route/Page → Network-First with Fallback
       ├─ Network Success → Return page → Cache
       └─ Network Failure → Return offline fallback page
```

#### Analytics Buffering and Sync Flow

```
Event Occurs (page_view, cta_click, etc.)
   ↓
Create AnalyticsEvent object
   ↓
Store in localStorage/IndexedDB buffer
   ↓
Check Network Status
   ├─ Online → Attempt Immediate Sync
   │   ├─ Success → Remove synced events from buffer
   │   └─ Failure → Keep in buffer, retry later
   │
   └─ Offline → Keep in buffer
       ↓
       (Later) Network Available → Auto-sync buffer
           ├─ Success → Clear buffer
           └─ Failure → Keep in buffer, retry on next event
```

#### Staff Reset Flow

```
Reset Trigger (Keyboard Combo OR URL Param)
   ↓
Show Confirmation Dialog
   ├─ User Cancels → Abort reset
   └─ User Confirms → Proceed
       ↓
       Clear Cart Storage (localStorage.removeItem('makelocal_cart'))
       ↓
       Clear Leads Storage (localStorage.removeItem('makelocal_leads'))
       ↓
       Clear Personalization Storage (localStorage.removeItem('makelocal_personalization'))
       ↓
       (Note: Analytics and Cache are NOT cleared)
       ↓
       Show Success Message
       ↓
       (Optional) Reload page or redirect
```

#### Cache Update Flow

```
New Deployment/Build
   ↓
Cache Version Incremented (in sw.js)
   ↓
Service Worker Detects New Version
   ↓
New Service Worker Installs (parallel to old)
   ↓
Old Service Worker Still Controls Pages
   ↓
New Service Worker Waits (skipWaiting() not called)
   ↓
User Closes All Tabs/Refreshes
   ↓
New Service Worker Activates
   ↓
Old Caches Deleted (cleanup in activate event)
   ↓
New Caches Populated
   ↓
Pages Now Served from New Cache
```

## Non-Functional Requirements

### Performance

**Target Metrics (per PRD Section 9):**
- **Largest Contentful Paint (LCP)**: < 2.5 seconds on booth hardware with throttled 3G connection
- **JavaScript Bundle Size**: < 200KB gzipped for initial route
- **Time to Interactive (TTI)**: < 3.5 seconds on throttled 3G
- **First Contentful Paint (FCP)**: < 1.8 seconds

**Implementation Strategies:**

1. **Bundle Optimization**
   - Code splitting via Next.js dynamic imports for non-critical components
   - Tree shaking to eliminate unused code
   - Bundle analysis using `@next/bundle-analyzer` to identify large dependencies
   - Lazy loading for routes and components not needed on initial load

2. **Image Optimization**
   - Use Next.js Image component with WebP format support
   - Responsive image sizes (srcset) for different viewport widths
   - Lazy loading for below-the-fold images
   - Placeholder/blur-up for progressive image loading

3. **Critical CSS**
   - Inline critical CSS in `<head>` for above-the-fold content
   - Defer non-critical CSS loading
   - Tailwind CSS 4 purging of unused styles
   - CSS minification and compression

4. **Font Optimization**
   - Preload critical font files with `<link rel="preload">`
   - Font subsetting to include only required characters
   - Use `font-display: swap` to prevent render-blocking
   - Self-host fonts to avoid external DNS lookups

5. **Service Worker Caching**
   - Pre-cache critical static assets on install
   - Cache-first strategy for static assets reduces network latency
   - Cache versioning ensures fresh content after deployments

6. **Performance Monitoring**
   - Real User Monitoring (RUM) via Performance API
   - Track LCP, FCP, TTI metrics in analytics
   - Lighthouse CI integration for continuous performance testing
   - WebPageTest for throttled 3G simulation

**Performance Testing:**
- Test on actual booth hardware (if available) or simulate with Chrome DevTools throttling
- Measure bundle size in CI/CD pipeline (fail build if > 200KB gzipped)
- Lighthouse audits on every deployment
- Monitor Core Web Vitals in production

### Security

**Security Requirements (per PRD Section 9):**

1. **Data Protection**
   - Lead exports behind password protection or physical access control
   - No sensitive data stored beyond event needs
   - GDPR-compliant data handling (disclosure in footer if required)
   - Local storage encryption not required (no sensitive PII beyond name/email)

2. **Service Worker Security**
   - Service worker served over HTTPS (required for PWA)
   - Content Security Policy (CSP) headers to prevent XSS
   - Service worker scope limited to application domain
   - Cache validation to prevent cache poisoning

3. **Analytics Privacy**
   - No third-party trackers (per PRD Section 10)
   - Client-side event buffering (no immediate external transmission)
   - GDPR disclosure in footer if required
   - Session-based tracking (no persistent user identifiers)

4. **Reset Controls Security**
   - Reset confirmation dialog prevents accidental data loss
   - Reset does not expose sensitive data in URL parameters
   - Keyboard combo requires explicit user action (not auto-triggered)
   - Consider password protection for production reset controls

5. **Storage Security**
   - localStorage data is domain-scoped (same-origin policy)
   - No sensitive authentication tokens stored
   - Session data cleared on browser close (if using sessionStorage)
   - Cache data is public (static assets only, no sensitive content)

**Security Testing:**
- CSP header validation
- XSS vulnerability scanning
- localStorage data inspection (ensure no sensitive data)
- Service worker scope validation
- HTTPS enforcement checks

### Reliability/Availability

**Availability Requirements:**

1. **Offline-First Architecture**
   - Service worker enables full functionality after initial load, even when offline
   - Critical routes cached: landing page, catalog, product detail, cart, checkout
   - Offline fallback page for uncached routes
   - Works on throttled 3G connection (per PRD performance requirements)

2. **Error Handling and Resilience**
   - Graceful degradation when network unavailable
   - Clear error messaging for users when offline
   - Retry logic for analytics sync (exponential backoff)
   - Service worker update failures don't break existing functionality

3. **Cache Reliability**
   - Cache versioning prevents stale content issues
   - Automatic cache cleanup on service worker updates
   - Cache size limits prevent storage quota exhaustion
   - Fallback to network if cache corrupted or unavailable

4. **Data Persistence**
   - localStorage persistence survives page refreshes
   - Analytics events buffered locally (not lost on network failure)
   - Cart and personalization data persists across sessions
   - Staff reset controls allow quick recovery from corrupted state

5. **Service Worker Lifecycle**
   - Service worker registration failures don't break app
   - Old service worker continues serving until new one activates
   - Graceful handling of service worker update conflicts
   - Skip waiting strategy prevents stale service worker issues

**Reliability Testing:**
- Offline mode testing (Chrome DevTools offline simulation)
- Network throttling tests (3G, slow 3G, offline)
- Service worker update scenarios
- Cache corruption recovery testing
- Storage quota exhaustion scenarios

### Observability

**Logging Requirements:**

1. **Analytics Event Tracking**
   - Track page views with path and timestamp
   - Track CTA clicks (button/link identifiers, context)
   - Track checkout starts (cart contents, user actions)
   - Track lead submissions (form type, success/failure)
   - Track PWA install prompts (shown, dismissed, completed)

2. **Performance Metrics**
   - LCP, FCP, TTI measurements
   - Bundle size tracking
   - Cache hit/miss ratios
   - Service worker registration success/failure

3. **Error Tracking**
   - Service worker registration errors
   - Cache operation failures
   - Analytics sync failures
   - Storage quota exceeded errors

4. **User Flow Analytics**
   - Flow drop-off points (catalog → detail → cart → checkout)
   - Session duration and engagement metrics
   - Offline vs online usage patterns
   - Reset control usage (staff actions)

**Metrics and Monitoring:**

1. **Client-Side Metrics**
   - Event schema: `{ event, timestamp, properties, sessionId }`
   - Buffered locally when offline, synced when online
   - Simple dashboard or log view for booth staff review
   - CSV export capability for analysis

2. **Performance Monitoring**
   - Real User Monitoring via Performance API
   - Core Web Vitals tracking (LCP, FID, CLS)
   - Bundle size monitoring in CI/CD
   - Lighthouse scores tracked over time

3. **Service Worker Monitoring**
   - Service worker registration status
   - Cache version and size tracking
   - Update frequency and success rate
   - Cache hit/miss statistics

4. **Storage Monitoring**
   - localStorage usage tracking
   - Cache size monitoring
   - Storage quota warnings
   - Analytics buffer size tracking

**Observability Implementation:**

- **Analytics Module** (`src/lib/analytics.ts`): Centralized event tracking with offline buffering
- **Performance Monitor** (`src/lib/performance.ts`): Performance API integration and metric collection
- **Simple Dashboard**: Admin route or log view displaying aggregated metrics
- **CSV Export**: Lead and analytics data export for external analysis

**Privacy Considerations:**
- No third-party analytics services (per PRD Section 10)
- GDPR disclosure in footer if required
- Session-based tracking (no persistent user identifiers)
- Data retention policy: Clear data after event (via staff reset)

## Dependencies and Integrations

### Runtime Dependencies

**Core Framework (from package.json):**
- **Next.js 16.0.1**: React framework with App Router, static export support, and built-in optimizations
- **React 19.2.0**: UI library with React Compiler support
- **React DOM 19.2.0**: React rendering for web browsers
- **TypeScript ^5**: Type safety and developer experience

**Styling:**
- **Tailwind CSS ^4**: Utility-first CSS framework for responsive design
- **@tailwindcss/postcss ^4**: PostCSS plugin for Tailwind CSS processing

**Development Tools:**
- **@biomejs/biome 2.2.0**: Linting and formatting (replaces ESLint/Prettier)
- **babel-plugin-react-compiler 1.0.0**: React Compiler plugin for performance optimizations
- **@types/node ^20**: TypeScript definitions for Node.js
- **@types/react ^19**: TypeScript definitions for React
- **@types/react-dom ^19**: TypeScript definitions for React DOM

### Browser APIs and Standards

**Progressive Web App APIs:**
- **Service Worker API**: Offline caching and background sync (native browser API)
- **Cache API**: Storage for cached network responses (native browser API)
- **Web App Manifest**: PWA metadata and installability (native browser API)
- **IndexedDB API**: Optional storage for large analytics buffers (native browser API, fallback to localStorage)

**Storage APIs:**
- **localStorage API**: Client-side storage for cart, leads, personalization, analytics buffer (native browser API)
- **sessionStorage API**: Optional session-scoped storage (native browser API)

**Performance APIs:**
- **Performance API**: Real User Monitoring and Core Web Vitals tracking (native browser API)
- **Resource Timing API**: Network performance measurement (native browser API)
- **Navigation Timing API**: Page load performance measurement (native browser API)

### External Integrations (Future - Not in Epic 1)

**MakeLocal Platform APIs (Epic 4):**
- **orderDraft Endpoint**: Create draft orders before redirecting to MakeLocal platform
  - Documentation: `docs/makelocal-api/orderDraft.md`
  - Integration deferred to Epic 4 (Cart & Checkout Flow)
  
- **Anonymous Auth Stub**: Optional authentication for lead capture endpoints
  - Documentation: `docs/makelocal-api/anonymousAuth.md`
  - Integration deferred to Epic 4 (if required)

**Analytics Sync Endpoint (Future):**
- **Analytics Webhook/Endpoint**: Sync buffered analytics events to server
  - Endpoint TBD (not yet defined)
  - Epic 1 implements offline buffering; sync endpoint integration deferred

### Build-Time Dependencies

**Next.js Build System:**
- Next.js handles bundling, code splitting, and optimization
- Static export support for deployment to static hosting
- Image optimization via Next.js Image component

**TypeScript Compilation:**
- TypeScript compiler for type checking and transpilation
- Strict mode enabled for type safety

**CSS Processing:**
- PostCSS for Tailwind CSS processing
- CSS minification and optimization handled by Next.js

### Version Constraints

**Critical Version Requirements:**
- **Next.js 16.0.1**: Required for React 19 support and App Router features
- **React 19.2.0**: Required for React Compiler compatibility
- **TypeScript ^5**: Required for latest type features and React 19 types

**Compatibility Notes:**
- React 19 requires compatible type definitions (@types/react ^19)
- Tailwind CSS 4 requires @tailwindcss/postcss ^4
- Next.js 16 requires Node.js 18.17+ (not explicitly in package.json but required by Next.js)

### Integration Points Established in Epic 1

**Storage Integration Points:**
- Centralized storage utilities (`src/lib/storage.ts`) establish patterns for:
  - Cart storage (used by Epic 4)
  - Lead storage (used by Epic 4)
  - Personalization storage (used by Epic 3)
  - Analytics buffering (used throughout)

**Service Worker Integration Points:**
- Service worker registration pattern establishes foundation for:
  - Route caching (extended in Epic 2)
  - Offline fallback pages (used by Epic 2-5)
  - Cache versioning (maintained across all epics)

**Analytics Integration Points:**
- Analytics module (`src/lib/analytics.ts`) establishes patterns for:
  - Event tracking (used by all epics)
  - Offline buffering (used by all epics)
  - Future sync endpoint integration (Epic 4+)

### Deployment Dependencies

**Hosting Requirements:**
- Static hosting support (Vercel, Netlify, Fly.io, or similar)
- HTTPS required for PWA functionality (service workers require secure context)
- Node.js 18.17+ runtime for build process (not required for static export)

**Environment Variables (Future):**
- Analytics sync endpoint URL (if implemented)
- MakeLocal API base URL (Epic 4)
- Optional: API keys or authentication tokens (Epic 4)

### No External Service Dependencies (Epic 1)

Epic 1 is intentionally dependency-free for external services to ensure:
- Offline-first functionality
- No single point of failure
- Event resilience (works without network)
- Fast initial load (no external API calls)

All external integrations are deferred to Epic 4 (Cart & Checkout Flow) where they are required for order draft creation.

## Acceptance Criteria (Authoritative)

### Story 1.1: Create PWA Manifest and Service Worker Foundation

1. `manifest.json` file exists with required fields (name, short_name, icons, start_url, display mode)
2. Service worker file created with basic registration logic
3. Service worker registers successfully on page load
4. Add to Home Screen prompt appears on mobile devices after engagement
5. Icons provided in multiple sizes (192x192, 512x512 minimum)
6. Theme color matches MakeLocal brand colors

### Story 1.2: Implement Offline Caching Strategy

7. Service worker caches critical HTML, CSS, JS, and image assets on first visit
8. Cached routes include: landing page, catalog, product detail, cart, checkout
9. Offline fallback page displays when network unavailable and route not cached
10. Cache versioning implemented to force updates when content changes
11. Cache size limits prevent excessive storage usage
12. Works on throttled 3G connection (per PRD performance requirements)

### Story 1.3: Add Analytics Instrumentation (Offline-First)

13. Analytics events tracked for: page views, CTA clicks, checkout starts, lead submissions
14. Events buffered locally when offline, synced when network available
15. No third-party trackers (privacy-compliant, per PRD)
16. Simple dashboard or log view for booth staff to review metrics
17. GDPR disclosure in footer if required
18. Events include: "Continue on MakeLocal" clicks, Add to Home Screen prompts

### Story 1.4: Create Staff Reset Controls

19. Keyboard combo (e.g., Ctrl+Shift+R or Cmd+Shift+R) clears cart and lead data
20. URL parameter (e.g., `?reset=true`) also triggers reset
21. Reset clears: localStorage cart, lead submissions, any session state
22. Reset confirmation dialog prevents accidental clears
23. Reset time < 15 seconds (per PRD requirement)
24. Reset does not clear analytics or PWA cache

### Story 1.5: Implement Performance Optimization

25. Largest Contentful Paint (LCP) < 2.5s on booth hardware with throttled 3G
26. Total JS payload < 200KB gzipped for initial route
27. Images optimized (WebP format, lazy loading, responsive sizes)
28. CSS critical path inlined or loaded with high priority
29. Fonts preloaded or subsetted to reduce load time
30. No render-blocking resources

## Traceability Mapping

| AC # | Acceptance Criteria | Spec Section(s) | Component(s)/API(s) | Test Idea |
|------|---------------------|-----------------|---------------------|-----------|
| 1 | `manifest.json` exists with required fields | Services and Modules, APIs and Interfaces | `public/manifest.json` | Verify manifest.json exists, contains name, short_name, icons, start_url, display |
| 2 | Service worker file created with registration logic | Services and Modules, APIs and Interfaces | `public/sw.js`, Service Worker Registration | Verify sw.js exists, contains install/activate event handlers |
| 3 | Service worker registers on page load | Workflows and Sequencing | Service Worker Registration (`src/app/layout.tsx`) | Test service worker registration promise resolves, check navigator.serviceWorker.controller |
| 4 | Add to Home Screen prompt appears | Services and Modules | PWA Manifest, `beforeinstallprompt` event | Test on mobile device, verify install prompt appears after engagement |
| 5 | Icons in multiple sizes (192x192, 512x512) | Services and Modules | `public/manifest.json` icons array | Verify manifest icons array contains 192x192 and 512x512 entries |
| 6 | Theme color matches brand | Services and Modules | `public/manifest.json` theme_color | Verify theme_color matches MakeLocal brand colors from STYLEGUIDE.md |
| 7 | Service worker caches critical assets | Workflows and Sequencing, APIs and Interfaces | Service Worker (`public/sw.js`), Cache API | Test install event pre-caches assets, verify cache contains HTML/CSS/JS/images |
| 8 | Cached routes include landing, catalog, detail, cart, checkout | Workflows and Sequencing | Service Worker Cache Manager | Test cache contains routes: /, /catalog, /product/[id], /cart, /checkout |
| 9 | Offline fallback page displays | Workflows and Sequencing | Service Worker Fetch Handler | Test offline mode, navigate to uncached route, verify fallback page shown |
| 10 | Cache versioning implemented | APIs and Interfaces, Workflows and Sequencing | Cache Manager, Cache Version Schema | Test cache version increments on deploy, old caches deleted on activate |
| 11 | Cache size limits prevent excessive storage | APIs and Interfaces | Cache Manager | Test cache size monitoring, verify cleanup when limits exceeded |
| 12 | Works on throttled 3G | Performance, Reliability/Availability | Service Worker, Performance Monitor | Test with Chrome DevTools throttling (3G), verify functionality maintained |
| 13 | Analytics events tracked (page views, CTA clicks, etc.) | Observability, APIs and Interfaces | Analytics Module (`src/lib/analytics.ts`) | Test track() method logs events with correct schema, verify event types |
| 14 | Events buffered offline, synced online | Workflows and Sequencing, APIs and Interfaces | Analytics Storage, Analytics API | Test offline event buffering, verify sync on network reconnect |
| 15 | No third-party trackers | Security, Observability | Analytics Module | Verify no external analytics scripts loaded, check network tab |
| 16 | Simple dashboard/log view for metrics | Observability | Analytics Dashboard (admin route) | Test dashboard displays buffered events, verify CSV export works |
| 17 | GDPR disclosure in footer | Security, Observability | Footer component | Verify GDPR disclosure text present if required |
| 18 | Events include "Continue on MakeLocal" and install prompts | Observability | Analytics Module | Test tracking of specific events: install_prompt_shown, install_prompt_completed |
| 19 | Keyboard combo clears data | Workflows and Sequencing, APIs and Interfaces | Reset Utility (`src/lib/reset.ts`) | Test Ctrl+Shift+R (Windows) and Cmd+Shift+R (Mac) triggers reset |
| 20 | URL parameter triggers reset | Workflows and Sequencing, APIs and Interfaces | Reset Utility | Test ?reset=true URL param triggers reset confirmation |
| 21 | Reset clears localStorage cart, leads, session state | Workflows and Sequencing | Reset Utility, Storage API | Test reset clears makelocal_cart, makelocal_leads, verify session cleared |
| 22 | Reset confirmation dialog | Workflows and Sequencing | Reset Utility | Test confirmation dialog appears, verify cancel aborts reset |
| 23 | Reset time < 15 seconds | Performance, Workflows and Sequencing | Reset Utility | Measure reset execution time, verify < 15 seconds |
| 24 | Reset does not clear analytics or cache | Workflows and Sequencing | Reset Utility | Test reset preserves analytics buffer and service worker cache |
| 25 | LCP < 2.5s on throttled 3G | Performance | Performance Monitor, Service Worker | Test LCP measurement on throttled 3G, verify < 2.5s |
| 26 | JS payload < 200KB gzipped | Performance | Build system, Bundle analyzer | Test bundle size in CI/CD, verify initial route JS < 200KB gzipped |
| 27 | Images optimized (WebP, lazy loading) | Performance | Next.js Image component | Test image format (WebP), verify lazy loading attributes, responsive sizes |
| 28 | Critical CSS inlined/loaded with priority | Performance | Build system, CSS processing | Test critical CSS in <head>, verify non-critical CSS deferred |
| 29 | Fonts preloaded or subsetted | Performance | Font loading, `<link rel="preload">` | Test font preload tags present, verify font-display: swap |
| 30 | No render-blocking resources | Performance | Build system, Performance Monitor | Test render-blocking resources audit, verify none present |

## Risks, Assumptions, Open Questions

### Risks

**Risk 1: Service Worker Update Failures**
- **Description**: Service worker updates may fail silently, leaving users with stale cached content
- **Impact**: Medium - Users may see outdated content, but app remains functional
- **Mitigation**: Implement cache versioning, test update scenarios, monitor service worker registration errors
- **Owner**: Frontend Team

**Risk 2: Bundle Size Exceeds 200KB Target**
- **Description**: Initial JS bundle may exceed 200KB gzipped limit due to dependencies or code growth
- **Impact**: High - Violates PRD performance requirement, affects LCP target
- **Mitigation**: Bundle analysis in CI/CD, code splitting, dynamic imports, monitor bundle size on every PR
- **Owner**: Frontend Team

**Risk 3: Storage Quota Exhaustion**
- **Description**: localStorage or cache storage may exceed browser quotas on devices with limited storage
- **Impact**: Medium - Analytics events may be lost, cache may fail to update
- **Mitigation**: Implement cache size limits, monitor storage usage, implement cleanup strategies
- **Owner**: Frontend Team

**Risk 4: iOS Safari PWA Limitations**
- **Description**: iOS Safari has limited PWA support compared to Android Chrome (no beforeinstallprompt event)
- **Impact**: Low - Add to Home Screen still works via manual instructions
- **Mitigation**: Provide manual installation instructions for iOS, test on iOS devices
- **Owner**: Frontend Team

**Risk 5: Analytics Sync Endpoint Not Available**
- **Description**: Analytics sync endpoint may not be implemented by Epic 1 completion
- **Impact**: Low - Events are buffered locally, sync can be added later
- **Mitigation**: Design analytics API to support future sync endpoint, buffer events indefinitely
- **Owner**: Product/Engineering

### Assumptions

**Assumption 1: Browser Support**
- Modern browsers support service workers (Chrome, Firefox, Safari, Edge)
- **Validation**: Test on target browsers, provide graceful degradation for unsupported browsers

**Assumption 2: HTTPS Required**
- Production deployment will use HTTPS (required for service workers)
- **Validation**: Verify HTTPS configuration in deployment pipeline

**Assumption 3: Storage Availability**
- Browsers have sufficient localStorage and cache storage quota
- **Validation**: Monitor storage usage, implement cleanup if needed

**Assumption 4: Network Conditions**
- Initial load will have network connectivity (for caching)
- **Validation**: Test offline-first scenarios, verify graceful degradation

**Assumption 5: Analytics Privacy**
- No GDPR consent required for basic analytics (session-based, no PII)
- **Validation**: Legal review if required, add disclosure if needed

### Open Questions

**Question 1: Analytics Sync Endpoint**
- **Question**: What is the analytics sync endpoint URL and authentication method?
- **Status**: Deferred - Not required for Epic 1, events buffered locally
- **Owner**: Product/Engineering
- **Resolution Target**: Epic 4 or later

**Question 2: Cache Update Strategy**
- **Question**: Should service worker use skipWaiting() for immediate updates or wait for user refresh?
- **Status**: Open - Current design waits for user refresh (safer)
- **Owner**: Frontend Team
- **Resolution Target**: Before Epic 2 (route caching)

**Question 3: Analytics Dashboard Location**
- **Question**: Should analytics dashboard be a protected admin route or separate page?
- **Status**: Open - Current design suggests admin route
- **Owner**: Frontend Team
- **Resolution Target**: Story 1.3 implementation

**Question 4: Reset Password Protection**
- **Question**: Should reset controls require password protection in production?
- **Status**: Open - Current design has confirmation dialog only
- **Owner**: Frontend Team
- **Resolution Target**: Before production deployment

**Question 5: IndexedDB vs localStorage for Analytics**
- **Question**: Should large analytics buffers use IndexedDB instead of localStorage?
- **Status**: Open - Current design uses localStorage with IndexedDB fallback option
- **Owner**: Frontend Team
- **Resolution Target**: Story 1.3 implementation (if localStorage quota exceeded)

## Test Strategy Summary

### Test Levels

**Unit Tests:**
- **Scope**: Individual modules and utilities
- **Components**: Analytics module, Reset utility, Storage utilities, Performance monitor
- **Framework**: Jest or Vitest (TBD)
- **Coverage Target**: 80%+ for utility functions

**Integration Tests:**
- **Scope**: Service worker lifecycle, cache operations, analytics buffering
- **Components**: Service worker registration, cache versioning, analytics sync
- **Framework**: Playwright or Puppeteer for service worker testing
- **Coverage Target**: Critical paths (service worker install/activate, cache updates)

**End-to-End Tests:**
- **Scope**: User flows, offline scenarios, performance metrics
- **Scenarios**: 
  - PWA installation flow
  - Offline browsing after initial load
  - Staff reset controls
  - Analytics event tracking
- **Framework**: Playwright or Cypress
- **Coverage Target**: Critical user journeys

**Performance Tests:**
- **Scope**: Bundle size, LCP, TTI, cache performance
- **Tools**: Lighthouse CI, WebPageTest, Chrome DevTools
- **Targets**: 
  - LCP < 2.5s on throttled 3G
  - JS bundle < 200KB gzipped
  - Cache hit rate > 80% for static assets
- **Frequency**: Every deployment, fail build if targets not met

**Accessibility Tests:**
- **Scope**: PWA install prompts, reset controls, analytics dashboard
- **Tools**: axe-core, Lighthouse accessibility audit, manual keyboard testing
- **Target**: WCAG 2.1 AA compliance
- **Frequency**: Before Epic 1 completion

### Test Scenarios

**Service Worker Tests:**
1. Service worker registers successfully on page load
2. Service worker installs and pre-caches critical assets
3. Service worker activates and cleans up old caches
4. Service worker intercepts fetch requests and serves from cache
5. Service worker updates correctly when new version deployed
6. Offline fallback page displays for uncached routes

**Analytics Tests:**
1. Analytics events tracked with correct schema
2. Events buffered in localStorage when offline
3. Events sync when network available (if endpoint implemented)
4. Analytics dashboard displays buffered events
5. CSV export generates correct format
6. No third-party trackers loaded

**Reset Controls Tests:**
1. Keyboard combo (Ctrl+Shift+R / Cmd+Shift+R) triggers reset
2. URL parameter (?reset=true) triggers reset
3. Reset confirmation dialog appears and prevents accidental clears
4. Reset clears cart, leads, personalization data
5. Reset does NOT clear analytics or cache
6. Reset completes in < 15 seconds

**Performance Tests:**
1. LCP < 2.5s on throttled 3G connection
2. JS bundle < 200KB gzipped for initial route
3. Images optimized (WebP format, lazy loading)
4. Critical CSS inlined in <head>
5. Fonts preloaded with font-display: swap
6. No render-blocking resources

**PWA Tests:**
1. manifest.json exists with required fields
2. Icons provided in 192x192 and 512x512 sizes
3. Theme color matches brand colors
4. Add to Home Screen prompt appears (Android Chrome)
5. Manual installation instructions work (iOS Safari)
6. PWA installs and launches correctly

### Test Data and Fixtures

**Cache Test Data:**
- Mock HTML, CSS, JS files for cache testing
- Cache version fixtures for versioning tests
- Cache size test data for quota testing

**Analytics Test Data:**
- Sample analytics events for schema validation
- Large event buffers for storage quota testing
- Mock sync endpoint responses

**Performance Test Data:**
- Throttled 3G network profiles
- Booth hardware simulation (if available)
- Bundle size baselines

### Test Environment Requirements

**Development:**
- Local development server (Next.js dev)
- Chrome DevTools for service worker debugging
- Network throttling for performance testing

**Staging:**
- Production-like environment with HTTPS
- Real device testing (iOS and Android)
- Performance monitoring tools

**CI/CD:**
- Automated bundle size checks
- Lighthouse CI integration
- Service worker registration tests
- TypeScript type checking

### Test Execution Strategy

**Pre-Commit:**
- TypeScript type checking
- Linting (Biome)
- Unit tests for utilities

**Pull Request:**
- Full unit test suite
- Integration tests for service worker
- Bundle size validation
- Lighthouse performance audit

**Pre-Deployment:**
- Full test suite (unit, integration, E2E)
- Performance tests on staging
- Accessibility audit
- Cross-browser testing (Chrome, Firefox, Safari, Edge)

**Post-Deployment:**
- Smoke tests on production
- Performance monitoring (RUM)
- Error tracking and monitoring

