const ChatMessageModel = require("../models/chatmessages");
const ChatRoomModel = require("../models/chatroom");

const deleteController = {
  deleteRoomById: async (req, res) => {
    try {
      const { id } = req.params;

      const room = await ChatRoomModel.deleteRoomById(id);

      const messages = await ChatMessageModel.deleteMessageByChatRoomId(id);

      return res.status(200).json({
        success: true,
        message: "Operation performed succesfully",
        deletedRoomsCount: room.deletedCount,
        deletedMessagesCount: messages.deletedCount,
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },
  deleteMessageById: async (req, res) => {
    try {
      const { id } = req.params;

      const messages = await ChatMessageModel.deleteMessageById(id);

      return res.status(200).json({
        success: true,
        deletedMessagesCount: messages.deletedCount,
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },
};

module.exports = deleteController;
