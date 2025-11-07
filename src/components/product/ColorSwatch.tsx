"use client";

import type { ColorOption } from "@/types/product";

export interface ColorSwatchProps {
  color: ColorOption;
  selected: boolean;
  onClick: () => void;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

export function ColorSwatch({
  color,
  selected,
  onClick,
  size = "medium",
  disabled = false,
}: ColorSwatchProps) {
  const sizeClasses = {
    small: "size-6",
    medium: "size-10",
    large: "size-14",
  };

  const disabledClass =
    disabled || !color.available
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer hover:scale-110";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !color.available}
      className={`rounded-full border-2 transition-all ${sizeClasses[size]} ${disabledClass} ${
        selected
          ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
          : "border-slate-300 dark:border-slate-600"
      }`}
      style={{ backgroundColor: color.hex }}
      aria-label={`${color.name} ${selected ? "(selected)" : ""}`}
      aria-pressed={selected}
      title={color.name}
    />
  );
}
