/**
 * Coupon Validation and Discount Calculation Utilities
 * Matches backend logic to ensure consistent calculations
 */

/**
 * Validate coupon against current conditions
 * @param {Object} coupon - Coupon object from API
 * @param {number} subtotal - Order subtotal
 * @returns {Object} - { isValid: boolean, error: string|null }
 */
export const validateCoupon = (coupon, subtotal) => {
  const now = new Date();

  // Check if coupon is active
  if (!coupon.isActive) {
    return {
      isValid: false,
      error: 'Mã giảm giá không còn hoạt động'
    };
  }

  // Check start date
  if (coupon.startDate) {
    const startDate = new Date(coupon.startDate);
    if (now < startDate) {
      return {
        isValid: false,
        error: 'Mã giảm giá chưa có hiệu lực'
      };
    }
  }

  // Check end date
  if (coupon.endDate) {
    const endDate = new Date(coupon.endDate);
    if (now > endDate) {
      return {
        isValid: false,
        error: 'Mã giảm giá đã hết hạn'
      };
    }
  }

  // Check usage limit
  if (coupon.usageLimit !== null && coupon.usageLimit > 0) {
    if (coupon.usedCount >= coupon.usageLimit) {
      return {
        isValid: false,
        error: 'Mã giảm giá đã hết lượt sử dụng'
      };
    }
  }

  // Check minimum order amount
  if (coupon.minOrderAmount !== null && subtotal < coupon.minOrderAmount) {
    return {
      isValid: false,
      error: `Đơn hàng tối thiểu ${formatPrice(coupon.minOrderAmount)} để áp dụng mã này`
    };
  }

  return { isValid: true, error: null };
};

/**
 * Calculate discount amount based on coupon type
 * @param {Object} coupon - Coupon object from API
 * @param {number} subtotal - Order subtotal
 * @returns {number} - Discount amount
 */
export const calculateDiscount = (coupon, subtotal) => {
  let discount = 0;

  if (coupon.discountType === 'FIXED') {
    // Fixed discount
    discount = coupon.discountValue;
  } else if (coupon.discountType === 'PERCENT') {
    // Percentage discount
    discount = (subtotal * coupon.discountValue) / 100;

    // Apply max discount cap if exists
    if (coupon.maxDiscount !== null && coupon.maxDiscount > 0) {
      if (discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }
  }

  // Discount cannot exceed subtotal
  if (discount > subtotal) {
    discount = subtotal;
  }

  return Math.round(discount); // Round to nearest integer
};

/**
 * Format price to VND
 * @param {number} price
 * @returns {string}
 */
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
    .format(price || 0)
    .replace('₫', 'đ');
};

/**
 * Get coupon display info for UI
 * @param {Object} coupon
 * @param {number} subtotal
 * @returns {Object} - Display information
 */
export const getCouponDisplayInfo = (coupon, subtotal) => {
  const validation = validateCoupon(coupon, subtotal);

  if (!validation.isValid) {
    return {
      isValid: false,
      error: validation.error,
      discount: 0,
      description: coupon.description || ''
    };
  }

  const discount = calculateDiscount(coupon, subtotal);

  return {
    isValid: true,
    error: null,
    discount,
    description: coupon.description || '',
    code: coupon.code,
    id: coupon.id
  };
};

