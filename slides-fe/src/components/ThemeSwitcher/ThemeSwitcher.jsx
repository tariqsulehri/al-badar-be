import React, { useState, useEffect } from "react";
import "./ThemeSwitcher.css";

export const THEMES = [
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

const applyTheme = (id) => {
  document.documentElement.setAttribute("data-theme", id);
  localStorage.setItem("ui-theme", id);
};

const ThemeSwitcher = ({ variant = "dots" }) => {
  const [active, setActive] = useState(
    () => localStorage.getItem("ui-theme") || "ocean"
  );

  // Apply on mount
  useEffect(() => { applyTheme(active); }, []);

  const handleSelect = (id) => {
    setActive(id);
    applyTheme(id);
  };

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

  // dots (nav variant)
  return (
    <div className="theme-switcher" role="group" aria-label="Color theme">
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
