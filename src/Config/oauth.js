const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const OAuthProviders = {
  google: `${API_BASE}/oauth2/authorization/google`,
  facebook: `${API_BASE}/oauth2/authorization/facebook`,
};
