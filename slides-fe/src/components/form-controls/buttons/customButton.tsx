import React from "react";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "text" | "contained" | "outlined";
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  label: string;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  type = "button",
  id,
  name,
  label,
  handleClick,
  variant = "contained",
  color = "primary",
  className = "",
  disabled = false,
  ...props
}) => {
  let colorClasses = "";
  if (variant === "contained") {
    if (color === "error") {
      colorClasses = "bg-danger text-on-brand hover:opacity-90";
    } else if (color === "success") {
      colorClasses = "bg-success text-on-brand hover:opacity-90";
    } else {
      colorClasses = "bg-brand text-on-brand hover:bg-brand-strong";
    }
  } else if (variant === "outlined") {
    if (color === "error") {
      colorClasses = "border border-danger text-danger hover:bg-danger-muted";
    } else if (color === "warning") {
      colorClasses = "border border-border-strong text-warning hover:bg-warning-muted";
    } else {
      colorClasses = "border border-border-strong bg-bg-surface-strong text-text-primary hover:border-brand hover:text-brand-strong";
    }
  } else {
    colorClasses = "text-text-primary hover:bg-brand-muted hover:text-brand-strong";
  }

  return (
    <button
      id={id}
      name={name}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 text-[13px] font-medium transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${colorClasses} ${className}`}
      {...props}
    >
      {label}
    </button>
  );
};

export default CustomButton;
