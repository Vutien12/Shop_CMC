/**
 * Discount calculation utilities matching backend logic
 */

/**
 * Check if special price is active based on time range
 * @param {Object} variant - Product variant object
 * @returns {boolean}
 */
export function isSpecialPriceActive(variant) {
  if (!variant || !variant.specialPrice || variant.specialPrice === 0) {
    return false
  }

  const now = new Date()
  const startDate = variant.specialPriceStart ? new Date(variant.specialPriceStart) : null
  const endDate = variant.specialPriceEnd ? new Date(variant.specialPriceEnd) : null

  // If no date range specified, special price is active
  if (!startDate && !endDate) {
    return true
  }

  // Check if current time is within the range
  if (startDate && now < startDate) {
    return false
  }

  if (endDate && now > endDate) {
    return false
  }

  return true
}

/**
 * Calculate selling price from special price (matches backend logic)
 * @param {Object} variant - Product variant with price and specialPrice
 * @returns {number|null} - Calculated selling price or null if no special price
 */
export function calculateSellingPrice(variant) {
  // If variant or base price not present, treat as no special price
  if (!variant || !variant.price) {
    return null
  }

  const price = parseFloat(variant.price)
  const specialPrice = parseFloat(variant.specialPrice)

  // Check if special price is active
  if (!isSpecialPriceActive(variant)) {
    return null // No special price or expired
  }

  // If specialPrice is null or 0, return null
  if (!specialPrice || specialPrice === 0) {
    return null
  }

  let sellingPrice = null

  // Calculate based on type
  if (variant.specialPriceType === 'PERCENT') {
    // Discount by percentage
    const discount = (specialPrice / 100) * price
    sellingPrice = price - discount
  } else if (variant.specialPriceType === 'FIXED') {
    // Fixed discount
    sellingPrice = price - specialPrice
  } else {
    // Unknown type -> no special price
    return null
  }

  // Ensure selling price is not negative
  return sellingPrice > 0 ? sellingPrice : 0
}

/**
 * Calculate discount percentage for a variant
 * @param {Object} variant - Product variant
 * @returns {number|null} - Discount percentage or null
 */
export function calculateDiscountPercent(variant) {
  if (!variant || !variant.price) {
    return null
  }

  const sellingPrice = calculateSellingPrice(variant)

  if (!sellingPrice || sellingPrice >= variant.price) {
    return null
  }

  const price = parseFloat(variant.price)
  const discountPercent = ((price - sellingPrice) / price) * 100

  return Math.round(discountPercent)
}

/**
 * Calculate discount display for a product (with multiple variants)
 * @param {Object} product - Product object with variants array
 * @returns {string|null} - Discount string like "-20%" or "-10% to -30%" or null
 */
export function calculateProductDiscount(product) {
  if (!product.variants || product.variants.length === 0) {
    return null
  }

  // Find all variants with active special prices and calculate their discount percentages
  const variantsWithDiscount = product.variants
    .map(variant => ({
      variant,
      discountPercent: calculateDiscountPercent(variant)
    }))
    .filter(v => v.discountPercent && v.discountPercent > 0)

  if (variantsWithDiscount.length === 0) {
    return null
  }

  // If there's only one variant with discount, use it
  if (variantsWithDiscount.length === 1) {
    return `-${variantsWithDiscount[0].discountPercent}%`
  }

  // If multiple variants, find the min and max discount percentages
  const discounts = variantsWithDiscount.map(v => v.discountPercent)
  const minDiscount = Math.min(...discounts)
  const maxDiscount = Math.max(...discounts)

  // If all discounts are the same, show single value
  if (minDiscount === maxDiscount) {
    return `-${minDiscount}%`
  }

  // Otherwise show range
  return `-${minDiscount}% to -${maxDiscount}%`
}

/**
 * Get the best (lowest) selling price from product variants
 * @param {Object} product - Product object with variants
 * @returns {number|null} - Best selling price or null
 */
export function getBestSellingPrice(product) {
  if (!product.variants || product.variants.length === 0) {
    return null
  }

  const sellingPrices = product.variants
    .map(variant => calculateSellingPrice(variant))
    .filter(price => price !== null)

  if (sellingPrices.length === 0) {
    return null
  }

  return Math.min(...sellingPrices)
}

