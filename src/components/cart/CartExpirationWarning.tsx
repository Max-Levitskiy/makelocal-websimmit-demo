/** biome-ignore-all assist/source/organizeImports: <explanation> disable biome assist for organize imports */
"use client";

import {
  getDaysUntilExpiration,
  isCartExpiringSoon,
} from "@/lib/cart/cart-persistence";
import { useCartStore } from "@/lib/cart/cart-store";
import { useShallow } from "zustand/react/shallow";

export function CartExpirationWarning() {
  const cart = useCartStore(
    useShallow((state) => ({
      items: state.items,
      createdAt: state.createdAt,
      updatedAt: state.updatedAt,
      expiresAt: state.expiresAt,
    })),
  );

  if (cart.items.length === 0) {
    return null;
  }

  const daysRemaining = getDaysUntilExpiration(cart);
  const isExpiringSoon = isCartExpiringSoon(cart);

  if (!isExpiringSoon) {
    return null;
  }

  return (
    <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-3">
      <div className="flex items-start gap-2">
        <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-lg">
          schedule
        </span>
        <div className="flex-1 text-sm">
          <p className="font-medium text-orange-900 dark:text-orange-300">
            Cart Expiring Soon
          </p>
          <p className="text-orange-800 dark:text-orange-400">
            Your cart will expire in {daysRemaining} day
            {daysRemaining !== 1 ? "s" : ""}. Complete your order to secure your
            items.
          </p>
        </div>
      </div>
    </div>
  );
}
