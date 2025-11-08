import productsData from "@/data/products.json";
import type { Product } from "@/types/product";

/**
 * Load all products from the products.json file
 */
export function getAllProducts(): Product[] {
  return productsData.products as Product[];
}

/**
 * Get a single product by slug
 */
export function getProductBySlug(slug: string): Product | null {
  const products = getAllProducts();
  return products.find((p) => p.slug === slug) || null;
}

/**
 * Get a single product by ID
 */
export function getProductById(id: string): Product | null {
  const products = getAllProducts();
  return products.find((p) => p.id === id) || null;
}

/**
 * Validate product schema (basic validation)
 */
export function validateProductSchema(product: unknown): product is Product {
  if (!product || typeof product !== "object") {
    return false;
  }

  const p = product as Partial<Product>;

  return !!(
    p.id &&
    p.slug &&
    p.name &&
    p.description &&
    typeof p.basePrice === "number" &&
    p.estimatedPrintTime &&
    p.material &&
    Array.isArray(p.images) &&
    p.personalization
  );
}

/**
 * Get products count
 */
export function getProductsCount(): number {
  return getAllProducts().length;
}
