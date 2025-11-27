// src/User/stores/wishlistStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { searchWishlist } from '@/api/accountApi.js';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/Config/search.js'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref([]);
  const totalPages = ref(0);
  const currentPage = ref(0);
  const isLoading = ref(false);
  const lastFetched = ref(null);
  const loadedPages = ref(new Set());
  const CACHE_DURATION = 2 * 60 * 1000;
  const pageDefault = ref(DEFAULT_PAGE);
  const pageSize = ref(DEFAULT_PAGE_SIZE.wishlist);

  const fetchWishlist = async (page = pageDefault.value, size = pageSize.value, force = false) => {
    const cacheKey = `${page}-${size}`;
    const now = Date.now();

    // Cache kiểm tra
    if (
      !force &&
      loadedPages.value.has(cacheKey) &&
      lastFetched.value?.key === cacheKey &&
      now - lastFetched.value.ts < CACHE_DURATION
    ) {
      return { items: items.value, totalPages: totalPages.value };
    }

    isLoading.value = true;
    try {
      const res = await searchWishlist(page, size);
      // res is now {code: 200, message: 'Success', result: {...}}
      const data = res.result;

      const formatted = data.content.map(item => {
        // Tách tên sản phẩm và biến thể
        let productName = item.productName;
        let variantDisplay = '';

        if (item.productName) {
          const parts = item.productName.split(' - ');
          if (parts.length > 1) {
            productName = parts[0];
            variantDisplay = parts.slice(1).join(' - ');
          }
        }

        return {
          id: item.id,
          productId: item.productId,  // IMPORTANT: Need for adding to cart
          variantId: item.variantId,
          productName,           // Tên chính
          variantDisplay,        // Biến thể
          productSku: item.productSku,
          productPrice: item.productPrice,
          currency: item.currency || 'VND',
          productImage: item.productImage || '/images/placeholder.jpg',
          status: item.status,
          addedAt: new Date(item.addedAt).toLocaleDateString('vi-VN'),
          rawPrice: item.productPrice,
        };
      });

      items.value = formatted;
      totalPages.value = data.totalPages;
      currentPage.value = page;
      pageSize.value = size;
      lastFetched.value = { key: cacheKey, ts: now };
      loadedPages.value.add(cacheKey);

      return { items: formatted, totalPages: data.totalPages };
    } catch (error) {
      console.error('Fetch wishlist failed:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const removeItemLocally = (id) => {
    items.value = items.value.filter(i => i.id !== id);
    if (items.value.length === 0 && currentPage.value > 0) {
      currentPage.value -= 1;
    }
  };

  const updateItemLocally = (id, updatedData) => {
    const index = items.value.findIndex(i => i.id === id);
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...updatedData, status: 'AVAILABLE' };
    }
  };

  const addToCart = async (item) => {
    // Check if item can be added to cart
    const disabledStatuses = ['OUT_OF_STOCK', 'INACTIVE', 'DELETED'];
    if (disabledStatuses.includes(item.status)) {
      throw new Error(`Cannot add to cart: ${item.status}`);
    }

    try {
      // Import APIs and stores
      const { useCartStore } = await import('@/User/stores/cartStore.js');
      const cartStore = useCartStore();

      // Check if we have productId
      if (!item.productId) {
        throw new Error('ProductId is missing from wishlist item. Please update your wishlist or contact support.');
      }

      // Fetch product detail to get complete variant structure with variations
      const { getProductById } = await import('@/api/productApi.js');
      const productDetail = await getProductById(item.productId);

      if (productDetail.code !== 200 || !productDetail.result) {
        throw new Error('Failed to fetch product detail');
      }

      const product = productDetail.result;
      const variant = product.variants?.find(v => v.id === item.variantId);

      if (!variant) {
        throw new Error('Variant not found in product');
      }

      console.log('🔍 DEBUG: Full product structure:', {
        productId: product.id,
        productName: product.name,
        hasVariations: !!product.variations,
        variationsCount: product.variations?.length || 0,
        variations: product.variations,
        hasVariants: !!product.variants,
        variantsCount: product.variants?.length || 0
      });

      console.log('🔍 DEBUG: Variant found:', {
        id: variant.id,
        name: variant.name,
        sku: variant.sku,
        hasVariationValues: !!variant.variationValues,
        variationValuesCount: variant.variationValues?.length || 0,
        variationValues: variant.variationValues,
        allKeys: Object.keys(variant)
      });

      // Build cartItemVariations
      const cartItemVariations = [];

      // Method 1: If variant has variationValues directly
      if (variant.variationValues && Array.isArray(variant.variationValues) && variant.variationValues.length > 0) {
        console.log('✅ Method 1: Building from variant.variationValues');

        variant.variationValues.forEach((vv, index) => {
          console.log(`  VariationValue ${index + 1}:`, vv);

          const cartItemVariation = {
            variationId: vv.variationId,
            type: vv.type || 'TEXT',
            value: vv.value || vv.label || '',
            cartItemVariationValues: [{
              variationValueId: vv.id
            }]
          };

          console.log('  → Built:', cartItemVariation);
          cartItemVariations.push(cartItemVariation);
        });
      }
      // Method 2: Fallback - reconstruct from variant name matching with variations
      else if (product.variations && Array.isArray(product.variations) && product.variations.length > 0) {
        console.log('⚠️ Method 2: FALLBACK - Reconstructing cartItemVariations from product.variations');
        console.warn('⚠️ Backend should include variationValues in variant response for better accuracy!');

        // Parse variant name to find matching variation values
        // Variant name format: "Product Name - Value1 - Value2 - ..."
        // Example: "Apple iPhone 15 Pro Max - Blue Titanium - 1TB"

        const variantNameLower = (variant.name || '').toLowerCase();
        console.log('🔍 Parsing variant name:', variant.name);
        console.log('🔍 Available variations:', product.variations.map(v => ({
          id: v.id,
          name: v.name,
          type: v.type,
          valuesCount: v.variationValues?.length || 0
        })));

        product.variations.forEach((variation, vIndex) => {
          console.log(`🔍 Processing variation ${vIndex + 1}: ${variation.name} (${variation.type})`);

          if (variation.variationValues && Array.isArray(variation.variationValues)) {
            console.log(`  Available values:`, variation.variationValues.map(vv => vv.label));

            // Try to find matching variation value
            // Check each variation value to see if it appears in variant name
            let matchingValue = null;
            let maxMatchLength = 0;

            for (const vv of variation.variationValues) {
              const labelLower = (vv.label || '').toLowerCase();
              const valueLower = (vv.value || '').toLowerCase();

              // Check if label or value appears in variant name
              if (labelLower && variantNameLower.includes(labelLower)) {
                // Prefer longer matches (more specific)
                if (labelLower.length > maxMatchLength) {
                  matchingValue = vv;
                  maxMatchLength = labelLower.length;
                  console.log(`  ✅ Found match by label: "${vv.label}"`);
                }
              } else if (valueLower && variantNameLower.includes(valueLower)) {
                if (valueLower.length > maxMatchLength) {
                  matchingValue = vv;
                  maxMatchLength = valueLower.length;
                  console.log(`  ✅ Found match by value: "${vv.value}"`);
                }
              }
            }

            if (matchingValue) {
              const cartItemVariation = {
                variationId: variation.id,
                type: variation.type || 'TEXT',
                value: matchingValue.value || matchingValue.label || '',
                cartItemVariationValues: [{
                  variationValueId: matchingValue.id
                }]
              };

              console.log(`  ✅ Built variation for ${variation.name}:`, cartItemVariation);
              cartItemVariations.push(cartItemVariation);
            } else {
              console.warn(`  ⚠️ No match found for variation: ${variation.name}`);
            }
          } else {
            console.warn(`  ⚠️ Variation ${variation.name} has no variationValues`);
          }
        });

        console.log('📦 Fallback result:', {
          totalVariations: product.variations.length,
          matchedVariations: cartItemVariations.length,
          items: cartItemVariations
        });
      }
      else {
        console.error('❌ Cannot build cartItemVariations: product.variations is empty or missing');
        console.error('Product structure:', product);
      }

      console.log('📦 Built cartItemVariations:', {
        count: cartItemVariations.length,
        items: cartItemVariations
      });

      if (cartItemVariations.length === 0) {
        console.warn('⚠️ No cartItemVariations built from frontend');
        console.warn('⚠️ Sending minimal payload - backend should populate cartItemVariations from productVariantId');
      }

      // Build cart payload
      // Note: If cartItemVariations is empty, backend should be able to populate it
      // from productVariantId by looking up the variant's variation configuration
      const cartPayload = {
        cartItems: [
          {
            productId: item.productId,
            productVariantId: item.variantId,
            qty: 1,
            cartItemVariations: cartItemVariations.length > 0 ? cartItemVariations : undefined,
            cartItemOptions: []
          }
        ]
      };

      console.log('🛒 Final payload to send:', JSON.stringify(cartPayload, null, 2));

      // Add to cart
      await cartStore.addItem(cartPayload);

      return true;
    } catch (error) {
      console.error('❌ Failed to add wishlist item to cart:', error);
      throw error;
    }
  };

  return {
    items,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    fetchWishlist,
    removeItemLocally,
    updateItemLocally,
    addToCart,
    loadedPages
  };
});
