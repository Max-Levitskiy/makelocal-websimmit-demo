"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import type { CartSummary as CartSummaryType } from "@/types/cart";

export interface CartSummaryProps {
  summary: CartSummaryType;
  compact?: boolean;
}

export function CartSummary({ summary, compact = false }: CartSummaryProps) {
  const router = useRouter();
  const hasItems = summary.totalItems > 0;
  const isNearLimit = summary.totalItems >= 8; // Warn when approaching 10 item limit

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div
      className={`flex flex-col gap-4 ${compact ? "p-4" : "p-6"} bg-slate-50 dark:bg-slate-800/50 rounded-xl`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Items:</span>
          <span
            className={`font-medium ${isNearLimit ? "text-orange-600 dark:text-orange-400" : "text-slate-900 dark:text-white"}`}
          >
            {summary.itemCount} ({summary.totalItems} total)
          </span>
        </div>

        {isNearLimit && (
          <p className="text-xs text-orange-600 dark:text-orange-400">
            ⚠️ Cart limit is 10 items total
          </p>
        )}

        <div className="flex items-center justify-between text-lg font-bold border-t border-slate-200 dark:border-slate-700 pt-2">
          <span className="text-slate-900 dark:text-white">Total:</span>
          <span className="text-primary">€{summary.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <Button
        variant="primary"
        size="large"
        fullWidth
        disabled={!hasItems}
        onClick={handleCheckout}
      >
        {hasItems ? "Checkout on MakeLocal" : "Cart is empty"}
      </Button>

      {hasItems && (
        <p className="text-xs text-center text-slate-600 dark:text-slate-400">
          Secure checkout with MakeLocal
        </p>
      )}
    </div>
  );
}
