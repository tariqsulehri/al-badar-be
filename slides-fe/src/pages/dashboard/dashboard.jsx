import React from "react";

const stats = [
  { label: "Active modules", value: "04", detail: "Slides, parties, setup, users" },
  { label: "Design tone", value: "Modern", detail: "Glass surfaces, stronger hierarchy, clearer navigation" },
  { label: "Workflow state", value: "Ready", detail: "Prepared for feature additions and refinements" },
  { label: "Primary goal", value: "Scale", detail: "A cleaner shell for future feature work" },
];

const dashboardSections = [
  {
    title: "Operations Focus",
    body: "Use this area as the launch point for slide inventory, quote flow, and setup configuration.",
  },
  {
    title: "Design Upgrade",
    body: "The dashboard now matches a more professional SaaS product language instead of a starter-admin appearance.",
  },
  {
    title: "Feature Readiness",
    body: "The updated shell and shared visual rules make future UI improvements faster and more consistent.",
  },
];

const Dashboard = () => {
  return (
    <section className="page-section surface-grid">
      <header className="page-header">
        <div>
          <span className="page-header__eyebrow">Executive Overview</span>
          <h1>Dashboard</h1>
          <p>
            A cleaner command surface for managing media inventory, operational setup,
            and user workflows without the old admin-panel look.
          </p>
        </div>
      </header>

      <div className="stats-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="page-card stat-card">
            <span className="stat-card__label">{stat.label}</span>
            <div className="stat-card__value">{stat.value}</div>
            <div className="stat-card__detail">{stat.detail}</div>
          </article>
        ))}
      </div>

      <div className="surface-grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <article className="page-card" style={{ padding: "26px" }}>
          <span className="page-header__eyebrow">Workspace Narrative</span>
          <h2 style={{ marginTop: 14 }}>A stronger foundation for operational screens</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 0 }}>
            The interface now uses a more intentional product language: elevated cards,
            restrained color contrast, professional typography, and more considered spacing.
            That means future screens can inherit a better baseline instead of needing one-off styling.
          </p>
        </article>

        <article className="page-card" style={{ padding: "26px", background: "linear-gradient(160deg, rgba(15,118,110,0.08), rgba(245,158,11,0.08))" }}>
          <span className="page-header__eyebrow">Next Step</span>
          <h2 style={{ marginTop: 14 }}>Refine feature screens progressively</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 0 }}>
            Shared shell and controls are modernized. The next layer is feature-by-feature form
            cleanup so data-heavy screens match the same level of polish.
          </p>
        </article>
      </div>

      <div className="surface-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        {dashboardSections.map((section) => (
          <article key={section.title} className="page-card" style={{ padding: "22px" }}>
            <h3 style={{ marginTop: 0, marginBottom: 10 }}>{section.title}</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>{section.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
