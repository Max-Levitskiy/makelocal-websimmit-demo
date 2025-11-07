<!--
SYNC IMPACT REPORT
==================
Version Change: 1.0.0 → 1.0.1
Amended: 2025-11-06

Clarifications Added:
- Demo-First Experience: Enhanced detail on product parameter configuration flow (hardcoded parameters → cart → MakeLocal checkout → payment)
- Event Resilience: Strengthened cart persistence requirements for configuration state

Principles Modified:
- I. Demo-First Experience (clarified user flow details)

Additional Sections:
- No changes

Templates Status:
✅ plan-template.md - No updates needed
✅ spec-template.md - No updates needed
✅ tasks-template.md - No updates needed
⚠️  No command files to update (none found in templates directory)

Follow-up TODOs: None
-->

# MakeLocal Web Summit Microsite Constitution

## Core Principles

### I. Demo-First Experience

Every feature MUST function as a compelling, believable demonstration of the MakeLocal platform. This principle ensures the microsite achieves its primary mission: showcasing local 3D-print manufacturing at Web Summit.

**Rules:**
- All interactions MUST complete within 3 minutes maximum for the full demo flow (catalog → parameter configuration → cart addition → MakeLocal checkout → payment confirmation)
- Product parameter configuration MUST be supported with hardcoded options per product (e.g., name input, color/material selections)
- Cart functionality MUST allow adding configured products with persistent state across navigation
- Checkout MUST integrate with MakeLocal platform via orderDraft endpoint for seamless payment handoff
- Simulated data (queue activity, order status, coordinator API) MUST feel authentic and production-ready
- User journeys MUST have clear next actions at every step—no dead ends or confusing states
- "Immediate awe" within 5 seconds: Hero and live queue banner MUST communicate "manufacturing in motion" instantly
- Error states MUST be handled gracefully with clear guidance (e.g., offline mode instructions, booth staff contact)

**Rationale:**
Event visitors have limited attention spans. The demo must deliver instant impact and guide users seamlessly through the complete MakeLocal ordering experience, converting curiosity into engagement and demonstrating the full platform value proposition.

---

### II. Event Resilience

The microsite MUST function reliably in adverse conference conditions, including flaky Wi-Fi, offline scenarios, and high traffic.

**Rules:**
- Progressive Web App (PWA) capabilities MUST be implemented: service worker, web app manifest, offline caching
- Critical routes and assets MUST be cached for offline use after first load
- External API calls (e.g., MakeLocal orderDraft endpoint) MUST include fallback behaviors and timeout handling
- Browser storage MUST be used for cart persistence with configured product parameters, lead capture buffering, and analytics queuing
- Cart state MUST survive page refreshes, browser restarts, and device orientation changes during the same session
- Booth staff MUST have access to reset controls (clear cart/queue, reset demo state) via keyboard shortcut or URL parameter
- Performance budget: Largest Contentful Paint < 2.5s on throttled 3G; total JS payload < 200KB gzipped for initial route

**Rationale:**
Conference Wi-Fi is notoriously unreliable. Offline-first architecture ensures the demo remains functional and impressive regardless of network conditions, protecting the event investment and brand reputation while maintaining user progress through the ordering flow.

---

### III. Rapid Content Iteration

Content changes MUST be achievable without code redeployment to support last-minute event updates and experimentation.

**Rules:**
- Product catalog (SKUs, descriptions, images, personalization options) MUST be externalized in structured JSON or Markdown files
- Copy for all sections (hero, how-it-works, roles, coordinator pitch, contact) MUST be configuration-driven
- Event-specific details (booth number, dates, URLs) MUST be manageable via environment variables or JSON config
- Demo mode vs. post-event mode messaging MUST be toggleable via configuration flag
- Queue activity messages and simulated data seeds MUST be externalized for easy curation

**Rationale:**
Events demand flexibility. Marketing and booth teams need the ability to tweak messaging, add products, or update booth details rapidly without engineering bottlenecks or redeploy risks.

---

### IV. Design System Adherence

All UI components and patterns MUST strictly follow the tokens, typography, spacing, and component specifications defined in `STYLEGUIDE.md`.

**Rules:**
- Color usage MUST conform to the documented palette: `--primary` (#259df4), `--electric-accent` (#25f4a2), slate neutrals, and semantic colors
- Typography MUST use Plus Jakarta Sans with documented weights (400, 500, 700, 800) and the established type scale
- Component patterns (buttons, cards, inputs, tags, accordions, headers, footers) MUST match STYLEGUIDE.md specifications exactly
- Spacing and layout MUST use Tailwind's 4px-based scale as documented (gap-4, p-4 defaults)
- Dark mode support MUST be implemented for all components using the documented class-based approach
- Border radius MUST follow the established scale: cards/buttons use `rounded-xl` (24px), inputs use `rounded-lg` (16px), badges/swatches use `rounded-full`
- Accessibility MUST meet WCAG 2.1 AA: proper semantic HTML, focus states with primary color rings, keyboard navigation, color contrast ≥ 4.5:1

**Rationale:**
Visual consistency is critical for brand credibility. A design system ensures every component reinforces the MakeLocal identity and delivers a polished, professional experience that scales across team contributions.

---

### V. Progressive Enhancement

The microsite MUST deliver core functionality across all devices and progressive capabilities on modern platforms.

**Rules:**
- Mobile-first design MUST be the default approach; responsive breakpoints MUST support phones, tablets, and kiosks
- Core user journeys (browse, personalize, checkout, lead capture) MUST function without JavaScript as a baseline (forms submit, content readable)
- Enhanced features (PWA install prompts, offline sync, real-time queue ticker, analytics) MUST layer on gracefully for capable browsers
- Installability MUST be promoted: Add to Home Screen guidance in confirmation flows, optimized app icons and splash screens
- Semantic HTML and proper heading hierarchy MUST be maintained for assistive technologies
- Images MUST include descriptive alt text; forms MUST have associated labels

**Rationale:**
Conference attendees use diverse devices. Progressive enhancement ensures the demo works for everyone while showcasing modern web capabilities (PWA, offline) to technical visitors and partners, reinforcing MakeLocal's technical sophistication.

---

## Technical Constraints

### Performance Standards
- Largest Contentful Paint (LCP) MUST be < 2.5 seconds on throttled 3G
- First Contentful Paint (FCP) MUST be < 1.8 seconds
- Total Blocking Time (TBT) MUST be < 300ms
- Cumulative Layout Shift (CLS) MUST be < 0.1
- Initial JavaScript payload MUST be < 200KB gzipped
- Images MUST be optimized (WebP with JPEG fallback), lazy-loaded where appropriate

### Accessibility Requirements
- MUST meet WCAG 2.1 Level AA compliance
- Color contrast MUST be ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- All interactive elements MUST be keyboard navigable
- Focus indicators MUST be visible with 2px primary color ring
- Form inputs MUST have associated labels (visible or aria-label)
- Heading hierarchy MUST be logical (no skipped levels)

### PWA Requirements
- MUST include valid web app manifest with icons (192px, 512px minimum)
- Service worker MUST cache critical routes, assets, and fonts
- Offline fallback page MUST provide booth contact information
- Add to Home Screen prompt MUST be surfaced in confirmation flow

### Browser Support
- MUST support last 2 versions of Chrome, Firefox, Safari, Edge
- MUST gracefully degrade on older browsers (iOS Safari 14+, Android Chrome 90+)
- MUST function without JavaScript for core content (progressive enhancement baseline)

---

## Development Workflow

### Testing Approach
- User acceptance testing (UAT) MUST validate all user journeys defined in PRD before event deployment
- Accessibility testing MUST be performed with keyboard navigation and screen reader (VoiceOver/NVDA)
- Performance testing MUST verify Core Web Vitals on throttled connections and target booth hardware
- Offline scenario testing MUST confirm PWA caching and fallback behaviors work as designed
- Responsive testing MUST cover mobile (375px), tablet (768px), and kiosk (1920px) viewports
- Integration testing MUST validate MakeLocal API handoff (orderDraft endpoint, coordinator registration links)

### Content Management
- Product catalog MUST be maintained in `content/products.json` with schema validation
- Copy blocks MUST be externalized in `content/sections.json` or dedicated Markdown files
- Configuration MUST be centralized in `.env` files or `content/config.json` for event-specific values
- Content changes MUST be validated via preview deployments before production push

### Deployment Strategy
- Preview deployments MUST be created for every pull request to enable stakeholder review
- Production deployment MUST occur at least 48 hours before Web Summit to allow smoke testing on booth hardware
- Rollback procedure MUST be documented and tested before event week
- Post-deployment smoke test checklist MUST be executed: PWA install, offline mode, orderDraft handoff, lead capture, analytics

---

## Governance

### Amendment Procedure
- Constitution changes MUST be proposed via pull request with rationale documented
- Amendments MUST include impact analysis on dependent templates (plan, spec, tasks)
- Approval MUST be obtained from project lead before merging
- Version MUST be incremented following semantic versioning:
  - **MAJOR**: Backward-incompatible principle removals or redefinitions
  - **MINOR**: New principles added or materially expanded guidance
  - **PATCH**: Clarifications, wording fixes, non-semantic refinements

### Compliance Review
- All feature specifications MUST include a "Constitution Check" section verifying alignment with principles
- Pull requests MUST reference relevant principles in description (e.g., "Implements Demo-First Experience principle for checkout flow")
- Code reviews MUST verify Design System Adherence by checking STYLEGUIDE.md conformance
- Pre-deployment checklist MUST validate Event Resilience (offline mode, performance budget, error handling)

### Complexity Justification
- Violations of principles (e.g., performance budget breach, design system deviation) MUST be documented in plan.md Complexity Tracking section
- Justification MUST explain why simpler alternatives were rejected and provide mitigation strategy
- Temporary violations MUST include remediation timeline and follow-up task

**Version**: 1.0.1 | **Ratified**: 2025-11-06 | **Last Amended**: 2025-11-06
