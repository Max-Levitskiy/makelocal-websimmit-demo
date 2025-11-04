# Product Requirements Document - MakeLocal Web Summit Microsite

## Document Control
- Version: 0.1 (2025-03-19)
- Owner: Product Marketing, MakeLocal
- Contributors: Product (TBD), Design (TBD), Engineering (Web Demo Squad)
- Stakeholders: Events team, Partnerships, Coordinator Success, Engineering

## 1. Purpose and Background
- Deliver an interactive microsite that anchors MakeLocal’s Web Summit Lisbon 2025 booth experience.
- Showcase the end-to-end story of local, on-demand manufacturing and the coordinator ecosystem.
- Provide a simulated yet believable ordering journey that visitors can complete in under three minutes.
- Capture qualified leads (coordinators, partners, investors) for follow-up after the conference.
- Serve as a reusable template for future coordinator shop demos beyond the event.

## 2. Objectives and Success Measures
### 2.1 Objectives
- Convert booth visitors into active participants by guiding them through a demo order flow.
- Surface the value of the MakeLocal platform for both customers and coordinators.
- Equip the booth team with a visually compelling, responsive storytelling tool that runs offline-friendly.
- Collect coordinator and partner leads with clear handoffs to CRM.
- Encourage visitors to install the microsite on their devices for rapid re-entry during the event.

### 2.2 Success Metrics (Event Week)
- 60%+ of visitors who land on the microsite start the product personalization flow.
- 40%+ of visitors who start checkout submit a lead form (order or coordinator form).
- ≥90% of checkout attempts successfully create a draft order on MakeLocal without manual intervention.
- NPS-style booth survey average ≥ 8/10 referencing clarity of MakeLocal story.
- Less than 1% reported UI errors or blockers during the demo (captured via booth staff log).
- Time to reset between demo sessions < 15 seconds for booth staff.
- Track Add to Home Screen/install prompt exposure with a target ≥ 10% completion for visitors reaching the confirmation screen.

## 3. Target Audiences
- **Event Visitors (Customers):** Curious passersby scanning the QR code; low attention span, want to see something happen quickly.
- **Coordinator Prospects:** Entrepreneurs or partners evaluating MakeLocal’s shop tooling; care about API access and business model proof.
- **Investors and Press:** Need a succinct narrative and credibility signals.
- **Booth Staff:** Require a tool that is reliable, easy to restart, and guided enough to run unattended if needed.

## 4. Experience Principles
- **Immediate Awe:** Hero, animation, and live queue should communicate “manufacturing in motion” within five seconds.
- **Guided Interactivity:** Every step should have a clear primary action; avoid dead ends or optional detours during the demo.
- **Believable Simulation:** Even mocked data should feel real (names, queue progression, realistic timing).
- **Accessible to All:** Works on attendee devices (mobile-first) and booth tablets; adheres to a11y WCAG 2.1 AA.
- **Event Resilience:** Capable of running on flaky conference Wi-Fi; minimal dependence on live services.
- **Installable Demo:** Promote Add to Home Screen/app install so visitors can reopen the experience quickly.

## 5. Scope
### 5.1 In Scope
- Responsive microsite hosted at `websummit.makelocal.eu` (final domain TBD).
- Catalog of 6–9 SKUs with personalization controls (name, color at minimum).
- Local cart persisted in browser storage that supports adding multiple products before checkout.
- Checkout CTA that hands off to the MakeLocal platform (or kiosk flow) for actual order capture.
- Integration with MakeLocal `orderDraft` endpoint to pre-create drafts before redirecting visitors.
- On-site messaging that references MakeLocal-managed queue/order tracking; optional static ticker highlighting activity.
- Coordinator mode drawer/panel with API mock tabs (Catalog, Orders, Job Steps).
- Informational sections: How It Works, Roles, Coordinator pitch, Contact.
- Lead capture: checkout lead (name, email), coordinator form (name, email, company, idea) with option to jump directly to MakeLocal registration.
- Progressive web app (PWA) install prompts and offline-ready caching strategy.
- Analytics instrumentation for booth learnings (works offline-first, syncs later).

### 5.2 Out of Scope
- Real payments, logistics, or production integration.
- Multi-language/localization (English only for Web Summit 2025).
- Account creation beyond anonymous token flow.
- SEO optimization beyond basic metadata (microsite is event-only).
- Complex CMS; content can be static JSON/Markdown for this release.
- End-to-end queue/order state management on the microsite (handled by MakeLocal platform).

### 5.3 Stretch (Time Permitting)
- Microsite-driven queue simulation that mirrors MakeLocal tracking for booths without live connectivity.
- Finer-grained order status UI that auto-advances independently of the MakeLocal platform.

## 6. User Journeys
### 6.1 Visitor Demo Flow
1. Landing hero communicates promise, CTA “Browse catalog”.
2. Visitor selects a product card; personalizes with name/color.
3. Personalization view recaps selection and lets the visitor add the product to a cart persisted locally (multiple items allowed).
4. Cart overlay/page summarizes selections; primary CTA “Checkout on MakeLocal” triggers creation of a draft order via the MakeLocal `orderDraft` endpoint, then deep-links the visitor to MakeLocal (new tab/device) or shows QR instructions.
5. Microsite confirmation copy reinforces that order tracking continues on MakeLocal, provides fallback steps if the draft could not be created, and encourages visitors to keep the Add to Home Screen shortcut.
6. Visitor is invited to leave contact info or talk to staff via final CTA; optional stretch UI shows simulated queue if delivered.

### 6.2 Coordinator Prospect Flow
1. Uses top-level “Coordinator Mode” toggle or visits section.
2. Drawer/tabbed view explains API features, shows mocked data tables, event stream.
3. CTA “Join the Network” opens coordinator form.
4. Successful form submission routes to thank-you state, offers direct link to MakeLocal coordinator registration, and notifies staff.

### 6.3 Booth Staff Flow
1. Launches microsite on kiosk/tablet each morning (cached assets).
2. Uses hidden reset controls (keyboard combo or URL param) to clear queue/order data.
3. Monitors MakeLocal platform dashboard for live order status; optional microsite ticker can be updated manually if enabled.
4. Downloads leads/export at end of day (manual CSV or share to CRM).

## 7. Functional Requirements
### 7.1 Landing and Catalog
- FR-1: Responsive hero with preloaded background image/animation that does not block first contentful paint.
- FR-2: Live queue banner (marquee) displays curated queue messaging; stretch goal populates from simulated job data (`name`, `item`, `progress`).
- FR-3: Catalog grid renders 6–9 product cards with consistent aspect ratios and metadata (title, description, ETA, material tags).
- FR-4: Product cards expose quick actions (color swatches, personalize CTA) that transition into product detail modal or dedicated route.

### 7.2 Product Personalization
- FR-5: Personalization supports text input (up to 12 characters, inline validation) and at least 5 color options.
- FR-6: Selected options persist through navigation back to the catalog during the same session.
- FR-7: Estimated print time updates if product variants differ (configurable JSON per SKU).

### 7.3 Cart & Checkout
- FR-8: Product detail view offers “Add to Cart”; cart data persists locally and supports multiple SKUs with per-item edits/removal.
- FR-9: Cart review shows personalized options, estimated print times, and allows quantity adjustments or clear-all (for booth reset).
- FR-10: Checkout collects optional contact details (name, email) for visitors who prefer a follow-up instead of immediate handoff.
- FR-11: Primary checkout action calls the MakeLocal `orderDraft` endpoint with current cart payload; handles offline/error states with clear instructions.
- FR-12: On successful draft creation, the experience opens/deep-links to the MakeLocal order flow (or displays QR with draft context) and confirms that fulfillment continues there.

### 7.4 Order Status Handoff
- FR-13: Provide an order status explainer that links visitors to the MakeLocal-managed tracker or instructs them to speak with booth staff.
- FR-14 (Stretch): Optional microsite status module can mirror MakeLocal state or run a lightweight simulation when time permits.
- FR-15 (Stretch): Staff override controls expose when the optional simulation is active.
- FR-16 (Stretch): Live queue banner syncs with the optional simulation; otherwise it displays curated static copy.

### 7.5 Coordinator Mode
- FR-17: Toggle accessible from persistent navigation; indicates when active.
- FR-18: Drawer includes tabbed sections referencing API mocks: Catalog products list, Orders table, Job steps/event stream.
- FR-19: Each tab references real-looking JSON or table data sourced from static mocks aligned with API docs.
- FR-20: Includes CTA linking to coordinator lead form and explains business value bullets.

### 7.6 Informational Sections
- FR-21: “How MakeLocal Works” section presents 4-step infographic (icons + copy).
- FR-22: “Roles” grid highlights six personas with succinct descriptions.
- FR-23: Coordinator pitch section includes benefits bullets and supportive imagery.
- FR-24: Contact section lists booth location, dates, map thumbnail, and social links.

### 7.7 Lead Capture
- FR-25: Contact path from checkout logs lead submission (name, email, product) to local store and optional export endpoint.
- FR-26: Coordinator form collects name, email, company, free-text idea; requires consent checkbox if GDPR messaging needed, and includes a direct link to MakeLocal coordinator registration.
- FR-27: Successful submissions display confirmation and provide follow-up instructions (“We’ll email after Web Summit”) plus option to open MakeLocal immediately.
- FR-28: Staff has access to aggregated leads view (password-protected admin route acceptable).

### 7.8 Content and Configuration
- FR-29: All copy, product definitions, queue seeds, and coordinator FAQs externalized in structured JSON/MD files for rapid iteration.
- FR-30: Booth number, dates, and CTA text configurable without redeploy (e.g., env or JSON).
- FR-31: Support easy toggle between “demo mode” and “post-event mode” messaging.

### 7.9 Installability and Offline
- FR-32: Ship web app manifest and service worker providing offline caching for critical routes and assets.
- FR-33: Surface an Add to Home Screen prompt or guidance (e.g., in confirmation copy) so visitors can install the microsite on mobile.

## 8. Data, State, and Integrations
- Cart state persists in browser storage (cleared via staff controls) and is transformed into the payload required by the MakeLocal `orderDraft` endpoint.
- Checkout and order tracking live on the MakeLocal platform; microsite deep-links with draft identifiers or context tokens only.
- Use Supabase anonymous auth stub (`docs/makelocal-api/anonymousAuth.md`) for lead capture endpoints if required; otherwise store leads locally with secure export.
- Optional queue simulation (stretch) runs on deterministic seed with ability to randomize names from curated list.
- Lead exports pushed to downloadable CSV or simple POST webhook when connectivity is available.
- Telemetry buffered locally and synced when network is detected (respect privacy guidelines).

## 9. Non-Functional Requirements
- **Performance:** Largest Contentful Paint < 2.5s on booth hardware with throttled 3G; total JS payload < 200KB gzipped for initial route.
- **Accessibility:** Meets WCAG 2.1 AA; fully navigable via keyboard; color contrast ≥ 4.5:1.
- **Resilience:** Works when offline after initial load; provides clear messaging if MakeLocal platform link is temporarily unavailable.
- **Security:** Lead exports behind password or physical access; no sensitive data stored beyond event needs.
- **Maintainability:** Codebase aligns with `STYLEGUIDE.md` tokens and component abstractions outlined in `docs/component-inventory.md`.

## 10. Analytics and Telemetry
- Track page views, CTA clicks (including “Continue on MakeLocal” and Add to Home Screen prompts), flow drop-offs, and lead submissions (client-side events buffered).
- Provide simple dashboard or logs for booth staff to review metrics daily.
- Respect privacy: no third-party trackers; display disclosure in footer if required by GDPR.

## 11. Milestones and Timeline
- **M1 - Experience Prototype (T-8 weeks):** Clickable flow covering catalog → MakeLocal handoff; hero and queue messaging in place.
- **M2 - Content Complete (T-5 weeks):** All copy, product data, coordinator assets finalized; instrumentation stubbed.
- **M3 - Alpha Demo (T-3 weeks):** Handoff flow validated on target hardware; PWA install tested; offline/resilience checks complete.
- **M4 - Final Polish (T-1 week):** QA complete (accessibility, responsive, performance); lead export workflow validated.
- **Event Week Support:** Daily smoke test checklist, clear reset instructions, hotline to engineering.

## 12. Dependencies and Risks
- Final product imagery and design assets from creative team (tracked in `/design`).
- Confirmed booth number and logistics from events team.
- MakeLocal platform checkout/order tracking and `orderDraft` endpoint availability; risk if deep-link or payload contract changes late.
- Coordinator success team alignment on lead intake questions and CRM integration.
- Conference Wi-Fi reliability; mitigation via local caching and offline-first build.

## 13. Open Questions
- If the optional queue simulation is deferred, what messaging should replace it on the microsite?
- What fields are mandatory for the `orderDraft` payload, and do we need to support multi-item carts or per-item metadata?
- Should coordinator leads feed directly into existing CRM (HubSpot/Salesforce) or remain manual export?
- What is the approval process for using attendee names in queue ticker (privacy considerations)?
- Will there be a post-event mode that needs different KPIs or flows?
- Are there compliance requirements for data retention/deletion of leads collected onsite?
- Which MakeLocal URLs (checkout, coordinator registration) should we deep link to, and what is the fallback if those endpoints are offline?
- How aggressively should we prompt visitors to install the PWA versus keeping the flow lightweight?
