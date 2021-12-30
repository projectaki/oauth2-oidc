export const auth0Config = {
  config: {
    authority: 'https://dev-s6gdxbj4.eu.auth0.com',
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: 'CzhZ0ALKPCPHK9DuTHpdl2TcABge7ZCH',
    scope: 'openid offline_access email',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    customParamsAuthRequest: {
      audience: 'human-risks-api',
    },
    customParamsRefreshTokenRequest: {
      scope: 'openid offline_access email',
    },
  },
};
