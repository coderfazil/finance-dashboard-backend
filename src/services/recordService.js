const { FinancialRecord } = require("../models/FinancialRecord");
const { ApiError } = require("../utils/ApiError");

function buildRecordFilters(query) {
  const filters = {};

  if (query.type) {
    filters.type = query.type;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.search) {
    filters.notes = { $regex: query.search, $options: "i" };
  }

  if (query.startDate || query.endDate) {
    filters.date = {};

    if (query.startDate) {
      filters.date.$gte = query.startDate;
    }

    if (query.endDate) {
      filters.date.$lte = query.endDate;
    }
  }

  return filters;
}

async function createRecord(payload, userId) {
  return FinancialRecord.create({
    ...payload,
    createdBy: userId,
    updatedBy: userId,
  });
}

async function listRecords(query) {
  const { page, limit, sortBy, sortOrder } = query;
  const filters = buildRecordFilters(query);
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [records, total] = await Promise.all([
    FinancialRecord.find(filters)
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    FinancialRecord.countDocuments(filters),
  ]);

  return {
    records,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

async function getRecordById(recordId) {
  const record = await FinancialRecord.findById(recordId)
    .populate("createdBy", "name email role")
    .populate("updatedBy", "name email role");

  if (!record) {
    throw new ApiError(404, "Record not found");
  }

  return record;
}

async function updateRecord(recordId, payload, userId) {
  const record = await FinancialRecord.findById(recordId);

  if (!record) {
    throw new ApiError(404, "Record not found");
  }

  Object.assign(record, payload, { updatedBy: userId });
  await record.save();

  return record;
}

async function deleteRecord(recordId) {
  const record = await FinancialRecord.findByIdAndDelete(recordId);

  if (!record) {
    throw new ApiError(404, "Record not found");
  }
}

module.exports = {
  buildRecordFilters,
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
