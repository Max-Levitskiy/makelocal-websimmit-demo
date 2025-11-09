"use client";

import Link from "next/link";
import { Button } from "@/components/shared/Button";
import type { Product } from "@/types/product";
import { PhotoSlider } from "./PhotoSlider";

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-none">
      {/* Product Images Slider */}
      <PhotoSlider images={product.images} alt={product.name} />

      {/* Product Info */}
      <div className="flex flex-col gap-3 flex-1">
        <h3 className="text-base font-bold leading-normal text-slate-900 dark:text-white">
          {product.name}
        </h3>

        <p className="text-sm font-normal leading-normal text-slate-600 dark:text-slate-400">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
            ~{product.estimatedPrintTime}
          </span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
            {product.material}
          </span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
            €{product.basePrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Link href={`/product/${product.slug}`} className="mt-auto">
        <Button variant="primary" size="small" fullWidth>
          Personalize
        </Button>
      </Link>
    </div>
  );
}
