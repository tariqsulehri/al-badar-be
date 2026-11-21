---
name: Slides Control Center
description: Enterprise media operations and digital billboard deck platform
colors:
  primary: "#0f766e"
  primary-strong: "#115e59"
  primary-muted: "rgba(15, 118, 110, 0.10)"
  accent: "#f59e0b"
  danger: "#dc2626"
  success: "#16a34a"
  neutral-bg: "#f2f6fb"
  neutral-surface: "rgba(255, 255, 255, 0.88)"
  neutral-surface-strong: "#ffffff"
  text-primary: "#0f1e36"
  text-secondary: "#4d6280"
  text-muted: "#8896ae"
  border-soft: "rgba(148, 163, 184, 0.20)"
  border-strong: "rgba(100, 116, 139, 0.32)"
typography:
  display:
    fontFamily: '"Avenir Next", "Segoe UI", sans-serif'
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  headline:
    fontFamily: '"Avenir Next", "Segoe UI", sans-serif'
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif'
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  label:
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif'
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.10em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "10px 18px"
  button-outlined:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "10px 18px"
---

# Design System: Slides Control Center

## Overview

**Creative North Star: "The Aviation Glass Cockpit"**

Slides Control Center delivers an executive, high-density media operations interface designed for rapid situational awareness and high-volume billboard inventory dispatch. It bridges the precision of tabular operational tools with the aesthetic polish of modern glassmorphism. Surfaces feel luminous, structured, and deliberate: dark gradient topbars anchor navigation while floating cards, soft borders, and contextual badge tags establish hierarchy without visual noise.

The system supports three native color worlds via CSS variables:
1. **Ocean (Default Light):** Deep sea teal (`#0f766e`), warm amber gold (`#f59e0b`), and cool ice-blue slate surfaces.
2. **Carbon (Dark Neutral):** GitHub-inspired charcoal canvas (`#0d1117`), electric blue accents (`#58a6ff`), and crisp borders.
3. **Plum (Dark Purple):** Refined deep violet atmosphere (`#13111c`), lavender brand tones (`#a78bfa`), and rose quartz highlights (`#fb7185`).

**Key Characteristics:**
- High-density data presentation with generous touch-targets and zero horizontal crowding.
- Luminous glass surface cards (`backdrop-blur-xl`, `border border-border-soft`).
- Instant visual status mapping (Active / Inactive badges, Selection chips, Eyebrow indicators).
- Unified Tailwind utility styling layered over dynamic theme custom properties.

## Colors

The palette combines deep jewel tones with crisp neutral canvases to ensure high-contrast readability in dense tabular datasets.

### Primary
- **Deep Muted Teal** (`#0f766e` / `var(--brand)`): Primary action trigger, active states, and brand anchor.
- **Teal Shade Deep** (`#115e59` / `var(--brand-strong)`): Hover states, emphasis gradients, and button active states.
- **Teal Muted Tint** (`rgba(15, 118, 110, 0.10)` / `var(--brand-muted)`): Subtle badge backgrounds, table row hover washes, and focus ring halos.

### Secondary
- **Amber Gold** (`#f59e0b` / `var(--brand-accent)`): Selected record highlights, status warnings, and brand emblem background.

### Tertiary
- **Crimson Danger** (`#dc2626` / `var(--danger)`): Deletion triggers, validation errors, and inactive alerts.
- **Emerald Success** (`#16a34a` / `var(--success)`): Active status badges, completed PPTX generation toasts, and verified toggles.

### Neutral
- **Canvas Background** (`#f2f6fb` / `var(--bg-canvas)`): Deep page backdrop with subtle radial gradients.
- **Frosted Surface** (`rgba(255, 255, 255, 0.88)` / `var(--bg-surface)`): Main content cards with 24px backdrop blur.
- **High-Density Solid** (`#ffffff` / `var(--bg-surface-strong)`): Input backgrounds, dropdown menus, and active controls.
- **Primary Text** (`#0f1e36` / `var(--text-primary)`): Headings, table data, and active values (≥7:1 contrast ratio).
- **Secondary Text** (`#4d6280` / `var(--text-secondary)`): Field labels, table headers, and metadata captions.
- **Muted Text** (`#8896ae` / `var(--text-muted)`): Placeholders, disabled states, and inactive timestamps.

### Named Rules
**The 10% Brand Rule.** The primary teal accent is reserved for primary actions, selected indicators, and brand marks. Table content and secondary actions must never compete with brand anchors.

**The Semantic State Rule.** Status colors (Emerald for Active, Crimson for Danger, Amber for Selected) are strictly semantic and must never be repurposed as decorative ornament.

## Typography

**Display Font:** `Avenir Next`, `Segoe UI`, sans-serif
**Body Font:** `IBM Plex Sans`, `Segoe UI`, sans-serif
**Monospace / Data Font:** `SFMono-Regular`, Consolas, `Liberation Mono`, monospace

**Character:** Technical, confident, and highly legible across dense data grids and compact forms.

### Hierarchy
- **Display** (700 weight, 24px / 1.5rem, line-height 1.15, -0.03em tracking): Main page titles and control center banners.
- **Headline** (700 weight, 20px / 1.25rem, line-height 1.2, -0.02em tracking): Section headers, modal titles, and stat card values.
- **Title** (600 weight, 16px / 1rem, line-height 1.3, -0.01em tracking): Card headlines, table group titles, and dialog headers.
- **Body** (400 weight, 14px / 0.875rem, line-height 1.5): Standard table rows, inputs, descriptions, and dropdown items.
- **Label** (700 weight, 11px / 0.6875rem, line-height 1.4, 0.10em tracking, uppercase): Form field labels, table headers, and eyebrow tags.
- **Code / Data** (500 weight, 12px, line-height 1.4): Slide inventory codes, MongoDB ObjectIDs, and numeric dimensions.

### Named Rules
**The Uppercase Eyebrow Rule.** All section subtitles and table column headers must be uppercase with `0.10em` tracking and `11px` font size for instantaneous visual categorization.

## Layout

The application uses an anchored header layout centered within a max-width shell:
- **Max Width Shell:** `1380px` (`var(--app-shell-width)`), padded `20px` horizontal, auto-centered.
- **Floating Topbar:** Centered with `12px` top margin, `20px` border radius, and fixed elevation over scrolling content.
- **Card Spacing:** 16px standard gap between section cards, 12px gap in stat grids.
- **Form Grid System:** 12-column responsive layout (`col-span-12`, `md:col-span-6`, `md:col-span-4`, `md:col-span-3`).
- **Responsive Breakpoints:**
  - `desktop` (≥1100px): Full 4-column stat cards and horizontal toolbar.
  - `tablet` (768px - 1099px): 2-column stat cards, collapsed header actions.
  - `mobile` (<768px): Single-column stacks, full-width inputs, touch-adapted table view.

## Elevation & Depth

Depth is established primarily through **luminous surface layering and backdrop filters** rather than heavy drop shadows:
- **Canvas Layer:** `z-0` background with fixed radial light spots.
- **Card Layer:** `z-1` glass cards with `backdrop-filter: blur(24px)` and `border: 1px solid var(--border-soft)`.
- **Floating Navigation:** `z-40` with `0 8px 40px rgba(0, 0, 0, 0.22)`.
- **Dropdown & Modal Layer:** `z-50` with `0 24px 60px rgba(15, 23, 42, 0.16)`.

### Named Rules
**The Surface-Over-Shadow Rule.** Depth is created through translucent white/slate surface fills against the canvas; shadows exist strictly to lift actionable layers (buttons, dropdowns, floating modals).

## Shapes

- **Cards & Section Shells:** `16px` border-radius (`var(--radius-card)`), with smooth 1px borders.
- **Input Fields & Buttons:** `16px` border-radius (`rounded-2xl`), matching the card silhouette.
- **Navigation Shell:** `20px` border-radius for the floating topbar.
- **Dropdown Menus:** `16px` border-radius with `1.5px` inner padding.
- **Badges & Pills:** `9999px` full capsule radius (`rounded-full`).

## Components

### Buttons
- **Primary:** `bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700`, white text, `16px` radius, `10px 18px` padding. Subtle lift on hover (`-translate-y-0.5`).
- **Outlined:** `border border-border-soft hover:border-brand`, text in `var(--text-primary)`, hover background `var(--brand-muted)`.
- **Danger:** `border border-danger text-danger hover:bg-red-500/10` or solid `bg-danger text-white`.

### Navigation Topbar
- **Shell:** Floating translucent gradient with frosted glass backdrop, amber brand monogram icon.
- **Links:** Clean text buttons with hover highlight `rgba(255, 255, 255, 0.12)`.
- **Status Chip:** Right-aligned user identity chip (`rounded-full`, role indicator).

### Dropdown Menus
- **Trigger:** Controlled click on nav button with automatic click-away and Escape dismiss.
- **Container:** `bg-bg-surface backdrop-blur-xl border border-border-soft rounded-2xl shadow-strong`.
- **Items:** `w-full text-left px-3.5 py-2 text-sm font-semibold rounded-xl hover:bg-brand-muted hover:text-brand-strong`.

### Inputs & Selects
- **Height:** 56px standard (`h-14`) for primary forms, 40px (`h-10`) for dense filters.
- **Border:** 1px `var(--border-soft)`, transitioning to `var(--brand)` with 2px ring halo on focus.
- **Selects:** React-Select styled to match input radius, surface color, and brand highlights.

### Data Tables
- **Header:** Sticky top, `bg-brand-muted/30`, uppercase 11px headers, crisp divider.
- **Rows:** Alternating subtle hover states (`hover:bg-brand-muted/20`), mono font for IDs and codes.
- **Selection:** Native checkbox with brand accent color.
- **Pagination:** Bottom pagination bar with rows-per-page selector, count indicator, and direct page-jump input.

## Do's and Don'ts

### Do:
- **Do** wrap all interactive form elements in explicit label headers with mandatory asterisks.
- **Do** use `var(--brand)` and semantic Tailwind aliases for colors rather than hardcoded hex codes.
- **Do** preserve the 12-column grid pattern for responsive form layouts across different devices.
- **Do** keep table IDs and numerical dimensions in monospace font for vertical scanning.
- **Do** test color contrast in both light (Ocean) and dark (Carbon/Plum) modes before shipping UI.

### Don't:
- **Don't** reintroduce `@mui/material` components or raw emotion styles; use Tailwind utility classes exclusively.
- **Don't** use pure black (`#000000`) for text or borders; use `--text-primary` (`#0f1e36`) and `--border-soft`.
- **Don't** create nested modals or competing drop-shadows; keep the visual elevation hierarchy flat and clean.
- **Don't** allow tables to overflow horizontally without clean responsive container wrappers.
- **Don't** hardcode pixel widths on form inputs; use flexible column spans and `width: 100%`.
