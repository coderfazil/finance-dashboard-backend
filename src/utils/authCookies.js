const { env } = require("../config/env");
const { AUTH_COOKIE_NAME } = require("../constants/auth");

function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    maxAge: 24 * 60 * 60 * 1000,
  };
}

function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
}

function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, getAuthCookieOptions());
}

module.exports = { setAuthCookie, clearAuthCookie };
