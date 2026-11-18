import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const DropdownMenu = ({ anchorEl, open, onClose, children, className = "" }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !anchorEl?.contains(e.target)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, anchorEl, onClose]);

  if (!open || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();
  const top = rect.bottom + 8;
  const left = Math.max(12, Math.min(rect.left, window.innerWidth - 230));

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
      }}
      className={`z-50 min-w-[200px] p-1.5 rounded-2xl border border-border-soft bg-bg-surface shadow-strong animate-fadeIn ${className}`}
    >
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
};

DropdownMenu.propTypes = {
  anchorEl: PropTypes.any,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

export const DropdownItem = ({ onClick, children, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left px-3.5 py-2 text-sm font-semibold rounded-xl text-text-primary hover:bg-brand-muted hover:text-brand-strong transition-all duration-120 cursor-pointer ${className}`}
  >
    {children}
  </button>
);

DropdownItem.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default DropdownMenu;
