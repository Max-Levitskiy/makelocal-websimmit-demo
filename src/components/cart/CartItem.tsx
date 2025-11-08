"use client";

import Link from "next/link";
import type { CartItem as CartItemType } from "@/types/cart";

export interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  compact?: boolean;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  compact = false,
}: CartItemProps) {
  const subtotal = item.basePrice * item.quantity;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      onUpdateQuantity(newQuantity);
    }
  };

  return (
    <div
      className={`flex gap-4 ${compact ? "py-3" : "py-4"} border-b border-slate-200 dark:border-slate-800 last:border-b-0`}
    >
      {/* Product Info */}
      <div className="flex-1">
        <Link
          href={`/product/${item.productSlug}`}
          className="font-bold text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
        >
          {item.productName}
        </Link>

        {/* Customizations */}
        <div className="mt-1 space-y-1">
          {item.customizations.text && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">Text:</span>{" "}
              {item.customizations.text}
            </p>
          )}
          {item.customizations.colorId && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">Color:</span>{" "}
              {item.customizations.colorId}
            </p>
          )}
        </div>

        {/* Price */}
        <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
          €{item.basePrice.toFixed(2)}{" "}
          {item.quantity > 1 && `× ${item.quantity}`}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end gap-2">
        <p className="text-base font-bold text-slate-900 dark:text-white">
          €{subtotal.toFixed(2)}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleQuantityChange(-1)}
            disabled={item.quantity <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <span className="material-symbols-outlined text-lg">remove</span>
          </button>

          <span className="min-w-[2ch] text-center text-sm font-medium text-slate-900 dark:text-white">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => handleQuantityChange(1)}
            disabled={item.quantity >= 10}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <span className="material-symbols-outlined text-lg">add</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="text-sm text-destructive hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
