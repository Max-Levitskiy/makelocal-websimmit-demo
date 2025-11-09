import type { CoordinatorProduct, ProductParameter } from "@/types/api";
import type {
  ColorOption,
  ColorSelectConfig,
  PersonalizationOptions,
  Product,
  TextInputConfig,
} from "@/types/product";

/**
 * Convert hex color string to a proper format
 */
export function normalizeHexColor(color: string): string {
  // If it's already a hex color, return it
  if (color.startsWith("#")) {
    return color;
  }
  // If it's a color name, convert to hex (basic mapping)
  const colorMap: Record<string, string> = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#10b981",
    yellow: "#f59e0b",
    black: "#1f2937",
    white: "#ffffff",
    gray: "#6b7280",
    grey: "#6b7280",
    purple: "#a855f7",
    pink: "#ec4899",
    orange: "#f97316",
  };
  return colorMap[color.toLowerCase()] || "#6b7280";
}

/**
 * Default colors to show when no options are specified
 */
const DEFAULT_COLORS = [
  "Black",
  "White",
  "Gray",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Purple",
  "Pink",
];

/**
 * Transform ProductParameter to ColorSelectConfig
 */
export function transformColorParameter(
  param: ProductParameter,
): ColorSelectConfig | null {
  if (param.type !== "color") {
    return null;
  }

  // Use provided options if available, otherwise use default colors
  const colorNames =
    param.options && param.options.length > 0 ? param.options : DEFAULT_COLORS;

  const colorOptions: ColorOption[] = colorNames.map((colorName) => ({
    id: colorName.toLowerCase(),
    name: colorName,
    hex: normalizeHexColor(colorName),
    available: true,
  }));

  return {
    label: param.description ?? "Choose Color",
    required: param.is_required ?? false,
    options: colorOptions,
  };
}

/**
 * Transform ProductParameter to TextInputConfig
 */
export function transformTextParameter(
  param: ProductParameter,
): TextInputConfig | null {
  if (param.type !== "text") {
    return null;
  }

  return {
    label: param.description || param.name,
    placeholder: param.placeholder,
    required: param.is_required ?? false,
    minLength: 0, // Could be extracted from parameter if available
    maxLength: 50, // Default, could be configured
    validation: undefined,
    errorMessage: undefined,
  };
}

/**
 * Transform changeable_parameters to PersonalizationOptions
 */
export function transformPersonalizationOptions(
  changeableParameters: ProductParameter[] | null,
): PersonalizationOptions {
  const personalization: PersonalizationOptions = {};

  if (!changeableParameters) {
    return personalization;
  }

  // Find and transform color parameter
  const colorParam = changeableParameters.find(
    (param) => param.type === "color",
  );
  if (colorParam) {
    const colorConfig = transformColorParameter(colorParam);
    if (colorConfig) {
      personalization.colorSelect = colorConfig;
    }
  }

  // Find and transform text parameter
  const textParam = changeableParameters.find((param) => param.type === "text");
  if (textParam) {
    const textConfig = transformTextParameter(textParam);
    if (textConfig) {
      personalization.textInput = textConfig;
    }
  }

  return personalization;
}

/**
 * Transform API product to local Product type
 */
export function transformProduct(apiProduct: CoordinatorProduct): Product {
  return {
    id: apiProduct.id,
    slug: apiProduct.slug || apiProduct.id,
    name: apiProduct.title,
    description: apiProduct.description || "",
    basePrice: apiProduct.price || 0,
    estimatedPrintTime: "20 min", // Default, could be extracted from parameters
    material: "PLA", // Default, could be extracted from parameters
    images: [
      apiProduct.featured_image ?? "",
      ...(apiProduct.photos ?? []),
    ].filter(Boolean),
    personalization: transformPersonalizationOptions(
      apiProduct.changeable_parameters,
    ),
    metadata: {},
  };
}
