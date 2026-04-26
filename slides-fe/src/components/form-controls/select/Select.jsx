import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "./Select.css";

function CustomSelect({ label, options = [], onChange, name, value, defaultValue }) {
  const resolvedValue =
    typeof value === "string"
      ? options.find((option) => option.label === value || option.value === value) || null
      : value || null;

  const resolvedDefaultValue =
    typeof defaultValue === "string"
      ? options.find((option) => option.label === defaultValue || option.value === defaultValue) || null
      : defaultValue || null;

  return (
    <div className="layout">
      <Autocomplete
        className="custom-select"
        size="medium"
        name={name}
        options={options}
        onChange={onChange}
        defaultValue={resolvedDefaultValue}
        value={resolvedValue}
        isOptionEqualToValue={(option, selected) => option.value === selected?.value}
        renderInput={(params) => (
          <TextField
            {...params}
            size="medium"
            label={label}
            placeholder={resolvedValue ? "" : label}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: 14,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                minHeight: 56,
                borderRadius: "16px",
                backgroundColor: "rgba(255,255,255,0.96)",
                alignItems: "center",
              },
              "& .MuiAutocomplete-input": {
                fontSize: 16,
                lineHeight: 1.4,
                padding: "16px 4px 16px 6px !important",
              },
              "& .MuiInputLabel-root": {
                color: "var(--text-secondary)",
              },
              "& .MuiInputLabel-shrink": {
                backgroundColor: "#fff",
                padding: "0 6px",
              },
            }}
          />
        )}
      />
    </div>
  );
}

export default CustomSelect;
