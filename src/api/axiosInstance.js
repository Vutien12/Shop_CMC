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

function normalizeUrlForMatch(url) {
  if (!url) return ''
  try {
    // If absolute URL provided, get pathname; otherwise keep as-is
    if (url.startsWith('http')) {
      return new URL(url).pathname
    }
  } catch {
    // Ignore URL parsing errors
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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (!token) return config

  const url = config.url || ''
  const method = (config.method || 'GET').toUpperCase()

  const isOptional = isOptionalJwtEndpoint(url, method)
  const isNonPublic = !isPublicEndpoint(url, method)
  const isProtectedUser = isProtectedUserEndpoint(url, method)

  if (isOptional || isNonPublic || isProtectedUser) {
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
      !isPublicEndpoint(originalRequest.url, originalRequest.method) &&
      localStorage.getItem('accessToken')
    ) {
      originalRequest._retry = true
      try {
        const res = await api.post('/auth/refresh')
        const { accessToken } = res.data.result

        localStorage.setItem('accessToken', accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userEmail')
        await router.push('/login')
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)
export default api
