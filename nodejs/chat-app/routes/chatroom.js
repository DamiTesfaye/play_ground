const express = require("express");
const chatRoom = require("../controllers/room");
const router = express.Router();

router
  .get("/", chatRoom.getRecentConversation)
  .get("/message/:id", chatRoom.getConversationByRoomId)
  .post("/initiate", chatRoom.initiate)
  .post("/message", chatRoom.postMessage)
  .put("/:id/mark-read", chatRoom.markConversationReadById);

module.exports = router;
