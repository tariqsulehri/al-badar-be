import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addSlide,
  removeSlide,
  setPagination,
} from "../../../../features/slides/slice/slidesForPptxSlice";
import TablePagination from "../../../../components/common/table/TablePagination";
import { ChevronRightIcon } from "../../../../components/icons";
import SlideDetailPanel from "../SlideDetailPanel";
import SlideThumb from "../SlideThumb";
import { formatAmount } from "../../../../utils/format";
import StatusBadge from "../../../../components/common/StatusBadge";
import "./slide.table.css";


const NO_SELECTION = {};

const SlidesDataTable = ({
  data = [],
  totalRows = 0,
  page = 0,
  rowsPerPage = 10,
  loading = false,
  sortBy = "code",
  sortOrder = "asc",
  onSortChange,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedSlideIds = useSelector((state) => state.slidesForPptx.selectedSlideIds) || NO_SELECTION;
  const totalPages = Math.max(Math.ceil((totalRows || 0) / (rowsPerPage || 10)), 1);
  const [pageInput, setPageInput] = useState(String((page || 0) + 1));

  const handleHeaderSort = (field) => {
    if (!onSortChange) return;
    if (sortBy === field) {
      onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortChange(field, "asc");
    }
  };

  useEffect(() => {
    setPageInput(String((page || 0) + 1));
  }, [page]);

  const allOnPageSelected = useMemo(() => {
    if (!data.length) return false;
    return data.every((row) => row?._id && selectedSlideIds[row._id]);
  }, [data, selectedSlideIds]);

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      data.forEach((row) => {
        if (row?._id && selectedSlideIds[row._id]) {
          dispatch(removeSlide(row));
        }
      });
    } else {
      const toAdd = data.filter((row) => row?._id && !selectedSlideIds[row._id]);
      if (toAdd.length > 0) {
        dispatch(addSlide(toAdd));
      }
    }
  };

  const toggleRowSelect = (e, row) => {
    e.stopPropagation();
    toggleSlide(row);
  };

  // Index (within the current page) of the row shown in the detail panel.
  const [openIndex, setOpenIndex] = useState(null);
  const openSlide = openIndex === null ? null : data[openIndex] || null;

  // Close the panel when the page of data changes underneath it.
  useEffect(() => setOpenIndex(null), [data]);

  const toggleSlide = (row) => {
    if (!row?._id) return;
    if (selectedSlideIds[row._id]) dispatch(removeSlide(row));
    else dispatch(addSlide([row]));
  };

  const goToPage = (nextPage) => {
    const safePage = Math.min(Math.max(Number(nextPage) || 1, 1), totalPages) - 1;
    dispatch(setPagination({ page: safePage, rowsPerPage }));
    if (onPageChange) onPageChange(safePage);
  };

  const handleRowsPerPageChange = (event) => {
    const nextRowsPerPage = Number(event.target.value);
    dispatch(setPagination({ page: 0, rowsPerPage: nextRowsPerPage }));
    if (onRowsPerPageChange) onRowsPerPageChange(nextRowsPerPage);
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border-soft bg-bg-surface shadow-soft">
      {/* Fixed layout + wrapping cells: the grid always fits its container, no horizontal scroll.
          Less important columns drop out on narrower screens; everything is in the detail panel. */}
      <table className="grid-table table-fixed">
        <thead>
          <tr>
            <th className="w-12 text-center">
              <input
                type="checkbox"
                aria-label="Select all on current page"
                checked={allOnPageSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4 cursor-pointer accent-[var(--brand)]"
              />
            </th>
            <th
              className="cursor-pointer select-none hover:text-text-primary transition-colors"
              onClick={() => handleHeaderSort("code")}
              title="Sort by slide code"
            >
              <div className="flex items-center gap-1.5">
                <span>Slide</span>
                {sortBy === "code" && (
                  <span className="text-brand text-xs font-bold">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </div>
            </th>
            <th
              className="hidden w-[20%] xl:table-cell cursor-pointer select-none hover:text-text-primary transition-colors"
              onClick={() => handleHeaderSort("supplier")}
              title="Sort by supplier"
            >
              <div className="flex items-center gap-1.5">
                <span>Supplier</span>
                {sortBy === "supplier" && (
                  <span className="text-brand text-xs font-bold">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </div>
            </th>
            <th
              className="hidden w-[120px] xl:table-cell cursor-pointer select-none hover:text-text-primary transition-colors"
              onClick={() => handleHeaderSort("mediaType")}
              title="Sort by media type"
            >
              <div className="flex items-center gap-1.5">
                <span>Type</span>
                {sortBy === "mediaType" && (
                  <span className="text-brand text-xs font-bold">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </div>
            </th>
            <th
              className="hidden w-[95px] lg:table-cell text-center cursor-pointer select-none hover:text-text-primary transition-colors"
              onClick={() => handleHeaderSort("height_feets")}
              title="Sort by height in feet"
            >
              <div className="flex items-center justify-center gap-1">
                <span>Height (ft)</span>
                {sortBy === "height_feets" && (
                  <span className="text-brand text-xs font-bold">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </div>
            </th>
            <th
              className="hidden w-[95px] lg:table-cell text-center cursor-pointer select-none hover:text-text-primary transition-colors"
              onClick={() => handleHeaderSort("width_feets")}
              title="Sort by width in feet"
            >
              <div className="flex items-center justify-center gap-1">
                <span>Width (ft)</span>
                {sortBy === "width_feets" && (
                  <span className="text-brand text-xs font-bold">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </div>
            </th>
            <th
              className="w-[130px] text-right cursor-pointer select-none hover:text-text-primary transition-colors"
              onClick={() => handleHeaderSort("finalPrice")}
              title="Sort by final price"
            >
              <div className="flex items-center justify-end gap-1.5">
                <span>Final price</span>
                {sortBy === "finalPrice" && (
                  <span className="text-brand text-xs font-bold">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </div>
            </th>
            <th
              className="hidden w-[124px] sm:table-cell cursor-pointer select-none hover:text-text-primary transition-colors"
              onClick={() => handleHeaderSort("status")}
              title="Sort by status"
            >
              <div className="flex items-center gap-1.5">
                <span>Status</span>
                {sortBy === "status" && (
                  <span className="text-brand text-xs font-bold">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </div>
            </th>
            <th className="w-10"><span className="sr-only">Details</span></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="py-12 text-center text-text-muted">
                <div className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Loading slides...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-12 text-center text-text-muted">
                No slides found
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const isSelected = Boolean(row?._id && selectedSlideIds[row._id]);
              const price = formatAmount(row.finalPrice);
              return (
                <tr
                  key={row._id}
                  onClick={() => setOpenIndex(index)}
                  aria-selected={index === openIndex}
                  className={`cursor-pointer ${isSelected && index !== openIndex ? "bg-brand-muted/50" : ""}`}
                >
                  <td className="text-center" onClick={(e) => toggleRowSelect(e, row)}>
                    <input
                      type="checkbox"
                      aria-label={`Select ${row.code || "slide"} for PPTX`}
                      checked={isSelected}
                      onChange={(e) => toggleRowSelect(e, row)}
                      className="h-4 w-4 cursor-pointer accent-[var(--brand)]"
                    />
                  </td>
                  <td>
                    <div className="flex min-w-0 items-center gap-3">
                      <SlideThumb src={row.image} label={row.subArea || row.area || row.code} />
                      <div className="min-w-0">
                        <div className="cell-title truncate">{row.subArea || row.area || "-"}</div>
                        <div className="cell-meta truncate">
                          <span className="cell-code">{row.code || "-"}</span>
                          {[row.city, row.provence].filter(Boolean).map((part) => ` · ${part}`).join("")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden xl:table-cell">
                    <div className="line-clamp-2 break-words text-text-secondary">{row.supplier || row.supplior || "-"}</div>
                  </td>
                  <td className="hidden xl:table-cell">
                    {row.mediaType ? (
                      <span className={`chip ${row.mediaType === "Digital" ? "chip--info" : "chip--neutral"}`}>
                        {row.mediaType}
                      </span>
                    ) : (
                      "-"
                    )}
                    {row.dimension && <div className="cell-meta mt-1 truncate">{row.dimension}</div>}
                  </td>
                  <td className="hidden lg:table-cell text-center">
                    <div className="num whitespace-nowrap font-medium">
                      {row.height_feets ?? "-"}
                    </div>
                  </td>
                  <td className="hidden lg:table-cell text-center">
                    <div className="num whitespace-nowrap font-medium">
                      {row.width_feets ?? "-"}
                    </div>
                    {row.lights && (
                      <div className="cell-meta truncate" title={`Lights: ${row.lights}`}>
                        {row.lights}
                      </div>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="num whitespace-nowrap font-semibold">{price || "-"}</div>
                  </td>
                  <td className="hidden sm:table-cell">{row.status ? <StatusBadge status={row.status} /> : "-"}</td>
                  <td className="text-text-muted">
                    <ChevronRightIcon fontSize="small" />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="flex flex-wrap items-center justify-between gap-4 p-3 border-t border-border-soft">
        <TablePagination
          count={totalRows || 0}
          rowsPerPage={rowsPerPage || 10}
          page={Math.min(page || 0, totalPages - 1)}
          onPageChange={(_, nextPage) => goToPage(nextPage + 1)}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          className="w-full sm:w-auto border-none p-0"
        />

        <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary ml-auto">
          <span>Page</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goToPage(pageInput);
            }}
            className="w-14 h-8 px-2 text-center rounded-lg border border-border-soft bg-bg-surface-strong text-text-primary outline-none focus:border-brand"
          />
          <span>of {totalPages}</span>
          <button
            type="button"
            onClick={() => goToPage(pageInput)}
            className="px-3 h-8 rounded-lg border border-border-soft bg-bg-surface-strong hover:bg-brand-muted hover:text-brand-strong transition-colors cursor-pointer"
          >
            Go
          </button>
        </div>
      </div>

      <SlideDetailPanel
        slide={openSlide}
        isSelected={Boolean(openSlide?._id && selectedSlideIds[openSlide._id])}
        onToggleSelect={() => toggleSlide(openSlide)}
        onEdit={() => navigate(`/slides/edit/${openSlide._id}`)}
        onClose={() => setOpenIndex(null)}
        onPrev={openIndex > 0 ? () => setOpenIndex(openIndex - 1) : undefined}
        onNext={openIndex !== null && openIndex < data.length - 1 ? () => setOpenIndex(openIndex + 1) : undefined}
        position={openIndex !== null ? `${(page || 0) * (rowsPerPage || 10) + openIndex + 1} of ${totalRows}` : null}
      />
    </div>
  );
};

SlidesDataTable.propTypes = {
  data: PropTypes.array,
  totalRows: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  loading: PropTypes.bool,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
  onSortChange: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
};

export default SlidesDataTable;
