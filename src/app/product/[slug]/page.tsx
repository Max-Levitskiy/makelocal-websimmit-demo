"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CartIcon } from "@/components/cart/CartIcon";
import { PhotoSlider } from "@/components/product/PhotoSlider";
import { ProductConfig } from "@/components/product/ProductConfig";
import { Button } from "@/components/shared/Button";
import { MOCK_COORDINATOR_ID } from "@/lib/api/products-by-coordinator";
import { useCartStore } from "@/lib/cart/cart-store";
import { preloadProductPhotos } from "@/lib/photos/photo-fetcher";
import { transformProduct } from "@/lib/products/product-transformer";
import { useProductsStore } from "@/lib/products/products-store";
import { useCoordinatorProducts } from "@/lib/products/use-coordinator-products";
import type { Customizations } from "@/types/product";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Get products from store
  const {
    getProductBySlug,
    products: storeProducts,
    setProducts,
    setLoading: setStoreLoading,
    setError: setStoreError,
    shouldFetchProducts,
  } = useProductsStore();

  // Check if we need to fetch products
  const shouldFetch = shouldFetchProducts();

  // Use the enabled parameter to prevent unnecessary API calls
  const {
    products: apiProducts,
    loading: apiLoading,
    error: apiError,
  } = useCoordinatorProducts(MOCK_COORDINATOR_ID, shouldFetch);

  // Update store when products are fetched
  useEffect(() => {
    if (apiProducts.length > 0) {
      const transformedProducts = apiProducts.map(transformProduct);
      setProducts(transformedProducts);
    }
  }, [apiProducts, setProducts]);

  // Update loading and error states
  useEffect(() => {
    setStoreLoading(apiLoading);
  }, [apiLoading, setStoreLoading]);

  useEffect(() => {
    setStoreError(apiError);
  }, [apiError, setStoreError]);

  // Get product from store
  const product = getProductBySlug(slug);

  const [customizations, setCustomizations] = useState<Customizations>({});
  const [isValid, setIsValid] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  // Preload product photos when product is available
  useEffect(() => {
    if (product && product.images.length > 0) {
      preloadProductPhotos(product.images);
    }
  }, [product]);

  // Show loading state while products are being fetched
  if (apiLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // Show error if API fetch failed
  if (apiError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-red-400 mb-4">
            error
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Error Loading Products
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{apiError}</p>
          <Button onClick={() => router.push("/")}>Back to Catalog</Button>
        </div>
      </div>
    );
  }

  // Show not found if product doesn't exist in store (after loading completes)
  if (!product && storeProducts.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-slate-400 mb-4">
            search_off
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Product not found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            This product may not be available or the link is incorrect.
          </p>
          <Button onClick={() => router.push("/")}>Back to Catalog</Button>
        </div>
      </div>
    );
  }

  // Still loading (products not yet in store)
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await addItem({
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        basePrice: product.basePrice,
        customizations,
        quantity: 1,
      });

      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
        setError(null);
      }, 3000);
    } catch (error) {
      console.error("Error adding item to cart:", error);

      // Log detailed error information
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      const errorMessage =
        error instanceof Error ? error.message : "Failed to add item to cart";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex h-12 w-12 items-center justify-center rounded-full text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Back to catalog"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              {product.name}
            </h1>
          </div>
          <div className="flex w-12 items-center justify-end">
            <Link href="/cart">
              <CartIcon className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-visible rounded-xl h-12 bg-transparent text-slate-900 dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0" />
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images with Slider */}
          <div className="flex flex-col gap-4">
            {product.images && product.images.length > 0 ? (
              <PhotoSlider
                images={product.images}
                alt={product.name}
                className="w-full aspect-square rounded-xl"
              />
            ) : (
              <div
                className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center"
                role="img"
                aria-label={product.name}
              >
                <span className="material-symbols-outlined text-6xl text-slate-400">
                  image
                </span>
              </div>
            )}

            {/* Product Meta */}
            <div className="flex gap-2 flex-wrap">
              {product.estimatedPrintTime && (
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                  ~{product.estimatedPrintTime}
                </span>
              )}
              {product.material && (
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {product.material}
                </span>
              )}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                €{product.basePrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Personalize Your {product.name}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {product.description}
              </p>
            </div>

            <ProductConfig
              product={product}
              onCustomizationsChange={(config, valid) => {
                setCustomizations(config);
                setIsValid(valid);
              }}
            />

            <div className="flex flex-col gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-slate-900 dark:text-white">Total:</span>
                <span className="text-primary">
                  €{product.basePrice.toFixed(2)}
                </span>
              </div>

              <Button
                variant="primary"
                size="large"
                fullWidth
                disabled={!isValid || addedToCart || isLoading}
                onClick={handleAddToCart}
              >
                {isLoading
                  ? "Adding..."
                  : addedToCart
                    ? "✓ Added to Cart!"
                    : "Add to Cart"}
              </Button>

              {!isValid && !addedToCart && !error && (
                <p className="text-sm text-center text-slate-600 dark:text-slate-400">
                  Complete all required fields to continue
                </p>
              )}

              {addedToCart && !error && (
                <p className="text-sm text-center text-primary font-medium">
                  Item added successfully! View your cart to checkout.
                </p>
              )}

              {error && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    ⚠️ Unable to connect to server
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Your cart is working in offline mode. Items will sync when
                    you're back online.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
