# Epic Technical Specification: Product Personalization

Date: 2025-11-07
Author: MakeLocal WebSimmit Demo
Epic ID: 3
Status: Complete

---

## Overview

Epic 3: Product Personalization enables visitors to customize products with name and color options, creating an interactive and personal demo experience. This epic builds on Epic 2 (Catalog & Discovery) by adding personalization capabilities to product detail views, allowing visitors to make products unique before adding them to their cart. The personalization flow differentiates MakeLocal's on-demand manufacturing story and creates emotional connection before checkout, supporting the PRD goal of achieving 60%+ of visitors starting the product personalization flow.

The epic encompasses four stories: building the personalization form component, implementing option persistence, adding estimated print time updates, and creating a visual preview. All components integrate with the existing Next.js 16 App Router architecture and leverage browser storage for state management.

## Objectives and Scope

### In Scope
- Personalization UI with text input (up to 12 characters, inline validation)
- Color selection (minimum 5 options per product)
- Option persistence through navigation back to catalog (browser storage)
- Estimated print time updates based on product variants
- Configurable JSON per SKU for variant definitions
- Visual preview of personalized options
- Integration with product detail view from Epic 2
- Storage utilities for personalization data persistence
- Real-time preview updates as user makes selections

### Out of Scope
- Payment processing or order fulfillment (handled in Epic 4)
- Multi-language personalization options
- Image upload or custom design uploads
- Advanced personalization options beyond name and color
- Server-side personalization storage (client-side only for this epic)
- Personalization analytics (covered in Epic 1 Story 1.3)

## System Architecture Alignment

This epic aligns with the Next.js 16 App Router architecture documented in the Architecture Overview. Components will be built as React Server Components and Client Components where interactivity is required (form inputs, real-time previews). The personalization form (`PersonalizationForm.tsx`) will be a Client Component due to form state management, while the preview component can leverage React's reactivity.

The epic integrates with:
- **Product Detail View** (Epic 2, Story 2.5): Personalization form opens from product detail
- **Cart Storage** (Epic 4, Story 4.1): Personalized products are added to cart with personalization data
- **Staff Reset Controls** (Epic 1, Story 1.4): Personalization storage is cleared on reset

Data persistence uses browser localStorage/sessionStorage, aligning with the offline-first architecture. Product variant data will be sourced from `src/data/products.json`, maintaining consistency with the static data approach outlined in the architecture.

## Detailed Design

### Services and Modules

| Module/Component | File Path | Responsibility | Inputs | Outputs | Owner |
|-----------------|----------|----------------|--------|---------|-------|
| **Personalization Form Component** | `src/app/components/PersonalizationForm.tsx` | Main form UI for name input and color selection | Product ID, product data, initial values (optional) | Form state, validation status, submit handler | Frontend Team |
| **Personalization Storage Utility** | `src/lib/personalization-storage.ts` | Manages browser storage for personalization data | Product ID, personalization data | Saved/retrieved personalization data | Frontend Team |
| **Print Time Display Component** | `src/app/components/PrintTimeDisplay.tsx` | Displays and updates estimated print time | Product data, selected color variant | Print time display (minutes) | Frontend Team |
| **Personalization Preview Component** | `src/app/components/PersonalizationPreview.tsx` | Real-time visual preview of personalized product | Product data, name, selected color | Preview image/display | Frontend Team |
| **Product Variant Calculator** | `src/lib/variant-calculator.ts` | Calculates print time based on variant selection | Product data, color selection | Updated print time | Frontend Team |
| **Form Validation Utility** | `src/lib/validation.ts` | Validates name input (length, format) | Name string, max length | Validation result, error message | Frontend Team |

### Data Models and Contracts

#### Personalization Data Schema

```typescript
// Personalization state for a single product
interface PersonalizationData {
  productId: string;              // Product identifier (e.g., "keychain-001")
  name: string;                    // Personalized name (max 12 characters)
  colorId: string;                 // Selected color ID (e.g., "red", "blue")
  timestamp?: number;              // Optional timestamp of last update
}

// Storage format (localStorage/sessionStorage)
interface PersonalizationStorage {
  [productId: string]: PersonalizationData;  // Key: productId, Value: personalization data
}

// Extended Product schema with variants (extends Epic 2 Product schema)
interface ProductWithVariants extends Product {
  variants?: ProductVariant[];    // Variant definitions for print time calculation
}

interface ProductVariant {
  colorId: string;                // Color identifier matching ProductColor.id
  printTimeMinutes: number;        // Print time for this variant (overrides base time)
  image?: string;                 // Optional variant-specific image
  priceAdjustment?: number;       // Optional price adjustment (not in PRD scope)
}

// Form state model
interface PersonalizationFormState {
  name: string;                    // Current name input value
  colorId: string | null;          // Selected color ID (null if none selected)
  isValid: boolean;                // Overall form validation status
  errors: {
    name?: string;                 // Name validation error message
    color?: string;                // Color selection error message
  };
}
```

#### Component Props Interfaces

```typescript
// Personalization Form Props
interface PersonalizationFormProps {
  product: ProductWithVariants;    // Product data including variants
  initialValues?: {                // Optional initial values for restoration
    name?: string;
    colorId?: string;
  };
  onSubmit: (data: PersonalizationData) => void;  // Submit handler
  onCancel?: () => void;           // Optional cancel handler
  showPreview?: boolean;           // Enable preview component (default: true)
}

// Print Time Display Props
interface PrintTimeDisplayProps {
  baseTime: number;                // Base print time in minutes
  variantTime?: number;             // Variant-specific print time (if selected)
  format?: 'minutes' | 'hours';     // Display format (default: 'minutes')
}

// Personalization Preview Props
interface PersonalizationPreviewProps {
  product: ProductWithVariants;    // Product data
  name: string;                    // Personalized name
  colorId: string;                 // Selected color ID
  size?: 'small' | 'medium' | 'large';  // Preview size (default: 'medium')
}
```

### APIs and Interfaces

#### Personalization Storage API

```typescript
// Personalization storage interface
interface PersonalizationStorageAPI {
  save(productId: string, data: PersonalizationData): void;
  load(productId: string): PersonalizationData | null;
  loadAll(): PersonalizationStorage;
  clear(productId: string): void;
  clearAll(): void;  // Used by staff reset (Epic 1, Story 1.4)
}

// Implementation (localStorage-based)
class PersonalizationStorageService implements PersonalizationStorageAPI {
  private readonly STORAGE_KEY = 'makelocal_personalization';
  private readonly STORAGE_TYPE: 'localStorage' | 'sessionStorage' = 'localStorage';

  save(productId: string, data: PersonalizationData): void {
    const storage = this.getStorage();
    const all = this.loadAll();
    all[productId] = { ...data, timestamp: Date.now() };
    storage.setItem(this.STORAGE_KEY, JSON.stringify(all));
  }

  load(productId: string): PersonalizationData | null {
    const all = this.loadAll();
    return all[productId] || null;
  }

  loadAll(): PersonalizationStorage {
    const storage = this.getStorage();
    const stored = storage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  clear(productId: string): void {
    const storage = this.getStorage();
    const all = this.loadAll();
    delete all[productId];
    storage.setItem(this.STORAGE_KEY, JSON.stringify(all));
  }

  clearAll(): void {
    const storage = this.getStorage();
    storage.removeItem(this.STORAGE_KEY);
  }

  private getStorage(): Storage {
    return this.STORAGE_TYPE === 'localStorage' ? localStorage : sessionStorage;
  }
}
```

#### Variant Calculation API

```typescript
// Variant calculation interface
interface VariantCalculatorAPI {
  calculatePrintTime(product: ProductWithVariants, colorId: string): number;
  getVariantImage(product: ProductWithVariants, colorId: string): string | null;
}

// Implementation
class VariantCalculatorService implements VariantCalculatorAPI {
  calculatePrintTime(product: ProductWithVariants, colorId: string): number {
    // Check if variant-specific time exists
    const variant = product.variants?.find(v => v.colorId === colorId);
    if (variant?.printTimeMinutes) {
      return variant.printTimeMinutes;
    }
    // Fall back to base time
    return product.estimatedPrintTime;
  }

  getVariantImage(product: ProductWithVariants, colorId: string): string | null {
    const variant = product.variants?.find(v => v.colorId === colorId);
    return variant?.image || null;
  }
}
```

#### Form Validation API

```typescript
// Validation interface
interface ValidationAPI {
  validateName(name: string, maxLength: number): { isValid: boolean; error?: string };
  validateColor(colorId: string | null): { isValid: boolean; error?: string };
}

// Implementation
class ValidationService implements ValidationAPI {
  validateName(name: string, maxLength: number = 12): { isValid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { isValid: false, error: 'Name is required' };
    }
    if (name.length > maxLength) {
      return { isValid: false, error: `Name must be ${maxLength} characters or less` };
    }
    // Optional: Add format validation (e.g., no special characters)
    const invalidChars = /[<>{}[\]\\\/]/;
    if (invalidChars.test(name)) {
      return { isValid: false, error: 'Name contains invalid characters' };
    }
    return { isValid: true };
  }

  validateColor(colorId: string | null): { isValid: boolean; error?: string } {
    if (!colorId) {
      return { isValid: false, error: 'Please select a color' };
    }
    return { isValid: true };
  }
}
```

### Workflows and Sequencing

#### Personalization Flow Sequence

1. **User arrives at Product Detail View** (Epic 2, Story 2.5)
   - Product detail component loads product data
   - Checks for existing personalization data via `PersonalizationStorageService.load(productId)`
   - If found, restores name and color selections

2. **User clicks "Personalize" CTA**
   - Personalization form component mounts
   - Form initializes with:
     - Restored values (if available) OR
     - Empty state (no name, first color selected by default)
   - Preview component displays base product image

3. **User enters name (real-time validation)**
   - Input handler triggers `ValidationService.validateName(name, 12)`
   - Character counter updates (e.g., "8/12")
   - Error message displays if validation fails
   - Preview component updates name overlay in real-time

4. **User selects color**
   - Color swatch click handler updates form state
   - `VariantCalculatorService.calculatePrintTime()` called with selected color
   - Print time display updates immediately (if variant differs)
   - Preview component updates color (CSS filter or image swap)

5. **Form validation on submit**
   - `ValidationService.validateName()` and `validateColor()` called
   - If valid: Form submits personalization data
   - If invalid: Error messages displayed, submit blocked

6. **Personalization data saved**
   - `PersonalizationStorageService.save(productId, personalizationData)` called
   - Data persisted to localStorage with timestamp
   - Form calls `onSubmit` callback with personalization data

7. **Add to Cart action** (Epic 4, Story 4.1)
   - Cart receives product data + personalization data
   - Cart item structure: `{ productId, name, colorId, quantity, ... }`
   - Personalization data included in cart storage

#### Navigation Persistence Flow

1. **User navigates back to catalog**
   - Personalization data remains in localStorage
   - Product cards can optionally show "Personalized" badge if data exists

2. **User returns to same product**
   - Product detail component checks storage on mount
   - `PersonalizationStorageService.load(productId)` retrieves saved data
   - Form pre-populates with saved name and color
   - Preview displays personalized preview immediately

3. **Staff reset triggered** (Epic 1, Story 1.4)
   - Reset utility calls `PersonalizationStorageService.clearAll()`
   - All personalization data cleared
   - Forms reset to empty state on next visit

## Non-Functional Requirements

### Performance

- **Form Input Responsiveness**: Name input validation and character counter updates must occur within 50ms of user input (no perceptible lag)
- **Preview Updates**: Preview component updates (color change, name overlay) must render within 100ms of state change
- **Storage Operations**: localStorage read/write operations must complete synchronously (no async delays)
- **Print Time Calculation**: Variant print time calculation must be O(1) lookup (no performance impact)
- **Component Mount Time**: Personalization form component must mount and initialize within 200ms
- **Bundle Size Impact**: Personalization components must add < 15KB gzipped to total JS bundle (aligned with Epic 1 Story 1.5 requirement of < 200KB total)

**Performance Targets (from PRD):**
- Largest Contentful Paint (LCP) < 2.5s on booth hardware with throttled 3G
- Total JS payload < 200KB gzipped for initial route (personalization components included)

### Security

- **Input Sanitization**: Name input must sanitize HTML/script injection attempts (React handles this by default, but validation regex prevents dangerous characters)
- **Storage Security**: Personalization data stored in localStorage is client-side only; no sensitive PII beyond name (which is user-provided demo data)
- **XSS Prevention**: Preview component must safely render name text without executing scripts (React's JSX escaping handles this)
- **Storage Access**: Personalization storage utility must not expose data to cross-origin scripts (localStorage is origin-scoped)
- **Data Retention**: Personalization data cleared on staff reset (Epic 1, Story 1.4) - no persistent storage beyond session needs

**Security Constraints (from PRD):**
- No third-party trackers; personalization data not sent to external services
- GDPR-compliant: User-provided name data is demo-only, cleared on reset

### Reliability/Availability

- **Offline Functionality**: Personalization form works completely offline after initial page load (no network dependencies)
- **Storage Availability**: Gracefully handles localStorage unavailable scenarios (private browsing mode, storage quota exceeded)
  - Fallback: Use in-memory state only (no persistence across navigation)
  - Error handling: Display user-friendly message if storage fails
- **Data Persistence**: Personalization data persists across page refreshes (localStorage-based)
- **Form State Recovery**: If form submission fails, personalization data remains in storage for retry
- **Browser Compatibility**: Works on all modern browsers supporting localStorage (IE11+ equivalent)

**Reliability Targets (from PRD):**
- Works when offline after initial load
- Clear messaging if MakeLocal platform link temporarily unavailable (applies to cart submission, not personalization)

### Observability

- **Form Interaction Tracking**: Track personalization form opens, completions, and abandonments (Epic 1, Story 1.3 - Analytics)
- **Validation Error Tracking**: Log validation errors (name too long, invalid characters) for UX improvement
- **Storage Operations**: Log storage read/write failures for debugging (console warnings in dev mode)
- **Performance Metrics**: Track form mount time, preview update latency (optional, for performance monitoring)
- **User Flow Analytics**: Track personalization → cart → checkout flow completion rate (Epic 1, Story 1.3)

**Observability Requirements (from PRD):**
- Analytics events tracked for: page views, CTA clicks, flow drop-offs
- Events buffered locally when offline, synced when network available
- Simple dashboard or log view for booth staff to review metrics

## Dependencies and Integrations

### External Dependencies

| Dependency | Version | Purpose | Notes |
|------------|--------|---------|-------|
| **React** | 19.2.0 | Component framework, form state management | Required for Client Components (form interactivity) |
| **Next.js** | 16.0.1 | App Router, Server/Client Components | Framework dependency |
| **TypeScript** | ^5 | Type safety, interface definitions | Development dependency |
| **Tailwind CSS** | ^4 | Styling, design tokens | Used for form UI styling |

### Internal Dependencies

| Component/Module | Epic/Story | Dependency Type | Integration Point |
|-----------------|------------|-----------------|-------------------|
| **Product Detail Component** | Epic 2, Story 2.5 | Required | Personalization form opens from product detail view |
| **Product Data Schema** | Epic 2 | Required | Extends Product schema with variants for print time calculation |
| **Cart Storage** | Epic 4, Story 4.1 | Required (future) | Personalized products added to cart with personalization data |
| **Staff Reset Controls** | Epic 1, Story 1.4 | Required | Clears personalization storage on reset |
| **Analytics Instrumentation** | Epic 1, Story 1.3 | Optional | Tracks personalization form interactions |

### Data Dependencies

- **Product Data** (`src/data/products.json`): Must include `variants` array for products that support personalization
  - Variant structure: `{ colorId: string, printTimeMinutes: number, image?: string }`
  - Products without variants use base `estimatedPrintTime`
- **Product Color Definitions**: Colors referenced in variants must match `ProductColor` definitions from Epic 2

### Browser APIs

- **localStorage API**: Required for personalization data persistence
  - Fallback: In-memory state if localStorage unavailable (private browsing mode)
- **JSON API**: Required for serializing/deserializing personalization data

### Integration Points

1. **Product Detail → Personalization Form**
   - Product detail component passes product data and optional initial values
   - Form component receives `PersonalizationFormProps` with product and callbacks

2. **Personalization Form → Cart** (Epic 4)
   - Form `onSubmit` callback receives `PersonalizationData`
   - Cart storage expects: `{ productId, name, colorId, quantity, ... }`

3. **Storage → Reset Utility** (Epic 1)
   - Reset utility calls `PersonalizationStorageService.clearAll()`
   - Storage key: `makelocal_personalization` (must match reset utility)

4. **Variant Data → Print Time Display**
   - Product data includes `variants` array
   - Variant calculator reads variant data to compute print time
   - Print time display component receives calculated time

### Version Constraints

- **React 19.2.0**: Required for React Compiler support (project uses React Compiler)
- **Next.js 16.0.1**: App Router features required for Server/Client Component pattern
- **TypeScript ^5**: Type definitions for interfaces and APIs

## Acceptance Criteria (Authoritative)

### Story 3.1: Build Personalization Form Component

1. **AC-3.1.1**: Text input for name accepts up to 12 characters with inline validation
   - Input field displays character counter (e.g., "8/12")
   - Validation occurs in real-time as user types
   - Error message displays if name exceeds 12 characters or contains invalid characters

2. **AC-3.1.2**: Color picker displays minimum 5 color options as swatches
   - Color swatches are visually distinct and accessible (keyboard navigable)
   - Selected color is visually highlighted (border, background, or checkmark)
   - Color options sourced from product data (`ProductColor[]`)

3. **AC-3.1.3**: Form shows visual preview of personalized product
   - Preview component updates in real-time as name/color changes
   - Preview displays product image with selected color applied (if available)
   - Preview shows personalized name text overlay

4. **AC-3.1.4**: "Add to Cart" button is enabled only when name is valid
   - Button disabled when name is empty or invalid
   - Button enabled when name passes validation (1-12 characters, valid format)
   - Button disabled state is visually distinct

### Story 3.2: Implement Personalization Option Persistence

1. **AC-3.2.1**: Selected name and color stored in browser storage (localStorage)
   - Storage key format: `makelocal_personalization`
   - Data structure: `{ [productId]: { productId, name, colorId, timestamp } }`
   - Storage persists across page refreshes

2. **AC-3.2.2**: When returning to product detail, previous selections are restored
   - Product detail component checks storage on mount
   - Form pre-populates with saved name and color if data exists
   - Preview displays personalized preview immediately upon restoration

3. **AC-3.2.3**: Persistence is per-product (different products can have different selections)
   - Storage structure supports multiple product IDs as keys
   - Each product maintains independent personalization data
   - Switching between products loads correct personalization data

4. **AC-3.2.4**: Storage cleared on staff reset (Story 1.4)
   - Reset utility calls `PersonalizationStorageService.clearAll()`
   - All personalization data removed from localStorage
   - Forms reset to empty state after reset

### Story 3.3: Add Estimated Print Time Updates

1. **AC-3.3.1**: Base print time displayed from product data
   - Print time display shows `product.estimatedPrintTime` initially
   - Display format: "Estimated: X minutes" or "ETA: X min"

2. **AC-3.3.2**: Print time updates when color selection changes (if variants differ)
   - Variant calculator checks for variant-specific print time
   - If variant exists, display variant print time; otherwise display base time
   - Updates occur immediately (no loading delay)

3. **AC-3.3.3**: Time calculation configurable per SKU in JSON
   - Product data includes `variants` array with `printTimeMinutes` per color
   - Variant structure: `{ colorId: string, printTimeMinutes: number }`
   - Products without variants use base `estimatedPrintTime`

### Story 3.4: Create Visual Preview of Personalized Options

1. **AC-3.4.1**: Preview updates in real-time as name/color changes
   - Preview component receives name and colorId as props
   - Updates render within 100ms of state change (performance requirement)
   - No flickering or jank during updates

2. **AC-3.4.2**: Preview shows product image with selected color applied
   - If variant-specific image exists, display variant image
   - Otherwise, apply CSS filter or image swap based on color
   - Color application is visually clear and accurate

3. **AC-3.4.3**: Preview displays personalized name text overlay
   - Name text rendered over product image
   - Text is readable and properly positioned
   - Text updates immediately as user types

4. **AC-3.4.4**: Preview matches what will appear in cart
   - Preview appearance consistent with cart item display (Epic 4)
   - Same color application and name display format
   - Preview size appropriate for form context

## Traceability Mapping

| Acceptance Criteria | Spec Section | Component/API | Test Idea |
|-------------------|--------------|----------------|-----------|
| **AC-3.1.1** (Name input validation) | Detailed Design → Form Validation API | `ValidationService.validateName()` | Unit test: Validate name length (0, 12, 13 chars), invalid characters |
| **AC-3.1.2** (Color picker) | Detailed Design → Personalization Form Component | `PersonalizationForm.tsx` | Component test: Render 5+ color swatches, select color, verify highlight |
| **AC-3.1.3** (Visual preview) | Detailed Design → Personalization Preview Component | `PersonalizationPreview.tsx` | Component test: Render preview, update name/color, verify preview updates |
| **AC-3.1.4** (Add to Cart button) | Detailed Design → Personalization Form Component | `PersonalizationForm.tsx` | Component test: Button disabled when invalid, enabled when valid |
| **AC-3.2.1** (Storage persistence) | Detailed Design → Personalization Storage API | `PersonalizationStorageService` | Unit test: Save/load data, verify localStorage structure |
| **AC-3.2.2** (Restore selections) | Workflows → Navigation Persistence Flow | `ProductDetail` + `PersonalizationForm` | Integration test: Save data, navigate away, return, verify restoration |
| **AC-3.2.3** (Per-product persistence) | Detailed Design → Personalization Storage API | `PersonalizationStorageService` | Unit test: Save data for multiple products, verify isolation |
| **AC-3.2.4** (Reset clears storage) | Dependencies → Staff Reset Controls | `PersonalizationStorageService.clearAll()` | Integration test: Save data, trigger reset, verify cleared |
| **AC-3.3.1** (Base print time) | Detailed Design → Print Time Display Component | `PrintTimeDisplay.tsx` | Component test: Display base time from product data |
| **AC-3.3.2** (Variant print time) | Detailed Design → Variant Calculation API | `VariantCalculatorService` | Unit test: Calculate time for variant, verify variant time returned |
| **AC-3.3.3** (Configurable variants) | Data Models → ProductWithVariants | `src/data/products.json` | Data test: Verify variant structure in product data |
| **AC-3.4.1** (Real-time preview updates) | NFR → Performance | `PersonalizationPreview.tsx` | Performance test: Measure update latency (< 100ms) |
| **AC-3.4.2** (Color application) | Detailed Design → Personalization Preview Component | `PersonalizationPreview.tsx` | Component test: Apply color filter/image swap, verify visual result |
| **AC-3.4.3** (Name overlay) | Detailed Design → Personalization Preview Component | `PersonalizationPreview.tsx` | Component test: Render name text overlay, verify positioning |
| **AC-3.4.4** (Cart preview match) | Dependencies → Cart Storage | `PersonalizationPreview` + Cart component | Integration test: Compare preview with cart item display |

## Risks, Assumptions, Open Questions

### Risks

1. **Risk: localStorage Unavailable (Private Browsing Mode)**
   - **Impact**: Medium - Personalization data won't persist across navigation
   - **Mitigation**: Graceful fallback to in-memory state, display user-friendly message if storage fails
   - **Probability**: Low - Most browsers support localStorage, but Safari private mode may block it

2. **Risk: Preview Performance with Real-time Updates**
   - **Impact**: Medium - Slow preview updates could degrade UX
   - **Mitigation**: Debounce preview updates if needed, optimize image rendering (CSS filters vs image swaps)
   - **Probability**: Low - React 19 and modern browsers handle updates efficiently

3. **Risk: Variant Data Structure Mismatch**
   - **Impact**: High - Print time calculations may fail if product data structure doesn't match expected format
   - **Mitigation**: TypeScript interfaces enforce structure, validate product data on load, provide fallback to base time
   - **Probability**: Medium - Depends on product data creation process

4. **Risk: Storage Key Collision with Other Features**
   - **Impact**: Low - Storage key `makelocal_personalization` may conflict with other localStorage keys
   - **Mitigation**: Use namespaced storage keys, document all storage keys in architecture docs
   - **Probability**: Low - Key is specific and namespaced

### Assumptions

1. **Assumption: Product Data Includes Variant Definitions**
   - Products that support personalization will have `variants` array in product data
   - Products without variants will use base `estimatedPrintTime`
   - **Validation**: Verify product data structure before Epic 3 implementation

2. **Assumption: Epic 2 Product Detail Component Exists**
   - Product detail view (Epic 2, Story 2.5) will be implemented before Epic 3
   - Product detail component will provide integration point for personalization form
   - **Validation**: Confirm Epic 2 completion before starting Epic 3

3. **Assumption: localStorage Storage Quota Sufficient**
   - Browser localStorage quota (typically 5-10MB) is sufficient for personalization data
   - Personalization data is small (< 1KB per product)
   - **Validation**: Monitor storage usage, implement cleanup if needed

4. **Assumption: Color Application Method (CSS Filter vs Image Swap)**
   - CSS filters or image swaps will provide acceptable color preview quality
   - If variant-specific images exist, use image swap; otherwise use CSS filter
   - **Validation**: Test color application methods with design team, verify visual quality

### Open Questions

1. **Question: Should Personalization Data Persist Across Browser Sessions?**
   - **Current Decision**: Yes, using localStorage (persists across sessions)
   - **Alternative**: Use sessionStorage (clears on tab close)
   - **Resolution**: Use localStorage for better UX, cleared on staff reset

2. **Question: What Happens if User Personalizes Same Product Multiple Times?**
   - **Current Decision**: Latest personalization overwrites previous (timestamp updated)
   - **Alternative**: Keep history of personalizations
   - **Resolution**: Single personalization per product (simpler, meets requirements)

3. **Question: Should Preview Component Support Animation Transitions?**
   - **Current Decision**: Immediate updates (no animation) for performance
   - **Alternative**: Fade/transition animations for smoother UX
   - **Resolution**: Start with immediate updates, add animations if time permits

4. **Question: How Should Invalid Characters in Name Input Be Handled?**
   - **Current Decision**: Block invalid characters via validation regex
   - **Alternative**: Sanitize/remove invalid characters automatically
   - **Resolution**: Block invalid characters, show error message (better UX, prevents confusion)

5. **Question: Should Print Time Display Show Hours for Long Print Times?**
   - **Current Decision**: Display in minutes (e.g., "120 minutes")
   - **Alternative**: Auto-format to hours if > 60 minutes (e.g., "2 hours")
   - **Resolution**: Start with minutes, add hours formatting if needed

## Test Strategy Summary

### Test Levels

1. **Unit Tests**
   - **ValidationService**: Test name validation (length, format, edge cases)
   - **VariantCalculatorService**: Test print time calculation (variant exists, no variant, invalid color)
   - **PersonalizationStorageService**: Test save/load/clear operations, error handling

2. **Component Tests**
   - **PersonalizationForm**: Test form rendering, input handling, validation, submit behavior
   - **PrintTimeDisplay**: Test time display formatting, variant time updates
   - **PersonalizationPreview**: Test preview rendering, real-time updates, color application

3. **Integration Tests**
   - **Product Detail → Personalization Form**: Test form opens from product detail, initial values restored
   - **Storage Persistence Flow**: Test save data, navigate away, return, verify restoration
   - **Reset Integration**: Test staff reset clears personalization storage
   - **Cart Integration** (Epic 4): Test personalized product added to cart with correct data

4. **Performance Tests**
   - **Preview Update Latency**: Measure time from state change to preview render (< 100ms target)
   - **Form Mount Time**: Measure time from component mount to interactive (< 200ms target)
   - **Storage Operations**: Verify localStorage operations are synchronous (no delays)

5. **Accessibility Tests**
   - **Keyboard Navigation**: Test form inputs and color swatches navigable via keyboard
   - **Screen Reader**: Test form labels, error messages, color selection announcements
   - **WCAG 2.1 AA**: Verify color contrast, focus indicators, ARIA labels

### Test Coverage Goals

- **Unit Tests**: 90%+ coverage for utility functions (validation, storage, calculator)
- **Component Tests**: 80%+ coverage for React components
- **Integration Tests**: All critical user flows covered (personalization → cart → checkout)
- **Performance Tests**: All NFR targets verified (preview updates, form mount time)

### Test Frameworks

- **Unit/Component Tests**: React Testing Library + Vitest (or Jest)
- **Integration Tests**: Playwright or Cypress (end-to-end flows)
- **Performance Tests**: Lighthouse CI, WebPageTest (bundle size, LCP)
- **Accessibility Tests**: axe-core, WAVE, manual keyboard/screen reader testing

### Critical Test Scenarios

1. **Happy Path**: User enters name, selects color, preview updates, form submits successfully
2. **Validation Errors**: Name too long, invalid characters, no color selected
3. **Storage Persistence**: Save data, refresh page, verify restoration
4. **Storage Unavailable**: Test fallback behavior when localStorage blocked
5. **Variant Print Time**: Test print time updates when color changes (with/without variants)
6. **Reset Integration**: Test staff reset clears all personalization data
7. **Multiple Products**: Test personalization data isolation across products
8. **Performance**: Test preview updates meet < 100ms latency requirement

### Edge Cases

- Empty name input (should show error)
- Name exactly 12 characters (should be valid)
- Name 13+ characters (should show error)
- Invalid characters in name (should show error)
- No color selected (should show error)
- Product without variants (should use base print time)
- Product with variants but selected color not in variants (should use base time)
- localStorage quota exceeded (should handle gracefully)
- Product data missing variants array (should use base time)
- Preview component receives invalid colorId (should handle gracefully)

