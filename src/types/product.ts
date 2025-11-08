/**
 * Product and personalization type definitions
 */

export interface Dimensions {
  width: number; // Millimeters
  height: number;
  depth: number;
}

export interface ColorOption {
  id: string; // Unique identifier (e.g., "red")
  name: string; // Display name (e.g., "Red")
  hex: string; // Hex color code (e.g., "#ef4444")
  available?: boolean; // Stock availability (default true)
}

export interface TextInputConfig {
  label: string; // Form label (e.g., "Your Initials")
  placeholder?: string; // Input placeholder
  required: boolean;
  minLength: number;
  maxLength: number;
  validation?: string; // Regex pattern for validation
  errorMessage?: string; // Custom error message
}

export interface ColorSelectConfig {
  label: string; // Form label (e.g., "Choose Color")
  required: boolean;
  options: ColorOption[];
}

export interface PersonalizationOptions {
  textInput?: TextInputConfig;
  colorSelect?: ColorSelectConfig;
  // Future: sizeSelect, materialSelect, etc.
}

export interface Product {
  id: string; // Unique identifier (e.g., "keychain-001")
  slug: string; // URL-friendly identifier (e.g., "personalized-keychain")
  name: string; // Display name
  description: string; // Marketing description
  basePrice: number; // Price in EUR (before customization)
  estimatedPrintTime: string; // Human-readable (e.g., "20 min")
  material: string; // Material type (e.g., "PLA", "PETG")
  images: string[]; // Array of image paths
  personalization: PersonalizationOptions;
  metadata?: {
    sku?: string;
    weight?: number; // Grams
    dimensions?: Dimensions;
  };
}

export interface Customizations {
  text?: string; // User-entered text (validated)
  colorId?: string; // Selected color ID
  // Future: size, material, etc.
}

export interface ProductConfiguration {
  productId: string; // References Product.id
  productSlug: string; // For URL generation
  productName: string; // Denormalized for cart display
  basePrice: number; // Denormalized from Product
  customizations: Customizations;
  configuredAt: number; // Unix timestamp
}
