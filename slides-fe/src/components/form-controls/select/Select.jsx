import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

function CustomSelect({
  label,
  options = [],
  onChange,
  name,
  value,
  defaultValue,
  width,
  style = {},
  className = "",
  placeholder,
  isClearable = true,
  ...otherProps
}) {
  const formattedOptions = (options || []).map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const resolvedValue =
    typeof value === "string"
      ? formattedOptions.find((opt) => opt.label === value || opt.value === value) ||
        (value ? { label: value, value } : null)
      : value || null;

  const resolvedDefaultValue =
    typeof defaultValue === "string"
      ? formattedOptions.find((opt) => opt.label === defaultValue || opt.value === defaultValue) ||
        (defaultValue ? { label: defaultValue, value: defaultValue } : null)
      : defaultValue || null;

  const handleChange = (selectedOption) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value: selectedOption ? selectedOption.value : "",
        },
      };
      onChange(syntheticEvent, selectedOption, name);
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderRadius: "16px",
      backgroundColor: "var(--bg-surface-strong)",
      borderColor: state.isFocused ? "var(--brand)" : "var(--border-soft)",
      boxShadow: state.isFocused ? "0 0 0 2px var(--brand-muted)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "var(--brand)" : "var(--border-strong)",
      },
      padding: "0 6px",
      transition: "all 150ms ease",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "16px",
      backgroundColor: "var(--bg-surface-strong)",
      border: "1px solid var(--border-soft)",
      boxShadow: "var(--shadow-soft)",
      zIndex: 50,
      padding: "4px",
      overflow: "hidden",
    }),
    menuList: (base) => ({
      ...base,
      padding: "4px",
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: "10px",
      margin: "2px 0",
      backgroundColor: state.isSelected
        ? "var(--brand)"
        : state.isFocused
        ? "var(--brand-muted)"
        : "transparent",
      color: state.isSelected
        ? "var(--on-brand)"
        : state.isFocused
        ? "var(--brand-strong)"
        : "var(--text-primary)",
      fontWeight: state.isSelected ? 600 : 500,
      cursor: "pointer",
      padding: "8px 12px",
      fontSize: "0.875rem",
      transition: "background-color 120ms ease",
    }),
    singleValue: (base) => ({
      ...base,
      color: "var(--text-primary)",
      fontSize: "0.875rem",
    }),
    placeholder: (base) => ({
      ...base,
      color: "var(--text-muted)",
      fontSize: "0.875rem",
    }),
    input: (base) => ({
      ...base,
      color: "var(--text-primary)",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  const containerStyle = {
    ...(width ? { width } : {}),
    ...style,
  };

  return (
    <div className={`flex flex-col mb-2 text-left ${className}`} style={containerStyle}>
      {label && (
        <label className="mb-1.5 text-xs font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <Select
        name={name}
        options={formattedOptions}
        onChange={handleChange}
        value={resolvedValue}
        defaultValue={resolvedDefaultValue}
        styles={customStyles}
        placeholder={placeholder || `Select ${label || ""}`.trim()}
        isClearable={isClearable}
        {...otherProps}
      />
    </div>
  );
}

CustomSelect.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  isClearable: PropTypes.bool,
};

export default CustomSelect;
