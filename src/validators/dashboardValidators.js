const { z } = require("./common");

const dashboardSummarySchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    trendBy: z.enum(["week", "month"]).optional().default("month"),
    recentLimit: z.coerce.number().int().min(1).max(20).optional().default(5),
  }),
});

module.exports = { dashboardSummarySchema };
