import { Configuration, PopupRequest } from '@azure/msal-browser';

// Azure AD B2C Configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_AD_B2C_CLIENT_ID || '',
    authority: `https://${import.meta.env.VITE_AZURE_AD_B2C_TENANT_NAME}.b2clogin.com/${import.meta.env.VITE_AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/${import.meta.env.VITE_AZURE_AD_B2C_POLICY_NAME}`,
    knownAuthorities: [`${import.meta.env.VITE_AZURE_AD_B2C_TENANT_NAME}.b2clogin.com`],
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
  scopes: [`https://${import.meta.env.VITE_AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/${import.meta.env.VITE_AZURE_AD_B2C_API_SCOPE}/access`],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};