// src/config/oauth.js
export const OAuthProviders = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth2/callback/google`
  },
  facebook: {
    clientId: import.meta.env.VITE_FACEBOOK_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth2/callback/facebook`
  }
};
