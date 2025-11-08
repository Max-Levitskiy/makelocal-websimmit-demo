import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "large" | "small";
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "large",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "flex items-center justify-center font-bold tracking-[0.015em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary:
      "bg-slate-100/20 dark:bg-slate-700/50 backdrop-blur-sm text-slate-900 dark:text-white hover:bg-slate-100/30 dark:hover:bg-slate-700/60",
    accent: "bg-electric-accent text-slate-900 hover:bg-electric-accent/90",
    ghost: "bg-transparent text-primary hover:bg-primary/10",
  };

  const sizeClasses = {
    large: "h-12 px-5 rounded-xl text-base",
    small: "h-9 px-3 rounded-lg text-sm",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
