const express = require("express");
const {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");
const { ROLES } = require("../constants/roles");
const { authenticate } = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");
const { validate } = require("../middlewares/validate");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  createRecordSchema,
  updateRecordSchema,
  listRecordsSchema,
  recordIdParamSchema,
} = require("../validators/recordValidators");

const router = express.Router();

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN, ROLES.ANALYST), validate(listRecordsSchema), asyncHandler(listRecords));
router.get("/:recordId", authorize(ROLES.ADMIN, ROLES.ANALYST), validate(recordIdParamSchema), asyncHandler(getRecordById));
router.post("/", authorize(ROLES.ADMIN), validate(createRecordSchema), asyncHandler(createRecord));
router.patch("/:recordId", authorize(ROLES.ADMIN), validate(updateRecordSchema), asyncHandler(updateRecord));
router.delete("/:recordId", authorize(ROLES.ADMIN), validate(recordIdParamSchema), asyncHandler(deleteRecord));

module.exports = { recordRouter: router };
