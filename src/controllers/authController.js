const { clearAuthCookie, setAuthCookie } = require("../utils/authCookies");
const authService = require("../services/authService");

async function login(req, res) {
  const { token, user } = await authService.loginUser(req.body);
  setAuthCookie(res, token);

  res.json({
    success: true,
    message: "Login successful",
    data: {
      user,
    },
  });
}

async function getProfile(req, res) {
  res.json({
    success: true,
    data: authService.getProfile(req.user),
  });
}

async function logout(req, res) {
  clearAuthCookie(res);

  res.json({
    success: true,
    message: "Logout successful",
  });
}

module.exports = { login, getProfile, logout };
