"use client";

import { useEffect, useState } from "react";
import { ColorSwatch } from "@/components/product/ColorSwatch";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Input } from "@/components/shared/Input";
import {
  getFieldError,
  type ValidationError,
  validateProductConfiguration,
} from "@/lib/products/product-validation";
import type { Customizations, Product } from "@/types/product";

export interface ProductConfigProps {
  product: Product;
  initialCustomizations?: Customizations;
  onCustomizationsChange?: (
    customizations: Customizations,
    isValid: boolean,
  ) => void;
}

export function ProductConfig({
  product,
  initialCustomizations,
  onCustomizationsChange,
}: ProductConfigProps) {
  const [customizations, setCustomizations] = useState<Customizations>(
    initialCustomizations || {},
  );
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Validate on change
  useEffect(() => {
    const result = validateProductConfiguration(product, customizations);
    setErrors(result.errors);

    if (onCustomizationsChange) {
      onCustomizationsChange(customizations, result.valid);
    }
  }, [customizations, product, onCustomizationsChange]);

  const handleTextChange = (value: string) => {
    setCustomizations((prev) => ({ ...prev, text: value }));
  };

  const handleTextBlur = () => {
    setTouched((prev) => new Set(prev).add("text"));
  };

  const handleColorSelect = (colorId: string) => {
    setCustomizations((prev) => ({ ...prev, colorId }));
    setTouched((prev) => new Set(prev).add("colorId"));
  };

  const textError = touched.has("text")
    ? getFieldError(errors, "text")
    : undefined;
  const colorError = touched.has("colorId")
    ? getFieldError(errors, "colorId")
    : undefined;

  useEffect(() => {
    console.log("product", product);
  }, [product]);

  return (
    <div className="flex flex-col gap-6">
      {/* Text Input Configuration */}
      {product.personalization.textInput && (
        <div>
          <Input
            label={product.personalization.textInput.label}
            placeholder={product.personalization.textInput.placeholder}
            value={customizations.text || ""}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={handleTextBlur}
            error={textError}
            maxLength={product.personalization.textInput.maxLength}
            required={product.personalization.textInput.required}
            aria-required={product.personalization.textInput.required}
          />
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {customizations.text?.length || 0} /{" "}
            {product.personalization.textInput.maxLength} characters
          </p>
        </div>
      )}

      {/* Color Selection */}
      {product.personalization.colorSelect && (
        <div>
          <p className="mb-3 block text-sm font-bold text-slate-800 dark:text-slate-200">
            {product.personalization.colorSelect.label}
            {product.personalization.colorSelect.required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </p>
          <div className="flex gap-3 flex-wrap">
            {product.personalization.colorSelect.options.map((color) => (
              <ColorSwatch
                key={color.id}
                color={color}
                selected={customizations.colorId === color.id}
                onClick={() => handleColorSelect(color.id)}
              />
            ))}
          </div>
          {colorError && (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {colorError}
            </p>
          )}
        </div>
      )}

      {/* General validation errors */}
      {errors.length > 0 && touched.size > 0 && (
        <ErrorMessage>
          <p className="font-bold mb-1">Please fix the following errors:</p>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error) => (
              <li key={error.field}>{error.message}</li>
            ))}
          </ul>
        </ErrorMessage>
      )}
    </div>
  );
}
