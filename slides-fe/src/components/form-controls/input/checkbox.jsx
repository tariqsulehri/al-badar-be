import React from "react";
import PropTypes from "prop-types";

const CheckboxField = ({
  id,
  name,
  label,
  width = 400,
  checked = false,
  onChange,
  className = "",
  style = {},
  ...otherProps
}) => {
  const containerStyle = {
    ...(width ? { width } : {}),
    ...style,
  };

  return (
    <div className={`flex items-center gap-2 mb-2.5 ${className}`} style={containerStyle}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-border-soft text-brand accent-[var(--brand)] focus:ring-2 focus:ring-brand-muted cursor-pointer transition-colors"
        {...otherProps}
      />
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-primary cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  );
};

CheckboxField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

CheckboxField.defaultProps = {
  checked: false,
  width: 400,
};

export default CheckboxField;
