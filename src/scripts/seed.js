const { connectDatabase } = require("../config/db");
const { User } = require("../models/User");
const { FinancialRecord } = require("../models/FinancialRecord");
const { ROLES } = require("../constants/roles");

async function seed() {
  await connectDatabase();

  await Promise.all([User.deleteMany({}), FinancialRecord.deleteMany({})]);

  const [admin, analyst, viewer] = await User.create([
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "Admin@12345",
      role: ROLES.ADMIN,
      status: "active",
    },
    {
      name: "Analyst User",
      email: "analyst@example.com",
      password: "Analyst@12345",
      role: ROLES.ANALYST,
      status: "active",
    },
    {
      name: "Viewer User",
      email: "viewer@example.com",
      password: "Viewer@12345",
      role: ROLES.VIEWER,
      status: "active",
    },
  ]);

  await FinancialRecord.create([
    {
      amount: 4500,
      type: "income",
      category: "Salary",
      date: new Date("2026-03-01"),
      notes: "Monthly salary payment",
      createdBy: admin._id,
      updatedBy: admin._id,
    },
    {
      amount: 300,
      type: "expense",
      category: "Groceries",
      date: new Date("2026-03-02"),
      notes: "Weekly groceries",
      createdBy: admin._id,
      updatedBy: admin._id,
    },
    {
      amount: 1200,
      type: "income",
      category: "Freelance",
      date: new Date("2026-03-10"),
      notes: "Consulting project payment",
      createdBy: analyst._id,
      updatedBy: analyst._id,
    },
    {
      amount: 800,
      type: "expense",
      category: "Rent",
      date: new Date("2026-03-05"),
      notes: "Apartment rent",
      createdBy: admin._id,
      updatedBy: admin._id,
    },
  ]);

  console.log("Seed completed");
  console.log("Admin:", admin.email, "Admin@12345");
  console.log("Analyst:", analyst.email, "Analyst@12345");
  console.log("Viewer:", viewer.email, "Viewer@12345");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
