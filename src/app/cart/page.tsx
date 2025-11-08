"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartExpirationWarning } from "@/components/cart/CartExpirationWarning";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/shared/Button";
import { useCartStore } from "@/lib/cart/cart-store";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const summary = useCartStore((state) => state.summary);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex h-12 w-12 items-center justify-center rounded-full text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Back to catalog"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Shopping Cart
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <span className="material-symbols-outlined text-8xl text-slate-400 mb-6">
              shopping_bag
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Your cart is empty
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
              Browse our catalog and add some personalized products to get
              started!
            </p>
            <Link href="/">
              <Button variant="primary" size="large">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <CartExpirationWarning />

              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm dark:shadow-none">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Cart Items ({summary.itemCount})
                </h2>
                <div className="space-y-0">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={(quantity) =>
                        updateQuantity(item.id, quantity)
                      }
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSummary summary={summary} />

                <div className="mt-4">
                  <Link href="/">
                    <Button variant="ghost" size="large" fullWidth>
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
