import React from "react";
import PropTypes from "prop-types";

const FileUpload = ({ id = "file-upload", name = "file", onChange, className = "" }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-border-soft hover:border-brand rounded-2xl bg-bg-surface-strong/60 transition-colors cursor-pointer group ${className}`}>
      <input
        id={id}
        name={name}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="flex flex-col items-center text-center pointer-events-none">
        <svg
          className="w-8 h-8 mb-2 text-text-muted group-hover:text-brand transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-sm font-semibold text-text-primary group-hover:text-brand transition-colors">
          Select or drop image
        </span>
        <span className="text-xs text-text-muted mt-0.5">PNG, JPG, WebP supported</span>
      </div>
    </div>
  );
};

FileUpload.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default FileUpload;
