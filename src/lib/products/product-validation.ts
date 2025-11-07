import type {
  ColorSelectConfig,
  Customizations,
  Product,
  TextInputConfig,
} from "@/types/product";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate text input against configuration
 */
export function validateTextInput(
  text: string | undefined,
  config: TextInputConfig,
): ValidationError | null {
  // Check required
  if (config.required && (!text || text.trim().length === 0)) {
    return {
      field: "text",
      message: `${config.label} is required`,
    };
  }

  // If not required and empty, it's valid
  if (!text || text.trim().length === 0) {
    return null;
  }

  // Check min length
  if (text.length < config.minLength) {
    return {
      field: "text",
      message: `${config.label} must be at least ${config.minLength} character${config.minLength !== 1 ? "s" : ""}`,
    };
  }

  // Check max length
  if (text.length > config.maxLength) {
    return {
      field: "text",
      message: `${config.label} must be at most ${config.maxLength} character${config.maxLength !== 1 ? "s" : ""}`,
    };
  }

  // Check regex validation
  if (config.validation) {
    try {
      const regex = new RegExp(config.validation);
      if (!regex.test(text)) {
        return {
          field: "text",
          message:
            config.errorMessage ||
            `${config.label} contains invalid characters`,
        };
      }
    } catch (error) {
      console.error("Invalid regex pattern:", config.validation, error);
      return {
        field: "text",
        message: "Validation error occurred",
      };
    }
  }

  return null;
}

/**
 * Validate color selection against configuration
 */
export function validateColorSelection(
  colorId: string | undefined,
  config: ColorSelectConfig,
): ValidationError | null {
  // Check required
  if (config.required && !colorId) {
    return {
      field: "colorId",
      message: `${config.label} is required`,
    };
  }

  // If not required and empty, it's valid
  if (!colorId) {
    return null;
  }

  // Check if color exists in options
  const colorOption = config.options.find((opt) => opt.id === colorId);
  if (!colorOption) {
    return {
      field: "colorId",
      message: "Selected color is not valid",
    };
  }

  // Check if color is available
  if (colorOption.available === false) {
    return {
      field: "colorId",
      message: `${colorOption.name} is currently unavailable`,
    };
  }

  return null;
}

/**
 * Validate complete product configuration
 */
export function validateProductConfiguration(
  product: Product,
  customizations: Customizations,
): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate text input if configured
  if (product.personalization.textInput) {
    const textError = validateTextInput(
      customizations.text,
      product.personalization.textInput,
    );
    if (textError) {
      errors.push(textError);
    }
  }

  // Validate color selection if configured
  if (product.personalization.colorSelect) {
    const colorError = validateColorSelection(
      customizations.colorId,
      product.personalization.colorSelect,
    );
    if (colorError) {
      errors.push(colorError);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get validation error message for a specific field
 */
export function getFieldError(
  errors: ValidationError[],
  field: string,
): string | undefined {
  const error = errors.find((e) => e.field === field);
  return error?.message;
}
