import React from "react";
import PropTypes from "prop-types";

const InputField = ({
  id,
  name,
  rows = 1,
  type = "text",
  label,
  required,
  className = "",
  width,
  style = {},
  ...otherProps
}) => {
  const isMultiline = rows > 1;
  const containerStyle = {
    ...(width ? { width } : {}),
    ...style,
  };

  return (
    <div className={`flex flex-col mb-2 text-left ${className}`} style={containerStyle}>
      {label && (
        <label htmlFor={id} className="mb-1.5 text-xs font-semibold text-text-secondary">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      {isMultiline ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-border-soft bg-bg-surface-strong text-text-primary placeholder:text-text-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all duration-150 text-sm resize-y"
          {...otherProps}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          className="w-full h-10 px-3 rounded-lg border border-border-soft bg-bg-surface-strong text-text-primary placeholder:text-text-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all duration-150 text-sm"
          {...otherProps}
        />
      )}
    </div>
  );
};

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  rows: PropTypes.number,
  type: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
};

InputField.defaultProps = {
  rows: 1,
  type: "text",
};

export default InputField;
