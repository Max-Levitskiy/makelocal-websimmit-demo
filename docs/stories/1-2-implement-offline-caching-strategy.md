# Story 1.2: Implement Offline Caching Strategy

Status: ready-for-dev

## Story

As a visitor at Web Summit,
I want the microsite to work offline after initial load,
so that I can use it even when conference Wi-Fi is unreliable.

## Acceptance Criteria

1. Service worker caches critical HTML, CSS, JS, and image assets on first visit
2. Cached routes include: landing page, catalog, product detail, cart, checkout
3. Offline fallback page displays when network unavailable and route not cached
4. Cache versioning implemented to force updates when content changes
5. Cache size limits prevent excessive storage usage
6. Works on throttled 3G connection (per PRD performance requirements)

## Tasks / Subtasks

- [ ] Task 1: Implement cache-first strategy for static assets (AC: #1)
  - [ ] Update service worker fetch handler to check cache first for static assets (CSS, JS, images, fonts)
  - [ ] If cache hit, return cached response immediately
  - [ ] If cache miss, fetch from network, cache response, then return
  - [ ] Identify static assets by URL patterns (e.g., `/static/`, `/icons/`, `.css`, `.js`, `.png`, `.jpg`, `.webp`, `.svg`)
  - [ ] Test cache-first behavior in Chrome DevTools Network tab
- [ ] Task 2: Implement network-first strategy for API calls (AC: #1)
  - [ ] Update service worker fetch handler to use network-first for API endpoints
  - [ ] If network succeeds, cache response (optional) and return
  - [ ] If network fails, return cached response if available, otherwise return error
  - [ ] Identify API calls by URL patterns (e.g., `/api/`, `makelocal.eu/api/`)
  - [ ] Test network-first behavior with offline simulation
- [ ] Task 3: Pre-cache critical assets on service worker install (AC: #1)
  - [ ] Define list of critical assets to pre-cache (HTML, CSS, JS, images)
  - [ ] Update install event handler to cache critical assets using `cache.addAll()`
  - [ ] Include root HTML (`/`), critical CSS, JS bundles, and essential images
  - [ ] Handle cache failures gracefully (log errors, continue installation)
  - [ ] Verify pre-caching works in Chrome DevTools Application tab
- [ ] Task 4: Cache routes (landing, catalog, product detail, cart, checkout) (AC: #2)
  - [ ] Implement route caching strategy (network-first with fallback)
  - [ ] Cache routes: `/` (landing), `/catalog`, `/product/[id]`, `/cart`, `/checkout`
  - [ ] Cache route HTML responses on first successful network fetch
  - [ ] Serve cached routes when network unavailable
  - [ ] Test route caching with offline mode and navigation
- [ ] Task 5: Create offline fallback page (AC: #3)
  - [ ] Create offline fallback HTML page (`public/offline.html` or similar)
  - [ ] Design fallback page with clear messaging: "You're offline" and "Check your connection"
  - [ ] Pre-cache offline fallback page in service worker install event
  - [ ] Update fetch handler to return offline fallback when network fails and route not cached
  - [ ] Test offline fallback displays correctly for uncached routes
- [ ] Task 6: Implement cache versioning system (AC: #4)
  - [ ] Update `CACHE_VERSION` constant in `public/sw.js` (currently `v1.0.0`)
  - [ ] Ensure cache names include version (already implemented: `makelocal-cache-${CACHE_VERSION}`)
  - [ ] Update activate event handler to delete old caches (already implemented, verify)
  - [ ] Document cache version increment process for future deployments
  - [ ] Test cache versioning: deploy with new version, verify old caches deleted
- [ ] Task 7: Implement cache size limits (AC: #5)
  - [ ] Add cache size monitoring utility in service worker
  - [ ] Define maximum cache size limit (e.g., 50MB or configurable)
  - [ ] Implement cache cleanup when size limit exceeded (delete oldest entries first)
  - [ ] Add cache size logging for debugging
  - [ ] Test cache size limits with large asset sets
- [ ] Task 8: Fix fetch handler error handling (from Story 1.1 review) (AC: #1, #3)
  - [ ] Update fetch handler to return proper Response object on network failure
  - [ ] Return offline fallback Response or cached response instead of undefined
  - [ ] Ensure `event.respondWith()` always receives a Response promise
  - [ ] Test error handling with network failures and offline scenarios
- [ ] Task 9: Testing and validation (AC: #1, #2, #3, #4, #5, #6)
  - [ ] Test offline mode: Load site, go offline, verify cached routes work
  - [ ] Test cache-first: Verify static assets served from cache
  - [ ] Test network-first: Verify API calls attempt network first
  - [ ] Test offline fallback: Navigate to uncached route offline, verify fallback page
  - [ ] Test cache versioning: Deploy new version, verify old caches deleted
  - [ ] Test cache size limits: Load large assets, verify cleanup when limit exceeded
  - [ ] Test throttled 3G: Use Chrome DevTools throttling, verify functionality maintained
  - [ ] Verify cache contents in Chrome DevTools Application tab

## Dev Notes

### Architecture Patterns and Constraints

- **Service Worker Scope**: Service worker at `public/sw.js` controls all routes. Cache strategies must handle all request types (static assets, routes, API calls).
- **Cache API**: Use native Cache API (`caches.open()`, `cache.add()`, `cache.addAll()`, `cache.match()`) for all caching operations.
- **Cache Strategy Patterns**:
  - **Cache-First**: For static assets (CSS, JS, images, fonts) - fastest performance, works offline
  - **Network-First**: For API calls and routes - ensures fresh data when online, falls back to cache when offline
  - **Network-First with Fallback**: For routes - attempts network, falls back to cache, then offline page
- **Next.js 16 App Router**: Routes are server-rendered by default. Cache route HTML responses from network fetches. Static assets are served from `public/` or Next.js build output.
- **React 19.2.0 Compatibility**: Service worker code uses standard Web APIs, no React-specific code required.
- **TypeScript**: Service worker file (`sw.js`) can remain JavaScript, but ensure type safety in registration utilities.

### Project Structure Notes

- **Service Worker Location**: `public/sw.js` - Must remain at root scope for full app control
- **Offline Fallback Page**: `public/offline.html` - Served when network unavailable and route not cached
- **Cache Version**: `CACHE_VERSION` constant in `public/sw.js` - Increment on deployments to invalidate old caches
- **Cache Names**: Use versioned cache names (`makelocal-cache-${CACHE_VERSION}`) for automatic cleanup
- **Alignment**: Follows Next.js 16 App Router conventions and Epic 1 technical specifications. No conflicts with unified project structure expected.

### Learnings from Previous Story

**From Story 1.1 (Status: review)**

- **Service Worker Foundation**: Service worker registration and basic lifecycle already implemented in `public/sw.js`
- **Cache Version Constant**: `CACHE_VERSION = 'v1.0.0'` and `CACHE_NAME` already defined - ready for extension
- **Install/Activate Handlers**: Install and activate event handlers already implemented with cache cleanup logic
- **Fetch Handler Status**: Current fetch handler is minimal (network-first only, no caching) - needs full implementation for Story 1.2
- **Pending Action Item**: Fetch handler error handling needs improvement (returns undefined on network failure) - address in Task 8
- **Files Created**: 
  - `public/sw.js` - Service worker with basic lifecycle (extend for caching)
  - `src/lib/register-sw.ts` - Registration utility (reuse as-is)
  - `src/components/ServiceWorkerRegistration.tsx` - React integration (reuse as-is)
- **Files Modified**: 
  - `src/app/layout.tsx` - Service worker registration integrated (no changes needed)
- **Architectural Decisions**: 
  - Service worker uses `skipWaiting()` and `clients.claim()` for immediate activation (maintain this pattern)
  - Cache versioning pattern established (extend for Story 1.2 requirements)
- **Technical Debt**: None identified - Story 1.1 foundation is solid
- **Warnings for Next Story**: 
  - iOS Safari manual installation instructions documented (not relevant for Story 1.2)
  - Fetch handler error handling needs improvement (address in Task 8)

[Source: stories/1-1-create-pwa-manifest-and-service-worker-foundation.md#Dev-Agent-Record]

### Cache Strategy Implementation Details

**Static Assets (Cache-First)**:
- Match by URL patterns: `/static/`, `/icons/`, `/images/`, file extensions (`.css`, `.js`, `.png`, `.jpg`, `.webp`, `.svg`, `.woff`, `.woff2`)
- Check cache first, return immediately if found
- If not in cache, fetch from network, cache response, return
- Benefits: Fast loading, works offline, reduces network requests

**API Calls (Network-First)**:
- Match by URL patterns: `/api/`, `makelocal.eu/api/`, or specific API endpoints
- Attempt network first, cache successful responses (optional)
- If network fails, return cached response if available
- Benefits: Fresh data when online, fallback when offline

**Routes (Network-First with Fallback)**:
- Match by route patterns: `/`, `/catalog`, `/product/`, `/cart`, `/checkout`
- Attempt network first, cache successful HTML responses
- If network fails, return cached route if available
- If no cached route, return offline fallback page
- Benefits: Fresh content when online, cached content when offline, graceful degradation

**Cache Size Limits**:
- Monitor total cache size across all cache stores
- Define maximum size (e.g., 50MB) - configurable constant
- When limit exceeded, delete oldest cache entries first (FIFO)
- Log cache size for debugging and monitoring

### References

- [Source: docs/tech-spec-epic-1.md#Services-and-Modules] - Service Worker module responsibilities and cache management patterns
- [Source: docs/tech-spec-epic-1.md#APIs-and-Interfaces] - Service Worker API patterns, cache-first and network-first strategies
- [Source: docs/tech-spec-epic-1.md#Workflows-and-Sequencing] - Offline Caching Flow (cache-first, network-first, fallback patterns)
- [Source: docs/tech-spec-epic-1.md#Acceptance-Criteria] - Story 1.2 acceptance criteria (ACs 7-12)
- [Source: docs/epics.md#Story-1.2] - Story 1.2 user story, acceptance criteria, and technical notes
- [Source: docs/prd.md#7.9] - PRD requirements for offline caching (FR-32, FR-33) and event resilience
- [Source: docs/architecture.md] - Next.js 16 App Router architecture, single-page marketing site pattern
- [Source: public/sw.js] - Current service worker implementation (extend for Story 1.2)
- [Source: stories/1-1-create-pwa-manifest-and-service-worker-foundation.md] - Previous story learnings and foundation

## Dev Agent Record

### Context Reference

- docs/stories/1-2-implement-offline-caching-strategy.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- **2025-11-06**: Story drafted from Epic 1 requirements and Story 1.1 learnings.
- **2025-11-06**: Story context XML generated and story marked ready-for-dev.

