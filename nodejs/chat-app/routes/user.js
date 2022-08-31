const express = require("express");
const users = require("../controllers/user");
const router = express.Router();

router
  .get("/", users.onGetAllUsers)
  .post("/", users.onCreateUser)
  .get("/:id", users.onGetUserById)
  .delete("/:id", users.onDeleteUserById);

module.exports = router;
