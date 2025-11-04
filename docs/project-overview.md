# Project Overview

## Purpose
Create a Web Summit demo microsite that showcases MakeLocal’s local 3D-print manufacturing experience and coordinator ecosystem.

## Key Capabilities (Planned)
- Product catalog with personalization affordances
- Simulated order flow with status tracker (Queued → Printing → Cooling → Ready)
- Coordinator mode to describe API-powered shop tools
- Contact and lead capture for post-event follow-up

## Current Status
- Hero, live queue banner, and product cards rendered in `page.tsx`
- Design tokens defined in `globals.css` and STYLEGUIDE.md
- API reference stubs located in `docs/makelocal-api/`

## Next Steps
1. Flesh out personalization UI and fake checkout flow
2. Implement order status simulation with animated progress
3. Build coordinator mode drawer referencing API docs
4. Polish responsive layout and load actual design assets from `/design`

## References
- Planning: DESCRIPTION.md
- Style: STYLEGUIDE.md
- API: docs/makelocal-api/
