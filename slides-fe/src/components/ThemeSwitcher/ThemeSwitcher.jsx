import React, { useState, useEffect } from "react";
import "./ThemeSwitcher.css";

const THEMES = [
  {
    id:     "ocean",
    label:  "Ocean",
    desc:   "Light",
    dot:    "#0f766e",
    chips:  ["#0f766e", "#f59e0b", "#f2f6fb"],
  },
  {
    id:     "carbon",
    label:  "Carbon",
    desc:   "Dark",
    dot:    "#58a6ff",
    chips:  ["#58a6ff", "#f0b429", "#161b22"],
  },
  {
    id:     "plum",
    label:  "Plum",
    desc:   "Dark Purple",
    dot:    "#a78bfa",
    chips:  ["#a78bfa", "#fb7185", "#18142a"],
  },
];

const THEME_EVENT = "ui-theme-change";

const readStoredTheme = () => {
  try {
    return localStorage.getItem("ui-theme") || "ocean";
  } catch {
    return "ocean";
  }
};

const applyTheme = (id) => {
  document.documentElement.setAttribute("data-theme", id);
  try {
    localStorage.setItem("ui-theme", id);
  } catch {
    // storage unavailable (private mode etc.) — theme still applies for this session
  }
  // Keep every mounted ThemeSwitcher (nav + page) in sync.
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: id }));
};

const ThemeSwitcher = ({ variant = "dots" }) => {
  const [active, setActive] = useState(readStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", readStoredTheme());
    const onThemeChange = (e) => setActive(e.detail);
    window.addEventListener(THEME_EVENT, onThemeChange);
    return () => window.removeEventListener(THEME_EVENT, onThemeChange);
  }, []);

  const handleSelect = (id) => applyTheme(id);

  if (variant === "bar") {
    return (
      <div className="theme-bar">
        <span className="theme-bar__heading">Appearance</span>
        <div className="theme-bar__options">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`theme-card${active === t.id ? " theme-card--on" : ""}`}
              onClick={() => handleSelect(t.id)}
              title={t.label}
              aria-pressed={active === t.id}
            >
              <div className="theme-card__preview">
                {t.chips.map((c, i) => (
                  <span key={i} className="theme-card__chip" style={{ background: c }} />
                ))}
              </div>
              <div className="theme-card__meta">
                <span className="theme-card__name">{t.label}</span>
                <span className="theme-card__desc">{t.desc}</span>
              </div>
              {active === t.id && <span className="theme-card__check">✓</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // dots: "dots" for dark surfaces, "header" for the light app header
  return (
    <div
      className={`theme-switcher${variant === "header" ? " theme-switcher--header" : ""}`}
      role="group"
      aria-label="Color theme"
    >
      {THEMES.map((t) => (
        <button
          key={t.id}
          className={`theme-swatch${active === t.id ? " theme-swatch--on" : ""}`}
          style={{ "--sw": t.dot }}
          onClick={() => handleSelect(t.id)}
          title={t.label}
          aria-pressed={active === t.id}
        />
      ))}
    </div>
  );
};

export default ThemeSwitcher;
