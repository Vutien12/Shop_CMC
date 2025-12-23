/**
 * Utility functions for JWT token handling
 */

/**
 * Decode JWT token payload without verification
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decode payload (second part) - handle base64url and UTF-8
    let payload = parts[1];

    // Convert base64url to base64
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    const pad = payload.length % 4;
    if (pad) {
      payload += '='.repeat(4 - pad);
    }

    const binary = atob(payload);

    // Convert binary string to a Uint8Array of bytes
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Decode UTF-8 bytes into string. Use TextDecoder when available for correctness.
    let decoded = null;
    if (typeof TextDecoder !== 'undefined') {
      decoded = new TextDecoder('utf-8').decode(bytes);
    } else {
      // Fallback for environments without TextDecoder
      const percentEncoded = Array.prototype.map.call(bytes, (byte) => '%' + ('00' + byte.toString(16)).slice(-2)).join('');
      decoded = decodeURIComponent(percentEncoded);
    }

    // Parse JSON
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Get access token from localStorage
 * @returns {string|null}
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Extract user info from JWT token
 * @returns {object} User info object with name, email, role
 */
export const getUserInfoFromToken = () => {
  const token = getAccessToken();
  const payload = decodeJWT(token);

  if (!payload) {
    return {
      name: null,
      email: null,
      role: null,
      firstName: null,
      lastName: null,
      isValid: false
    };
  }

  // Extract name from 'name' field (format: "Phùng Văn Vũ")
  const fullName = payload.name || '';
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Extract role from 'scope' field (format: "ROLE_ADMIN")
  const roleScope = payload.scope || '';
  const role = roleScope.replace('ROLE_', '');

  return {
    name: fullName,
    firstName: firstName,
    lastName: lastName,
    email: payload.sub || null, // 'sub' contains email
    role: role,
    userId: payload.user_id || null,
    isValid: true
  };
};

/**
 * Check if JWT token is expired
 * @returns {boolean}
 */
export const isTokenExpired = () => {
  const token = getAccessToken();
  const payload = decodeJWT(token);

  if (!payload || !payload.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};
