const dashboardService = require("../services/dashboardService");

async function getDashboardSummary(req, res) {
  const summary = await dashboardService.getDashboardSummary(req.query);

  res.json({
    success: true,
    data: summary,
  });
}

module.exports = { getDashboardSummary };
