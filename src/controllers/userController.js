const userService = require("../services/userService");

async function createUser(req, res) {
  const user = await userService.createUser(req.body);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
}

async function listUsers(req, res) {
  const users = await userService.listUsers();

  res.json({
    success: true,
    data: users,
  });
}

async function updateUser(req, res) {
  const user = await userService.updateUser(req.params.userId, req.body);

  res.json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
}

module.exports = { createUser, listUsers, updateUser };
