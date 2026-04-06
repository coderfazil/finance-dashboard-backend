const { User } = require("../models/User");
const { ApiError } = require("../utils/ApiError");

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function createUser(payload) {
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });

  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists");
  }

  const user = await User.create({
    ...payload,
    email: payload.email.toLowerCase(),
  });

  return serializeUser(user);
}

async function listUsers() {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map(serializeUser);
}

async function updateUser(userId, payload) {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (payload.name !== undefined) {
    user.name = payload.name;
  }

  if (payload.role !== undefined) {
    user.role = payload.role;
  }

  if (payload.status !== undefined) {
    user.status = payload.status;
  }

  if (payload.password !== undefined) {
    user.password = payload.password;
  }

  await user.save();

  return serializeUser(user);
}

module.exports = { createUser, listUsers, updateUser };
