const express = require("express");
const { createUser, listUsers, updateUser } = require("../controllers/userController");
const { ROLES } = require("../constants/roles");
const { authenticate } = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");
const { validate } = require("../middlewares/validate");
const { asyncHandler } = require("../utils/asyncHandler");
const { createUserSchema, updateUserSchema } = require("../validators/userValidators");

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get("/", asyncHandler(listUsers));
router.post("/", validate(createUserSchema), asyncHandler(createUser));
router.patch("/:userId", validate(updateUserSchema), asyncHandler(updateUser));

module.exports = { userRouter: router };
