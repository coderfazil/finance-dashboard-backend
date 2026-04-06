const express = require("express");
const { getDashboardSummary } = require("../controllers/dashboardController");
const { ROLES } = require("../constants/roles");
const { authenticate } = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");
const { validate } = require("../middlewares/validate");
const { asyncHandler } = require("../utils/asyncHandler");
const { dashboardSummarySchema } = require("../validators/dashboardValidators");

const router = express.Router();

router.get(
  "/summary",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER),
  validate(dashboardSummarySchema),
  asyncHandler(getDashboardSummary)
);

module.exports = { dashboardRouter: router };
