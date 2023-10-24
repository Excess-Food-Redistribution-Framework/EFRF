/**
 * Returns the expiration time of the jwtToken
 * @param jwtToken JWT token
 * @returns number The expiration time of the jwtToken
 */
function getTokenExpiration(jwtToken: string | null): number {
  if (!jwtToken) return 0;

  const base64Url = jwtToken.split('.')[1] || '';
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64) || '{}').exp * 1000 || 0;
}

/**
 * Returns true if the jwtToken is expired, false otherwise
 * @param jwtToken JWT token
 * @returns boolean True if the jwtToken is expired, false otherwise
 */
function isTokenExpired(jwtToken: string | null) {
  return getTokenExpiration(jwtToken) < Date.now();
}

export { getTokenExpiration, isTokenExpired };
