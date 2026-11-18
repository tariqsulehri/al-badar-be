import React from "react";
import PropTypes from "prop-types";

const TablePagination = ({
  count = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 15, 20],
  className = "",
}) => {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));
  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, count);

  const handlePrev = (e) => {
    if (page > 0 && onPageChange) {
      onPageChange(e, page - 1);
    }
  };

  const handleNext = (e) => {
    if (page < totalPages - 1 && onPageChange) {
      onPageChange(e, page + 1);
    }
  };

  const handleSelectRows = (e) => {
    if (onRowsPerPageChange) {
      onRowsPerPageChange(e);
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 py-3 px-4 border-t border-border-soft text-sm text-text-secondary ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Rows per page:
        </span>
        <select
          value={rowsPerPage}
          onChange={handleSelectRows}
          className="px-2 py-1 rounded-lg border border-border-soft bg-bg-surface-strong text-text-primary text-xs font-semibold outline-none focus:border-brand cursor-pointer"
        >
          {rowsPerPageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-text-secondary">
          {from}–{to} of {count}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page === 0}
            onClick={handlePrev}
            aria-label="Previous page"
            className="p-1.5 rounded-lg border border-border-soft bg-bg-surface-strong text-text-primary hover:bg-brand-muted hover:text-brand-strong disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={handleNext}
            aria-label="Next page"
            className="p-1.5 rounded-lg border border-border-soft bg-bg-surface-strong text-text-primary hover:bg-brand-muted hover:text-brand-strong disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

TablePagination.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  className: PropTypes.string,
};

export default TablePagination;
