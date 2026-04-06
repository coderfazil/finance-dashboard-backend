const { z, objectIdSchema } = require("./common");

const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email(),
    password: z.string().min(8).max(128),
    role: z.enum(["viewer", "analyst", "admin"]),
    status: z.enum(["active", "inactive"]).optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

const updateUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      role: z.enum(["viewer", "analyst", "admin"]).optional(),
      status: z.enum(["active", "inactive"]).optional(),
      password: z.string().min(8).max(128).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
  params: z.object({
    userId: objectIdSchema,
  }),
  query: z.object({}).default({}),
});

module.exports = { createUserSchema, updateUserSchema };
