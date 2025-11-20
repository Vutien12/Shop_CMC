/**
 * Country utilities using i18n-iso-countries
 * Provides ISO-3166 compliant country list
 */

import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'

// Register English language
countries.registerLocale(enLocale)

// Cache countries list to avoid rebuilding
let cachedCountries = null
let cachedPopularCountries = null

/**
 * Get all countries as array of objects
 * @returns {Array} [{ code: 'VN', name: 'Vietnam' }, ...]
 */
export const getCountries = () => {
  // Return cached if available
  if (cachedCountries) return cachedCountries

  const countryCodes = countries.getAlpha2Codes()
  cachedCountries = countryCodes
    .map(code => ({
      code: code,
      name: countries.getName(code, 'en')
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return cachedCountries
}

/**
 * Get country name from ISO code
 * @param {string} code - ISO country code (e.g., 'VN')
 * @returns {string} Country name
 */
export const getCountryName = (code) => {
  return countries.getName(code, 'en') || code
}

/**
 * Get ISO code from country name
 * @param {string} name - Country name (e.g., 'Vietnam')
 * @returns {string} ISO country code
 */
export const getCountryCode = (name) => {
  const codes = countries.getAlpha2Codes()
  return codes.find(code => countries.getName(code, 'en') === name) || null
}

/**
 * List of popular countries (for checkout optimization)
 * @returns {Array} Popular countries sorted to top
 */
export const getPopularCountries = () => {
  // Return cached if available
  if (cachedPopularCountries) return cachedPopularCountries

  const popular = ['VN', 'US', 'GB', 'CA', 'AU', 'SG', 'TH', 'JP', 'KR', 'CN']
  const allCountries = getCountries()

  // Separate popular and others
  const popularList = allCountries.filter(c => popular.includes(c.code))
  const otherList = allCountries.filter(c => !popular.includes(c.code))

  // Return popular first, then others
  cachedPopularCountries = [...popularList, ...otherList]
  return cachedPopularCountries
}

/**
 * Validate if country code is valid ISO-3166
 * @param {string} code - ISO country code
 * @returns {boolean}
 */
export const isValidCountryCode = (code) => {
  return countries.isValid(code)
}

