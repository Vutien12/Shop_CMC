import axios from 'axios'
import router from '@/Router/routes.js'

const PUBLIC_ENDPOINT_RULES = [
  { path: '/auth/**', methods: ['ALL'] },
  { path: '/auth/oauth2/callback/**', methods: ['ALL'] },
  { path: '/users', methods: ['POST'] }, // signup only
  { path: '/payment/webhook', methods: ['POST'] },
  { path: '/blogs/**', methods: ['GET'] },
  { path: '/brands/**', methods: ['GET'] },
  { path: '/categories/**', methods: ['GET'] },
  { path: '/options/**', methods: ['GET'] },
  { path: '/variations/**', methods: ['GET'] },
  { path: '/files/**', methods: ['GET'] },
  { path: '/entity-files/**', methods: ['GET'] },
  { path: '/ws/**', methods: ['ALL'] },
  { path: '/uploads/**', methods: ['ALL'] },
  { path: '/contact', methods: ['GET', 'POST'] },
  { path: '/flash-sales/active', methods: ['GET'] },
]

const OPTIONAL_JWT_ENDPOINTS = [
  { path: '/products/**', methods: ['GET'] },
  { path: '/reviews/**', methods: ['GET'] },
]

const PROTECTED_USER_ENDPOINTS = [
  { path: '/users/my-info', methods: ['GET'] },
  { path: '/users/profile', methods: ['PUT'] },
  { path: '/users/change-password', methods: ['POST'] },
]

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  withCredentials: true,
  timeout: 10000,
})

// Helper để decode JWT token
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function isTokenExpiringSoon(token) {
  if (!token) return true
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true

  const expiryTime = decoded.exp * 1000 // Convert to milliseconds
  const currentTime = Date.now()
  const timeLeft = expiryTime - currentTime
  return timeLeft < 60000
}

let isRefreshing = false
let failedQueue = []
let refreshTokenTimer = null

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Hàm refresh token tự động
async function autoRefreshToken() {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    stopAutoRefresh()
    return
  }

  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) {
    stopAutoRefresh()
    return
  }

  const expiryTime = decoded.exp * 1000
  const currentTime = Date.now()
  const timeLeft = expiryTime - currentTime

  // Nếu token còn hơn 2 phút, refresh ngay
  // Nếu không, chờ đến khi còn 2 phút
  const refreshDelay = timeLeft > 120000 ? timeLeft - 120000 : 0

  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer)
  }

  refreshTokenTimer = setTimeout(async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
        {},
        { withCredentials: true }
      )
      const { accessToken } = res.data.result
      localStorage.setItem('accessToken', accessToken)
      console.log('✅ Auto-refreshed token')

      // Schedule next refresh
      autoRefreshToken()
    } catch (err) {
      console.error('❌ Auto-refresh failed:', err)
      stopAutoRefresh()
      localStorage.removeItem('accessToken')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userEmail')
      await router.push('/login')
    }
  }, refreshDelay)
}

// Dừng auto refresh
function stopAutoRefresh() {
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer)
    refreshTokenTimer = null
  }
}

// Bắt đầu auto refresh khi có token
function startAutoRefresh() {
  const token = localStorage.getItem('accessToken')
  if (token) {
    autoRefreshToken()
  }
}

export { startAutoRefresh, stopAutoRefresh }

function normalizeUrlForMatch(url) {
  if (!url) return ''
  try {
    if (url.startsWith('http')) {
      return new URL(url).pathname
    }
  } catch (e) {
    // Ignore invalid URLs
  }
  return url
}

function matchesRule(rulePath, requestPath) {
  if (!rulePath || !requestPath) return false
  if (rulePath.endsWith('/**')) {
    const base = rulePath.replace('/**', '')
    return requestPath === base || requestPath.startsWith(base + '/')
  }
  return requestPath === rulePath || requestPath.startsWith(rulePath + '/')
}

function isPublicEndpoint(url, method) {
  const reqPath = normalizeUrlForMatch(url)
  const reqMethod = (method || 'GET').toUpperCase()

  for (const rule of PUBLIC_ENDPOINT_RULES) {
    if (matchesRule(rule.path, reqPath)) {
      if (rule.methods.includes('ALL')) return true
      if (rule.methods.map((m) => m.toUpperCase()).includes(reqMethod)) return true
    }
  }
  return false
}

function isOptionalJwtEndpoint(url, method) {
  const reqPath = normalizeUrlForMatch(url)
  const reqMethod = (method || 'GET').toUpperCase()

  for (const rule of OPTIONAL_JWT_ENDPOINTS) {
    if (matchesRule(rule.path, reqPath)) {
      if (rule.methods.includes('ALL')) return true
      if (rule.methods.map(m => m.toUpperCase()).includes(reqMethod)) return true
    }
  }
  return false
}

function isProtectedUserEndpoint(url, method) {
  const reqPath = normalizeUrlForMatch(url)
  const reqMethod = (method || 'GET').toUpperCase()

  for (const rule of PROTECTED_USER_ENDPOINTS) {
    if (matchesRule(rule.path, reqPath)) {
      if (rule.methods.includes('ALL')) return true
      if (rule.methods.map(m => m.toUpperCase()).includes(reqMethod)) return true
    }
  }
  return false
}

api.interceptors.request.use(async (config) => {
  // Bỏ qua refresh token endpoint để tránh loop
  if (config.url?.includes('/auth/refresh')) {
    return config
  }

  let token = localStorage.getItem('accessToken')

  const url = config.url || ''
  const method = (config.method || 'GET').toUpperCase()

  const isOptional = isOptionalJwtEndpoint(url, method)
  const isNonPublic = !isPublicEndpoint(url, method)
  const isProtectedUser = isProtectedUserEndpoint(url, method)
  const needsAuth = isOptional || isNonPublic || isProtectedUser

  if (token && needsAuth && isTokenExpiringSoon(token)) {
    if (isRefreshing) {
      try {
        token = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
      } catch (err) {
        return Promise.reject(err)
      }
    } else {
      isRefreshing = true
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const { accessToken } = res.data.result
        localStorage.setItem('accessToken', accessToken)
        token = accessToken
        processQueue(null, accessToken)

        await autoRefreshToken()
      } catch (err) {
        processQueue(err, null)
        stopAutoRefresh()
        localStorage.removeItem('accessToken')
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userEmail')
        await router.push('/login')
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
  }

  if (token && needsAuth) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !isPublicEndpoint(originalRequest.url, originalRequest.method)
    ) {
      const token = localStorage.getItem('accessToken')

      // Nếu không có token, redirect về login
      if (!token) {
        stopAutoRefresh()
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userEmail')
        await router.push('/login')
        return Promise.reject(error)
      }

      originalRequest._retry = true

      if (isRefreshing) {
        // Nếu đang refresh, thêm request vào queue
        try {
          const newToken = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        } catch (err) {
          return Promise.reject(err)
        }
      }

      isRefreshing = true

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const { accessToken } = res.data.result

        localStorage.setItem('accessToken', accessToken)
        processQueue(null, accessToken)

        // Start auto-refresh after successful refresh
        autoRefreshToken()

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        stopAutoRefresh()
        localStorage.removeItem('accessToken')
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userEmail')
        await router.push('/login')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)
export default api
