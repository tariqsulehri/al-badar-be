import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getAllSlides } from "../../../services/apis/slideService";
import { SearchIcon, CloseIcon } from "../../../components/icons";
import SlideThumb from "../../slides/components/SlideThumb";
import { formatAmount } from "../../../utils/format";

const SlidePickerModal = ({ isOpen, onClose, onAddSlides, existingSlideIds = [] }) => {
  const [slides, setSlides] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 12;

  const [selectedMap, setSelectedMap] = useState({});

  const existingSet = new Set(existingSlideIds.map(String));

  useEffect(() => {
    if (!isOpen) {
      setSelectedMap({});
      setSearchText("");
      setPage(0);
      return;
    }

    const fetchSlides = async () => {
      setLoading(true);
      try {
        const res = await getAllSlides(rowsPerPage, page + 1, "code", searchText);
        setSlides(res?.data || []);
        setTotalRows(res?.totalRecords || 0);
      } catch {
        setSlides([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [isOpen, page, searchText]);

  if (!isOpen) return null;

  const toggleSelect = (slide) => {
    if (existingSet.has(String(slide._id))) return;
    setSelectedMap((prev) => {
      const next = { ...prev };
      if (next[slide._id]) {
        delete next[slide._id];
      } else {
        next[slide._id] = slide;
      }
      return next;
    });
  };

  const selectedCount = Object.keys(selectedMap).length;

  const handleConfirmAdd = () => {
    const list = Object.values(selectedMap);
    if (list.length > 0) {
      onAddSlides(list);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col w-full max-w-4xl max-h-[88vh] rounded-2xl bg-bg-surface border border-border-soft shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Add Slides from Inventory</h2>
            <p className="text-xs text-text-secondary">
              Select slides to include in this Customer Media Plan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-neutral-bg transition-colors"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-border-soft bg-neutral-bg/40 flex items-center gap-3">
          <div className="relative flex-1">
            <SearchIcon
              fontSize="small"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(0);
              }}
              placeholder="Search by code, city, area..."
              className="w-full h-10 pl-9 pr-4 text-xs rounded-xl border border-border-soft bg-bg-surface text-text-primary outline-none focus:border-brand"
            />
          </div>
          <span className="text-xs text-text-muted whitespace-nowrap">
            {totalRows} slides found
          </span>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-xs text-text-muted">
              Loading slides...
            </div>
          ) : slides.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-text-muted">
              <p className="text-sm font-medium">No slides found</p>
              <p className="text-xs">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {slides.map((slide) => {
                const isAlreadyInPlan = existingSet.has(String(slide._id));
                const isSelected = Boolean(selectedMap[slide._id]);

                return (
                  <div
                    key={slide._id}
                    onClick={() => !isAlreadyInPlan && toggleSelect(slide)}
                    className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isAlreadyInPlan
                        ? "opacity-50 border-border-soft bg-neutral-bg cursor-not-allowed"
                        : isSelected
                        ? "border-brand bg-brand-muted/20 shadow-sm"
                        : "border-border-soft bg-bg-surface hover:border-brand/50"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-border-soft">
                      <SlideThumb src={slide.image} code={slide.code} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-text-primary truncate">
                          {slide.code}
                        </span>
                        {isAlreadyInPlan && (
                          <span className="text-[10px] uppercase font-bold text-text-muted">
                            Added
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-text-secondary truncate">
                        {[slide.city, slide.subArea || slide.area].filter(Boolean).join(" · ")}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-text-muted mt-1">
                        <span>{slide.width_feets} × {slide.height_feets} ft</span>
                        <span className="font-semibold text-text-primary">
                          {formatAmount(slide.quotedPrice)}
                        </span>
                      </div>
                    </div>

                    {!isAlreadyInPlan && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(slide)}
                        className="w-4 h-4 rounded text-brand focus:ring-brand accent-brand cursor-pointer"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border-soft bg-bg-surface-strong">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              className="px-3 py-1.5 text-xs rounded-lg border border-border-soft disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-text-secondary">
              Page {page + 1} of {Math.max(1, Math.ceil(totalRows / rowsPerPage))}
            </span>
            <button
              type="button"
              disabled={(page + 1) * rowsPerPage >= totalRows}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 text-xs rounded-lg border border-border-soft disabled:opacity-40"
            >
              Next
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border-soft hover:bg-neutral-bg text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={handleConfirmAdd}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-brand text-on-brand hover:bg-brand-strong disabled:opacity-40 shadow-sm"
            >
              Add Selected ({selectedCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SlidePickerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddSlides: PropTypes.func.isRequired,
  existingSlideIds: PropTypes.array,
};

export default SlidePickerModal;
