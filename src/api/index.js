/**
 * Central export file for all API functions
 * Import from here for convenience: import { createProduct, getBrands } from '@/api'
 */

// Product APIs
export {
  searchProducts,
  getProductById,
  getProductForEdit,
  createProduct,
  updateProduct,
  deleteProduct
} from './productApi.js';

// Brand APIs
export {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
} from './brandApi.js';

// Category APIs
export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from './categoryApi.js';

// Variation APIs
export {
  getVariations,
  getGlobalVariations,
  getVariationById,
  createVariation,
  updateVariation,
  deleteVariation
} from './variationApi.js';

// Option APIs
export {
  getOptions,
  getGlobalOptions,
  getOptionById,
  createOption,
  updateOption,
  deleteOption
} from './optionApi.js';

// Cart APIs
export * from './cartApi.js';

// Order APIs
export * from './orderApi.js';

// Auth APIs
export * from './authApi.js';

// Account APIs
export * from './accountApi.js';

// Blog APIs
export * from './blogApi.js';

// File APIs
export * from './fileApi.js';

// Contact APIs
export * from './contactApi.js';

// User APIs
export * from './userApi.js';
