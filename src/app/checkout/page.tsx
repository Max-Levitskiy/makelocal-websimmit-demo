"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import {
  createOrderDraft,
  validateCartForCheckout,
} from "@/lib/api/order-draft";
import { useCartStore } from "@/lib/cart/cart-store";
import type { MakeLocalAPIError } from "@/types/api";

type CheckoutState = "idle" | "processing" | "success" | "error";

export default function CheckoutPage() {
  const router = useRouter();

  // Select individual properties to avoid re-render issues
  const items = useCartStore((state) => state.items);
  const sessionToken = useCartStore((state) => state.sessionToken);
  const summary = useCartStore((state) => state.summary);
  const createdAt = useCartStore((state) => state.createdAt);
  const updatedAt = useCartStore((state) => state.updatedAt);
  const expiresAt = useCartStore((state) => state.expiresAt);
  const clearCart = useCartStore((state) => state.clearCart);

  // Memoize cart object to prevent unnecessary re-renders
  const cart = useMemo(
    () => ({
      items,
      sessionToken,
      summary,
      createdAt,
      updatedAt,
      expiresAt,
    }),
    [items, sessionToken, summary, createdAt, updatedAt, expiresAt],
  );

  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [draftOrderIds, setDraftOrderIds] = useState<string[]>([]);

  // Validate cart on mount
  useEffect(() => {
    const validation = validateCartForCheckout(cart);
    if (!validation.valid && checkoutState === "idle") {
      setError(validation.message || "Cart validation failed");
      setCheckoutState("error");
    }
  }, [cart, checkoutState]);

  const handleCheckout = async () => {
    setCheckoutState("processing");
    setError(null);

    try {
      // Validate cart
      const validation = validateCartForCheckout(cart);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      // Create order draft
      const response = await createOrderDraft(cart);

      // Extract draft order IDs
      const orderIds = response.results.map((result) => result.draftOrderId);
      setDraftOrderIds(orderIds);

      // Log any errors
      if (response.errors && response.errors.length > 0) {
        console.warn("Some items failed:", response.errors);
      }
      // Success!
      setCheckoutState("success");
      setRedirectUrl(response.redirectUrl);

      // Clear cart after successful order draft creation
      clearCart();

      // Redirect to MakeLocal after a brief delay
      // setTimeout(() => {
      //   window.location.href = response.redirectUrl;
      // }, 2000);
    } catch (err) {
      console.error("Checkout failed:", err);
      setCheckoutState("error");

      if (err && typeof err === "object" && "code" in err) {
        const apiError = err as MakeLocalAPIError;
        setError(apiError.message || "Failed to create order draft");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during checkout");
      }
    }
  };

  const handleRetry = () => {
    setCheckoutState("idle");
    setError(null);
  };

  // Empty cart - redirect to cart page
  if (cart.items.length === 0 && checkoutState !== "success") {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <span className="material-symbols-outlined text-8xl text-slate-400 mb-6">
            shopping_bag
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Your cart is empty
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Add some products to your cart before checking out.
          </p>
          <Link href="/">
            <Button variant="primary" size="large">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="flex h-12 w-12 items-center justify-center rounded-full text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Back to cart"
            disabled={checkoutState === "processing"}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Checkout
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {checkoutState === "idle" && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm dark:shadow-none">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {item.productName}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        Qty: {item.quantity} × €{item.basePrice.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      €{(item.basePrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between text-lg font-bold border-t border-slate-200 dark:border-slate-700 pt-3">
                  <span className="text-slate-900 dark:text-white">Total:</span>
                  <span className="text-primary">
                    €{cart.summary.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm dark:shadow-none">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Complete Your Order
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Click below to create your order draft and proceed to MakeLocal
                for secure payment.
              </p>
              <Button
                variant="primary"
                size="large"
                fullWidth
                onClick={handleCheckout}
              >
                Checkout on MakeLocal
              </Button>
            </div>
          </div>
        )}

        {checkoutState === "processing" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Creating your order...
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Please wait while we prepare your order.
            </p>
          </div>
        )}

        {checkoutState === "success" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
              <span className="material-symbols-outlined text-5xl text-green-600 dark:text-green-400">
                check_circle
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Order Draft Created!
            </h2>
            {draftOrderIds.length > 0 && (
              <span className="block text-sm mb-3 font-mono text-slate-500 dark:text-slate-500">
                {draftOrderIds.length} item
                {draftOrderIds.length !== 1 ? "s" : ""} added to draft
              </span>
            )}
            <div className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
              {redirectUrl ? (
                <>
                  <p className="mb-2">
                    Redirecting you to MakeLocal to complete your order...
                  </p>
                  <p className="text-sm">
                    If the redirect doesn't happen automatically, follow this
                    link:
                    <br />
                    <a
                      href={redirectUrl}
                      className="text-primary hover:text-primary/80 underline break-all"
                    >
                      {redirectUrl}
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-2">
                    Your order draft has been successfully created.
                  </p>
                  <p className="text-sm">
                    Follow this link to complete your order on MakeLocal:
                    <br />
                    <a
                      href="https://makelocal.eu/product-orders/draft"
                      className="text-primary hover:text-primary/80 underline break-all"
                    >
                      https://makelocal.eu/product-orders/draft
                    </a>
                  </p>
                </>
              )}
            </div>
            <Link href="/">
              <Button variant="primary" size="large">
                Browse More Products
              </Button>
            </Link>
          </div>
        )}

        {checkoutState === "error" && (
          <div className="space-y-6">
            <ErrorMessage>
              <p className="font-bold mb-2">Checkout Failed</p>
              <p>{error}</p>
            </ErrorMessage>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm dark:shadow-none">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                What to do next
              </h3>
              <div className="space-y-4">
                <Button
                  variant="primary"
                  size="large"
                  fullWidth
                  onClick={handleRetry}
                >
                  Try Again
                </Button>
                <Link href="/cart">
                  <Button variant="secondary" size="large" fullWidth>
                    Return to Cart
                  </Button>
                </Link>
                <div className="text-sm text-slate-600 dark:text-slate-400 text-center pt-4">
                  <p className="mb-2">Need help?</p>
                  <p className="font-medium">
                    Visit us at Booth TBD or contact event staff
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
