const { User } = require("../models/User");
const { AUTH_COOKIE_NAME } = require("../constants/auth");
const { ApiError } = require("../utils/ApiError");
const { verifyToken } = require("../utils/jwt");

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  const cookieToken = req.cookies ? req.cookies[AUTH_COOKIE_NAME] : null;
  const token = cookieToken || bearerToken;

  if (!token) {
    return next(new ApiError(401, "Authentication token is required"));
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      return next(new ApiError(401, "User associated with token no longer exists"));
    }

    if (user.status !== "active") {
      return next(new ApiError(403, "Inactive users cannot access the system"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired authentication token"));
  }
}

module.exports = { authenticate };
