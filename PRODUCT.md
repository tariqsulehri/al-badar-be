# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Media Operations Managers:** Internal operators responsible for managing outdoor/billboard/digital signage assets, monitoring inventory, tracking pricing, and building presentations for clients.
- **Sales & Account Executives:** Team members who need to quickly search billboard inventory across provinces, cities, and areas, review commercial terms, select target slides, and export clean, branded PowerPoint decks (PPTX) for client pitches.
- **System Administrators:** Administrative users who manage province, city, area taxonomy, customer/supplier parties, and system access.

## Product Purpose

Slides Control Center ("Al-Badar") is a specialized enterprise media inventory management and presentation generation platform. It transforms raw billboard/digital signage inventory into structured records and automated PowerPoint presentations ready for client proposals.

## Positioning

Unlike generic CRM or spreadsheet tools, Slides Control Center provides a domain-specific outdoor advertising workflow: geospatial tracking, traffic-facing orientation, dayparting/screen metrics, supplier-versus-customer pricing margins, and automated PowerPoint slide deck generation in a single streamlined interface.

## Operating Context

- Used in desktop browser environments during operational planning, sales meetings, and proposal drafting.
- Frequently used for multi-row selection, filtering across geographic hierarchies (Province → City → Area → Sub-Area), and batch generation of PPTX presentations.
- Fast data entry and retrieval are paramount: low-latency searches, immediate pagination feedback, and responsive state persistence.

## Capabilities and Constraints

- **Slide Inventory Management:** Capture code, location, supplier, dimensions, lighting, traffic facing, and pricing.
- **Digital & Static Support:** Tailored fields for digital screens (SMD, steamers, working hours, spot rate, duration) and static boards.
- **Taxonomy Management:** Hierarchical setup for Provinces, Cities, Areas, and Sub-Areas.
- **Party Management:** Client and supplier directory with financial identifiers (NTN, GST, GL Code).
- **Presentation Export:** Batch PPTX deck generation directly from selected slides using `pptxgenjs`.
- **Authentication & Authorization:** Role-based access control (Admin, Manager, User) with token persistence.

## Brand Commitments

- **Name:** Slides Control Center (Al-Badar Media Operations)
- **Voice:** Professional, operational, concise, high-clarity data presentation.
- **Design Language:** Modern data-dense workspace with frosted glass accents, subtle gradients, and three polished color themes (Ocean, Carbon, Plum).

## Product Principles

1. **Data-Dense Yet Scannable:** Key metadata (code, location, status, prices) must be legible in dense table views without horizontal clutter.
2. **Speed Over Ceremony:** Quick actions (search-as-you-type, batch selection, instant export) take priority over complex wizards.
3. **Consistent Taxonomy:** Every slide ties to canonical geographical entities to ensure client decks never have spelling drift.
4. **Resilient Export:** PPTX deck generation operates client-side with clean error handling and immediate status feedback.

## Accessibility & Inclusion

- Keyboard navigability across tables, search bars, and dropdown menus.
- High contrast text across light (Ocean) and dark (Carbon, Plum) themes.
- Explicit form field labeling and clear focus rings for all interactive controls.
