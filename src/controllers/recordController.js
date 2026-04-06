const recordService = require("../services/recordService");

async function createRecord(req, res) {
  const record = await recordService.createRecord(req.body, req.user.id);

  res.status(201).json({
    success: true,
    message: "Record created successfully",
    data: record,
  });
}

async function listRecords(req, res) {
  const { records, meta } = await recordService.listRecords(req.query);

  res.json({
    success: true,
    data: records,
    meta,
  });
}

async function getRecordById(req, res) {
  const record = await recordService.getRecordById(req.params.recordId);

  res.json({
    success: true,
    data: record,
  });
}

async function updateRecord(req, res) {
  const record = await recordService.updateRecord(req.params.recordId, req.body, req.user.id);

  res.json({
    success: true,
    message: "Record updated successfully",
    data: record,
  });
}

async function deleteRecord(req, res) {
  await recordService.deleteRecord(req.params.recordId);

  res.json({
    success: true,
    message: "Record deleted successfully",
  });
}

module.exports = { createRecord, listRecords, getRecordById, updateRecord, deleteRecord };
