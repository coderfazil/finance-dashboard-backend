const { FinancialRecord } = require("../models/FinancialRecord");
const { buildRecordFilters } = require("./recordService");

function buildTrendGroup(trendBy) {
  if (trendBy === "week") {
    return {
      year: { $isoWeekYear: "$date" },
      week: { $isoWeek: "$date" },
    };
  }

  return {
    year: { $year: "$date" },
    month: { $month: "$date" },
  };
}

async function getDashboardSummary(query) {
  const { trendBy, recentLimit } = query;
  const filters = buildRecordFilters(query);

  const [totals, categoryTotals, recentActivity, trends] = await Promise.all([
    FinancialRecord.aggregate([
      { $match: filters },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]),
    FinancialRecord.aggregate([
      { $match: filters },
      {
        $group: {
          _id: {
            category: "$category",
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.category": 1, "_id.type": 1 } },
    ]),
    FinancialRecord.find(filters)
      .sort({ date: -1, createdAt: -1 })
      .limit(recentLimit)
      .populate("createdBy", "name email role"),
    FinancialRecord.aggregate([
      { $match: filters },
      {
        $group: {
          _id: buildTrendGroup(trendBy),
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1 } },
    ]),
  ]);

  const totalIncome = totals.find((item) => item._id === "income")?.total || 0;
  const totalExpenses = totals.find((item) => item._id === "expense")?.total || 0;

  return {
    totals: {
      income: totalIncome,
      expenses: totalExpenses,
      netBalance: totalIncome - totalExpenses,
    },
    categoryTotals: categoryTotals.map((item) => ({
      category: item._id.category,
      type: item._id.type,
      total: item.total,
    })),
    recentActivity,
    trends: trends.map((item) => ({
      period: item._id,
      income: item.income,
      expense: item.expense,
      net: item.income - item.expense,
    })),
  };
}

module.exports = { getDashboardSummary };
