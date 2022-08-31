const makeValidation = require("@withvoid/make-validation");
const { CHAT_ROOM_TYPES } = require("../models/chatroom");
const ChatRoomModel = require("../models/chatroom");
const ChatMessageModel = require("../models/chatmessages");
const UserModel = require("../models/user");

const room = {
  getRecentConversation: async (req, res) => {},
  getConversationByRoomId: async (req, res) => {
    try {
      const { id } = req.params;

      const room = await ChatRoomModel.getChatRoomById(id);

      if (!room) {
        return res.status(400).json({
          status: false,
          message: "Room does not exist",
        });
      }

      const users = await UserModel.getUserbyIds(room.userIds);
      const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
      };

      const conversation = await ChatMessageModel.getConversationByRoomId(
        id,
        options
      );

      return res.status(200).json({
        status: true,
        conversation,
        users,
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },
  initiate: async (req, res) => {
    try {
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          userIds: {
            type: types.array,
            options: { unique: true, empty: false, stringOnly: true },
          },
          initiatorId: {
            type: types.string,
          },
          type: {
            type: types.enum,
            options: { enum: CHAT_ROOM_TYPES },
          },
        },
      }));

      if (!validation.success) {
        return res
          .status(400)
          .json({ success: true, message: { ...validation } });
      }

      const { userIds, type } = req.body;

      const { id: initiatorId } = req;

      const allUserIds = [...userIds, initiatorId];
      const chatroom = await ChatRoomModel.initiateChat(
        allUserIds,
        type,
        initiatorId
      );

      return res.status(200).json({
        success: true,
        chatroom,
      });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },
  postMessage: async (req, res) => {
    try {
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          messageText: {
            type: types.string,
          },
          roomId: {
            type: types.string,
          },
        },
      }));

      if (!validation.success)
        return res
          .status(400)
          .json({ success: true, message: { ...validation } });

      const { roomId, messageText } = req.body;

      const currentlyLoggedInUserId = req.id;

      const post = await ChatMessageModel.createPostInChatroom(
        roomId,
        messageText,
        currentlyLoggedInUserId
      );

      global.io.sockets.in(roomId).emit('new message', { message: post });

      return res.status(200).json({ success: true, message: post });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },
  markConversationReadById: async (req, res) => {
    try {
      const { id } = req.params;

      const room = await ChatRoomModel.getChatRoomById(id);

      if (!room) {
        return res.status(400).json({
          status: false,
          message: "Room does not exist",
        });
      }

      const currentLoggedInUserID = req.id;

      const data = await ChatMessageModel.markMessageRead(
        id,
        currentLoggedInUserID
      );

      return res.status(200).json({ success: true, data });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  },
};

module.exports = room;
