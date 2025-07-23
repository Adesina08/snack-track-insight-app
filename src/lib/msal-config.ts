import { Configuration, PopupRequest } from '@azure/msal-browser';

// Microsoft Entra External ID Configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_EXTERNAL_CLIENT_ID || '',
    authority: `https://${import.meta.env.VITE_ENTRA_EXTERNAL_TENANT_NAME}.ciamlogin.com/${import.meta.env.VITE_ENTRA_EXTERNAL_TENANT_ID}`,
    knownAuthorities: [`${import.meta.env.VITE_ENTRA_EXTERNAL_TENANT_NAME}.ciamlogin.com`],
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

// Scopes for ID token to be used at Microsoft Identity Platform endpoints
export const loginRequest: PopupRequest = {
  scopes: ['openid', 'profile', 'email'],
  prompt: 'select_account',
};

// Scopes for access token to be used at your API endpoints
export const tokenRequest = {
  scopes: [`api://${import.meta.env.VITE_ENTRA_EXTERNAL_CLIENT_ID}/access`],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};