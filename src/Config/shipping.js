/**
 * Shipping configuration for GHN (Giao Hàng Nhanh)
 */

export const SHIPPING_CONFIG = {
  // Shop's district ID for calculating shipping fees
  SHOP_DISTRICT_ID: 1542,

  // Shop's ward code (optional, but recommended for accurate fee calculation)
  SHOP_WARD_CODE: '',

  // Default dimensions for products without dimension data (in cm)
  DEFAULT_LENGTH: 10,
  DEFAULT_WIDTH: 10,
  DEFAULT_HEIGHT: 10,

  // Default weight for products without weight data (in grams)
  DEFAULT_WEIGHT: 100,

  // Default service type: 2 = Express
  DEFAULT_SERVICE_TYPE_ID: 2,
}

