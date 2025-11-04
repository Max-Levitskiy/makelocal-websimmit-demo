# 🌍 Project: MakeLocal WebSummit Microsite

**Goal:** A visually striking, UI-only demo website for the **MakeLocal** platform to showcase at **Web Summit Lisbon 2025** (Alpha track).
**Purpose:** Demonstrate how MakeLocal connects local 3D printers, designers, coordinators, and customers — turning *digital ideas into physical things* right at the event booth. Visitors can browse products, personalize one, “place an order,” and watch a simulated print process happen live.

---

## 🧩 Background: What is MakeLocal

**MakeLocal ([https://makelocal.eu](https://makelocal.eu))** is building an *“Uber for 3D printing”* — a distributed manufacturing platform that connects:

* **Customers** who need physical products or custom prints,
* **Coordinators** who run niche online shops powered by MakeLocal’s API,
* **Makers** who own 3D printers and produce parts locally,
* **Designers** who create printable models,
* **Couriers** who deliver locally,
* **Production leads** who coordinate larger manufacturing runs.

MakeLocal lets anyone create a local production flow using existing resources — turning the global supply chain into *a network of small, fast, sustainable factories.*

The Web Summit booth will showcase MakeLocal’s vision in action: **instant, on-site manufacturing** and **live product personalization**.

---

## 🎯 The Goal of the Microsite

This website is not just a catalog — it’s a *storyboard of local manufacturing.*

We want visitors to:

1. **Order a custom 3D-printed item at the booth** (simulated checkout + progress tracking).
2. **Understand the MakeLocal model** — how local manufacturing works, who’s involved, and why it matters.
3. **See how Coordinators can create their own shops** using MakeLocal.
4. **Leave contact info** to join the ecosystem after the event.
5. **Feel the magic** of seeing an idea printed right next to them.

---

## ✨ Design Vision

### Tone & Style

Modern, warm, and tech-crafty — blending **digital precision with local creativity.**
Think of a cross between **Apple’s clarity**, **Notion’s calmness**, and **Maker Faire’s playfulness.**

### Visual Identity

* **Colors:** Clean white/dark base, electric accent (teal-green or orange-coral), subtle gray for depth.
* **Shapes:** Rounded corners, tactile shadows, “material” feeling — it should look 3D-friendly.
* **Imagery:** Product photos or renders on plain backgrounds; optional soft-motion “print lines” in hero banner.
* **Typography:** Large, confident sans serif — crisp for headlines, readable for body.
* **Mood:** Transparent, local, alive — you should *feel the motion* of making.

### Layout

Minimal navigation, generous spacing, high visual hierarchy.
The flow should lead from curiosity → interaction → understanding → engagement.

---

## 🧭 Key Experience Flow

1. **Visitor scans a QR code** at the booth → lands on the microsite.
2. **Landing page:** short hero message, catalog of 3D-printable products, and “see it printed live” promise.
3. **Catalog browsing:** six demo items (keychains, clips, stands, badges, mascots, etc.), each printable within 20–30 minutes.
4. **Personalization:** simple name or color selection.
5. **Checkout:** name and optional email; payment simulated (“pay at booth” option only).
6. **Order status page:** shows a simulated progress bar (Queued → Printing → Cooling → Ready).
   A “live queue” banner scrolls across the top, giving the illusion of activity.
7. **Coordinator mode toggle:** opens a side panel showing “how the system works” (API mock, event stream, etc.).
8. **Educational sections:**

   * “How MakeLocal Works” (simple 4-step infographic)
   * “Meet the Roles” (cards for each role)
   * “Become a Coordinator” (pitch + lead form)
9. **Contact section:** Web Summit booth info, map, socials, and lead form submission success message.

---

## 🧱 Website Structure

### Top Navigation

* **Logo** (MakeLocal)
* **Catalog**
* **How It Works**
* **Roles**
* **For Coordinators**
* **Contact**
* Right side: *Order Status* modal + *Coordinator Mode* toggle

---

### 1. Home / Catalog

**Hero Section**

> *Headline:* “Make it here.”
> *Subtext:* “Pick a product, personalize it, and see it printed live at our Web Summit booth.”
> *CTAs:* “Browse Catalog” • “Talk to us at Booth [TBD]”
> *Visuals:* looping animation of 3D printing lines or slow filament extrusion.

**Product Grid**
Grid of 6–9 tiles with product renders, titles, prices, and quick ETAs (e.g., “~25 min print”).
Example SKUs:

* Personalized Keychain
* Cable Clip
* Mini Phone Stand
* Badge Tag
* Mascot Token
* QR Key Fob

**Live Queue Strip**
Subtle ticker:

> “Now printing: Keychain for Sara (42%). Next: Clip for João. Ready for pickup: TOKEN-7B3.”

**CTA:** “See how it works ↓”

---

### 2. Product Page

Large product image + small gallery.
Short blurb about the design.
Customization panel:

* **Text input:** name or initials (max 12 chars)
* **Color swatches:** 5–6 options
* **Material badge:** PLA (fast print)
  Static price (e.g. €5), estimated print time (e.g. 25 min).
  CTA: “Add to Queue” → opens mini cart → “Proceed to Checkout”.

---

### 3. Checkout

Simple, light form:

* Name (required)
* Email (optional)
* Note (optional)
* Payment (radio buttons: *Pay at Booth* [selected], *Demo payment* [disabled])
  Confirmation text:

> “This is a live demo. Orders placed here will be produced at our Web Summit booth.”

CTA: “Place Demo Order” → Confirmation page.

---

### 4. Order Status

Thank-you message, pickup code, order number.
Progress tracker:

> Queued → Printing → Cooling → Ready

Timelapse thumbnails cycle (static images).
“Find our booth” button → scrolls to contact map.
When Ready → “Collected?” button (for demo).
Persistent queue banner at top for continuity.

---

### 5. How MakeLocal Works

Infographic-style section with four icons:

1. **Request:** Customer orders locally.
2. **Coordinate:** Shop routes job to nearby maker.
3. **Produce:** Maker prints or manufactures.
4. **Deliver:** Local handoff or courier.

Subtext:

> “MakeLocal connects ideas with makers — reducing waste, shipping, and waiting time.”

---

### 6. Roles

Cards grid with icons or mini illustrations:

* **Customer** — orders a product.
* **Coordinator** — runs a niche shop and connects makers.
* **Maker** — produces the part on their printer.
* **Designer** — creates printable models.
* **Courier** — delivers locally.
* **Production Lead** — scales and ensures quality.

CTA: “Become a Coordinator” → /coordinators

---

### 7. For Coordinators

Pitch section:

> *Headline:* “Launch your niche shop on MakeLocal.”
> *Sub:* “You bring the idea and the audience. We handle the production, fulfillment, and local coordination.”

Bullet values:

* Add products with personalization
* Use local makers for faster fulfillment
* Offer pickup at events or local delivery
* Start small, scale easily

Coordinator mode demo drawer:
Tabs: Catalog • Orders • Job Steps (mock only)

**Lead Form**

> Fields: Name*, Email*, Company, “What would you sell?”
> CTA: “Join the Network”
> Success message: “Thanks! We’ll reach out after Web Summit.”

---

### 8. Contact

Short section with booth and contact info:

> “Find us at Web Summit Lisbon, Nov 10–13 — Alpha Area, Booth [TBD].”
> Buttons: “Locate our booth” (opens booth map image) • “Email us” (mailto)
> Social icons and footer navigation.

Footer tagline:

> “Produced locally, with MakeLocal.”

---

## 💡 Key Messaging Themes

**1. Local manufacturing, global reach**

> “What if you could print your product right where your customer is?”

**2. From design to delivery, instantly**

> “Upload, produce, and deliver — no warehouse needed.”

**3. Sustainable by design**

> “No shipping halfway around the world. No excess stock. Just what’s needed, made locally.”

**4. Empowering creators**

> “Anyone can become a Coordinator and launch their own 3D-printed product line.”

**5. Live proof at Web Summit**

> “Watch it print while you wait.”

---

## 🎁 Emotional Storytelling

The site should *feel alive*.
When the print queue moves, it creates anticipation.
When the product is “ready,” it’s gratifying — a microcosm of MakeLocal’s mission: **shorten the distance between imagination and reality.**

Visitors should leave the site thinking:

> “I can create my own shop on MakeLocal and make things real.”

---

## 📋 Deliverables

1. **Public microsite** hosted on makelocal.eu or subdomain (e.g., `websummit.makelocal.eu`)
2. **Responsive UI only** (Next.js or static generator)
3. **6+ products**, personalization + fake checkout
4. **Simulated live queue + order status flow**
5. **“How it works”** & **“Roles”** pages
6. **Coordinator mode + lead form** (UI-only)
7. **Booth contact section**
8. **Consistent branding + storytelling visuals**

---

## 🚀 Purpose Beyond Web Summit

After the event, the same microsite can evolve into:

* A **template for Coordinators** who want to launch their own shops using MakeLocal’s API.
* A **marketing landing page** for partnerships and onboarding local makers.
* A **demo environment** to show investors how MakeLocal orchestrates real-world production flows.
