const { z, objectIdSchema } = require("./common");

const recordBodySchema = z.object({
  amount: z.number().nonnegative(),
  type: z.enum(["income", "expense"]),
  category: z.string().trim().min(2).max(100),
  date: z.coerce.date(),
  notes: z.string().trim().max(500).optional().default(""),
});

const createRecordSchema = z.object({
  body: recordBodySchema,
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

const updateRecordSchema = z.object({
  body: z
    .object({
      amount: z.number().nonnegative().optional(),
      type: z.enum(["income", "expense"]).optional(),
      category: z.string().trim().min(2).max(100).optional(),
      date: z.coerce.date().optional(),
      notes: z.string().trim().max(500).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
  params: z.object({
    recordId: objectIdSchema,
  }),
  query: z.object({}).default({}),
});

const listRecordsSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().trim().min(1).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    search: z.string().trim().min(1).optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    sortBy: z.enum(["date", "amount", "category", "createdAt"]).optional().default("date"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

const recordIdParamSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    recordId: objectIdSchema,
  }),
  query: z.object({}).default({}),
});

module.exports = {
  createRecordSchema,
  updateRecordSchema,
  listRecordsSchema,
  recordIdParamSchema,
};
