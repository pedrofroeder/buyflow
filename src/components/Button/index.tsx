import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { colors } from "../../config/colors";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export function Button({ children, variant = "primary", className = "", ...rest }: ButtonProps) {
  const variantClasses = {
    primary: `${colors.primary.bg} ${colors.primary.hover}`,
    secondary: `${colors.secondary.bg} ${colors.secondary.hover}`,
    danger: `${colors.danger.bg} ${colors.danger.hover}`
  };

  return (
    <button
      className={`${variantClasses[variant]} text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}