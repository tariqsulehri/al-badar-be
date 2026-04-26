import React from "react";
import { Button, styled, ButtonProps } from "@mui/material";

const StyledButton = styled(Button)(() => ({
  minWidth: "132px",
  minHeight: "42px",
  margin: "4px",
  padding: "10px 18px",
  textTransform: "none",
  borderRadius: "16px",
  fontSize: "14px",
  fontWeight: 700,
  letterSpacing: "-0.01em",
  boxShadow: "0 16px 32px rgba(15, 23, 42, 0.12)",
  transition: "transform 160ms ease, box-shadow 160ms ease, background 160ms ease",
  "&:hover": {
    boxShadow: "0 22px 36px rgba(15, 23, 42, 0.16)",
    transform: "translateY(-1px)",
  },
  "&:active": {
    transform: "translateY(0)",
    boxShadow: "0 10px 20px rgba(15, 23, 42, 0.12)",
  },
}));

interface CustomButtonProps extends Omit<ButtonProps, "variant" | "color"> {
  variant?: "text" | "contained" | "outlined";
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  label: string;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  type,
  id,
  name,
  label,
  handleClick,
  variant = "contained",
  color = "primary",
  ...props
}) => {
  return (
    <StyledButton
      id={id}
      name={name}
      type={type}
      variant={variant}
      color={color}
      onClick={handleClick}
      {...props}
    >
      {label}
    </StyledButton>
  );
};

export default CustomButton;
