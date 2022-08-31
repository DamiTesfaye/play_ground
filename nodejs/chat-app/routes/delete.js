const express = require("express");
const deleteController = require("../controllers/delete");
const router = express.Router();

router
  .delete("/room/:id", deleteController.deleteRoomById)
  .delete("/message/:id", deleteController.deleteMessageById);

module.exports = router;
