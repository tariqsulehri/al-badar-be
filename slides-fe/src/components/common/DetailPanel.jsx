import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "../icons";

/**
 * Right-hand slide-over for a row's details. Sits under the app header,
 * dims the page, closes on Esc / backdrop click, and can step through rows
 * with the Previous/Next buttons (or ←/→ keys) when onPrev/onNext are given.
 */
const DetailPanel = ({ open, title, subtitle, actions, onClose, onPrev, onNext, position, children }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      // Don't hijack arrows while typing in a field.
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;

  // Portal to <body>: an ancestor with backdrop-filter/transform would otherwise
  // become the containing block for `position: fixed` and trap the panel inside it.
  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close details"
        tabIndex={-1}
        onClick={onClose}
        className="fixed inset-x-0 bottom-0 top-16 z-40 cursor-default bg-bg-dark/40 animate-[fadeIn_150ms_ease-out]"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed bottom-0 right-0 top-16 z-40 flex w-full flex-col border-l border-border-soft bg-bg-surface-strong shadow-strong animate-[panelIn_200ms_ease-out] sm:w-[min(760px,92vw)]"
      >
        <header className="flex items-start gap-3 border-b border-border-soft px-6 py-5">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-semibold text-text-primary">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-text-secondary">{subtitle}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {actions}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-10 w-10 place-items-center rounded-xl bg-brand-muted text-text-secondary transition-colors hover:text-text-primary"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {(onPrev || onNext || position) && (
          <footer className="flex items-center justify-between border-t border-border-soft px-6 py-3">
            <span className="text-sm text-text-secondary">{position}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onPrev}
                disabled={!onPrev}
                className="flex h-9 items-center gap-1 rounded-lg border border-border-soft px-3 text-[13px] font-medium text-text-primary transition-colors hover:border-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-soft"
              >
                <ChevronLeftIcon fontSize="small" /> Previous
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!onNext}
                className="flex h-9 items-center gap-1 rounded-lg border border-border-soft px-3 text-[13px] font-medium text-text-primary transition-colors hover:border-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-soft"
              >
                Next <ChevronRightIcon fontSize="small" />
              </button>
            </div>
          </footer>
        )}
      </aside>
    </>,
    document.body
  );
};

DetailPanel.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  actions: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  position: PropTypes.node,
  children: PropTypes.node,
};

/** A titled group of label/value pairs inside the panel. */
export const DetailSection = ({ title, children }) => (
  <section className="mb-6 last:mb-0">
    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">{title}</h3>
    {/* 1px gaps over a border-coloured background draw the cell dividers. */}
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border-soft bg-border-soft sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2">
      {children}
    </dl>
  </section>
);

DetailSection.propTypes = { title: PropTypes.string.isRequired, children: PropTypes.node };

const isEmpty = (v) => v === undefined || v === null || v === "";

export const DetailItem = ({ label, value, mono, wide }) => (
  <div className={`bg-bg-surface-strong px-4 py-3 ${wide ? "sm:col-span-2" : ""}`}>
    <dt className="text-xs text-text-muted">{label}</dt>
    <dd className={`mt-0.5 break-words text-sm ${isEmpty(value) ? "text-text-muted" : "text-text-primary"} ${mono ? "font-mono" : "font-medium"}`}>
      {isEmpty(value) ? "—" : value}
    </dd>
  </div>
);

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
  mono: PropTypes.bool,
  wide: PropTypes.bool,
};

export default DetailPanel;
