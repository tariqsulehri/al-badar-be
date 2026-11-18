import React from "react";
import PropTypes from "prop-types";

/**
 * Standard page header card used by list pages and the dashboard:
 *   ┌───────────────────────────────────────────────────────┐
 *   │ Title  911 slides · meta                    [actions] │
 *   ├───────────────────────────────────────────────────────┤
 *   │ toolbar (search, bulk actions…)  — optional grey band │
 *   └───────────────────────────────────────────────────────┘
 * Solid surface + theme tokens only, so it stays readable in every theme.
 */
const PageHeader = ({ title, count, noun, plural, meta, subtitle, actions, children }) => {
  const showCount = typeof count === "number" && noun;

  return (
    <header className="overflow-hidden rounded-2xl border border-border-soft bg-bg-surface shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-[22px] font-semibold tracking-tight text-text-primary">{title}</h1>
            {(showCount || meta) && (
              <span className="text-sm text-text-secondary">
                {showCount && (
                  <>
                    <span className="num font-medium text-text-primary">{count.toLocaleString()}</span>{" "}
                    {count === 1 ? noun : plural || `${noun}s`}
                  </>
                )}
                {meta && (
                  <span className="text-text-muted">
                    {showCount ? " · " : ""}
                    {meta}
                  </span>
                )}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-0.5 text-sm text-text-secondary">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>

      {children && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-soft bg-table-head px-5 py-3">
          {children}
        </div>
      )}
    </header>
  );
};

PageHeader.propTypes = {
  title: PropTypes.node.isRequired,
  /** Record count shown next to the title (pass with `noun`). */
  count: PropTypes.number,
  /** Singular noun for the count, e.g. "slide" → "911 slides". */
  noun: PropTypes.string,
  /** Plural form when it isn't noun + "s" (e.g. "parties", "cities"). */
  plural: PropTypes.string,
  /** Extra context after the count, e.g. `matching name "abc"`. */
  meta: PropTypes.node,
  subtitle: PropTypes.node,
  /** Right-aligned buttons on the title row. */
  actions: PropTypes.node,
  /** Toolbar content for the grey band (search, bulk actions). */
  children: PropTypes.node,
};

export default PageHeader;
