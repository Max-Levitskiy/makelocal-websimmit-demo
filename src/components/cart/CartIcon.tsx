"use client";

import { useCartStore } from "@/lib/cart/cart-store";

export interface CartIconProps {
  onClick?: () => void;
  className?: string;
}

export function CartIcon({ onClick, className = "" }: CartIconProps) {
  const summary = useCartStore((state) => state.summary);
  const hasItems = summary.totalItems > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center justify-center ${className}`}
      aria-label={`Shopping cart with ${summary.totalItems} item${summary.totalItems !== 1 ? "s" : ""}`}
    >
      <span className="material-symbols-outlined text-2xl">shopping_bag</span>
      {hasItems && (
        <span
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
          aria-live="polite"
        >
          {summary.totalItems > 9 ? "9+" : summary.totalItems}
        </span>
      )}
    </button>
  );
}
