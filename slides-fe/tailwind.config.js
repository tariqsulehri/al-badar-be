// Theme colours are CSS variables (switched per data-theme), so Tailwind can't
// split them into channels. color-mix lets opacity modifiers like
// `bg-brand-muted/40` work; without a modifier <alpha-value> is 1 (the plain colour).
const themed = (name) => `color-mix(in srgb, var(--${name}) calc(<alpha-value> * 100%), transparent)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Poppins"', '"Segoe UI"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"SFMono-Regular"', "Consolas", "monospace"],
      },
      colors: {
        brand:        themed("brand"),
        "brand-strong": themed("brand-strong"),
        "brand-muted": themed("brand-muted"),
        "brand-accent": themed("brand-accent"),
        "on-brand":   themed("on-brand"),
        danger:       themed("danger"),
        "danger-muted": themed("danger-muted"),
        success:      themed("success"),
        "success-muted": themed("success-muted"),
        warning:      themed("warning"),
        "warning-muted": themed("warning-muted"),
        info:         themed("info"),
        "info-muted": themed("info-muted"),
        "table-head": themed("table-head"),
        "row-hover":  themed("row-hover"),
        "bg-canvas":  themed("bg-canvas"),
        "bg-surface": themed("bg-surface"),
        "bg-surface-strong": themed("bg-surface-strong"),
        "bg-dark":    themed("bg-dark"),
        "text-primary":   themed("text-primary"),
        "text-secondary": themed("text-secondary"),
        "text-muted":     themed("text-muted"),
        "border-soft":    themed("border-soft"),
        "border-strong":  themed("border-strong"),
      },
      borderRadius: {
        card:    "var(--radius-card)",
        control: "var(--radius-control)",
      },
      boxShadow: {
        soft:   "var(--shadow-soft)",
        strong: "var(--shadow-strong)",
      },
      maxWidth: {
        shell: "var(--app-shell-width)",
      },
    },
  },
  plugins: [],
}
