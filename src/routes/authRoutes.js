const express = require("express");
const { login, getProfile, logout } = require("../controllers/authController");
const { authenticate } = require("../middlewares/authenticate");
const { validate } = require("../middlewares/validate");
const { asyncHandler } = require("../utils/asyncHandler");
const { loginSchema } = require("../validators/authValidators");

const router = express.Router();

router.post("/login", validate(loginSchema), asyncHandler(login));
router.post("/logout", authenticate, asyncHandler(logout));
router.get("/me", authenticate, asyncHandler(getProfile));

module.exports = { authRouter: router };
