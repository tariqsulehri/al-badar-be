import React, { useState } from "react";
import { Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
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
  options
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

  const handleFilterChange = (field, option) => {
    const nextFilters = {
      ...filters,
      [field]: option?.label || "",
    };

    setFilters(nextFilters);
    onSearch(searchBy, searchText.trim(), nextFilters);
  };

  const getSelectedOption = (field, options) => {
    if (!filters[field]) {
      return null;
    }

    return options.find((option) => option.label === filters[field]) || { label: filters[field], value: filters[field] };
  };

  const advancedFields = [
    { field: "city", label: "City", options: normalizeOptions(filterOptions.cities) },
    { field: "area", label: "Area", options: normalizeOptions(filterOptions.areas) },
    { field: "subArea", label: "Sub Area", options: normalizeOptions(filterOptions.subAreas) },
    { field: "supplier", label: "Supplier", options: normalizeOptions(filterOptions.suppliers) },
    { field: "category", label: "Category", options: normalizeOptions(filterOptions.categories) },
  ];

  return (
    <Box className="search-bar-panel page-card">
      <div className="search-bar-row">
        <FormControl className="search-select-form" size="small">
          <InputLabel>Search By</InputLabel>
          <Select value={searchBy} label="Search By" onChange={(e) => setSearchBy(e.target.value)}>
            {SEARCH_FIELDS.map((field) => (
              <MenuItem key={field.value} value={field.value}>
                {field.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          className="search-input"
          label="Search"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          size="small"
          placeholder="Search slide records"
        />

        <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} className="search-btn">
          Search
        </Button>

        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh} className="search-btn">
          Reset
        </Button>
      </div>

      <div className="advanced-filter-grid">
        {advancedFields.map(({ field, label, options }) => (
          <Autocomplete
            key={field}
            size="small"
            options={options}
            value={getSelectedOption(field, options)}
            onChange={(event, option) => handleFilterChange(field, option)}
            getOptionLabel={(option) => option?.label || ""}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            renderInput={(params) => <TextField {...params} label={label} />}
          />
        ))}
      </div>
    </Box>
  );
};

export default SearchBar;
