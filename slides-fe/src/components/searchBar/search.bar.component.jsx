import React, { useState } from "react";
import PropTypes from "prop-types";
import { SearchIcon, RefreshIcon } from "../icons";
import "./search.bar.css";

const SEARCH_FIELDS = [
  { value: "all", label: "All Fields" },
  { value: "code", label: "Code" },
  { value: "supplier", label: "Supplier" },
  { value: "provence", label: "Province" },
  { value: "city", label: "City" },
  { value: "area", label: "Area" },
  { value: "subArea", label: "Sub Area" },
  { value: "mediaType", label: "Media Type" },
  { value: "dimension", label: "Dimension" },
  { value: "lights", label: "Lights" },
  { value: "status", label: "Status" },
  { value: "category", label: "Category" },
  { value: "finalPrice", label: "Final Price" },
  { value: "supQuotedPrice", label: "Supplier Quote" },
];

const emptyFilters = {
  city: "",
  area: "",
  subArea: "",
  supplier: "",
  category: "",
};

const normalizeOptions = (options = []) =>
  (Array.isArray(options) ? options : [])
    .map((option) => {
      if (typeof option === "string") {
        return { label: option, value: option };
      }
      const label = option?.label || option?.name || option?.value || "";
      return label ? { label, value: option?.value || label } : null;
    })
    .filter(Boolean);

const SearchBar = ({ onSearch, filterOptions = {} }) => {
  const [searchBy, setSearchBy] = useState("code");
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState(emptyFilters);

  const handleSearch = () => {
    onSearch(searchBy, searchText.trim(), filters);
  };

  const handleRefresh = () => {
    setSearchBy("code");
    setSearchText("");
    setFilters(emptyFilters);
    onSearch("code", "", emptyFilters);
  };

  const handleFilterChange = (field, value) => {
    const nextFilters = {
      ...filters,
      [field]: value,
    };
    setFilters(nextFilters);
    onSearch(searchBy, searchText.trim(), nextFilters);
  };

  const advancedFields = [
    { field: "city", label: "City", plural: "Cities", options: normalizeOptions(filterOptions.cities) },
    { field: "area", label: "Area", plural: "Areas", options: normalizeOptions(filterOptions.areas) },
    { field: "subArea", label: "Sub Area", plural: "Sub Areas", options: normalizeOptions(filterOptions.subAreas) },
    { field: "supplier", label: "Supplier", plural: "Suppliers", options: normalizeOptions(filterOptions.suppliers) },
    { field: "category", label: "Category", plural: "Categories", options: normalizeOptions(filterOptions.categories) },
  ];

  return (
    <div className="w-full p-4 rounded-2xl border border-border-soft bg-bg-surface shadow-soft mb-4">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          aria-label="Search field"
          className="h-9 px-3 rounded-lg border border-border-soft bg-bg-surface-strong text-text-primary text-[13px] font-medium outline-none focus:border-brand cursor-pointer"
        >
          {SEARCH_FIELDS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <div className="flex-1 min-w-[220px]">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search slide records..."
            className="w-full h-9 px-3.5 rounded-lg border border-border-soft bg-bg-surface-strong text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="ui-btn ui-btn--primary"
        >
          <SearchIcon fontSize="small" />
          <span>Search</span>
        </button>

        <button
          type="button"
          onClick={handleRefresh}
          className="ui-btn"
        >
          <RefreshIcon fontSize="small" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 border-t border-border-soft/60">
        {advancedFields.map(({ field, label, plural, options }) => (
          <div key={field} className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              {label}
            </span>
            <select
              value={filters[field]}
              onChange={(e) => handleFilterChange(field, e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-border-soft bg-bg-surface-strong text-text-primary text-xs outline-none focus:border-brand cursor-pointer"
            >
              <option value="">All {plural}</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  filterOptions: PropTypes.object,
};

export default SearchBar;
