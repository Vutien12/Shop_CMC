import api from './axiosInstance'

function unwrapResponse(res) {
  // Support multiple backend shapes seen in the project:
  // 1) res.data.result
  // 2) res.result
  // 3) res.data.data
  // 4) res.data (raw payload)
  if (!res) return null
  if (res.data) {
    if (res.data.result !== undefined) return res.data.result
    if (res.data.data !== undefined) return res.data.data
    // if data looks like the actual payload (e.g., object with keys like totalSales)
    if (typeof res.data === 'object') return res.data
  }
  if (res.result !== undefined) return res.result
  // fallback
  return res
}

export const getStats = async () => {
  const res = await api.get('/dashboard/stats')
  return unwrapResponse(res) || {}
}

export const getSalesAnalytics = async () => {
  const res = await api.get('/dashboard/sales-analytics')
  return unwrapResponse(res) || []
}

export const getLatestOrders = async (limit = 5) => {
  const res = await api.get(`/dashboard/latest-orders?limit=${limit}`)
  return unwrapResponse(res) || []
}

export const getTopProducts = async (limit = 5) => {
  const res = await api.get(`/dashboard/top-products?limit=${limit}`)
  return unwrapResponse(res) || []
}

export const getLatestReviews = async (limit = 5) => {
  const res = await api.get(`/dashboard/latest-reviews?limit=${limit}`)
  return unwrapResponse(res) || []
}

export const getBestSellingProducts = async (limit = 5) => {
  const res = await api.get(`/dashboard/best-selling-products?limit=${limit}`)
  return unwrapResponse(res) || []
}

export default {
  getStats,
  getSalesAnalytics,
  getLatestOrders,
  getTopProducts,
  getLatestReviews,
  getBestSellingProducts,
}
