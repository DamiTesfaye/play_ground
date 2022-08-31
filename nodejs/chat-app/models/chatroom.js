const mongoose = require("mongoose");
const uuid = require("uuid");

const CHAT_ROOM_TYPES = {
  USER_TO_USER: "USER_TO_USER",
  USER_TO_SUPPORT: "USER_TO_SUPPORT",
};

const chatroom = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuid.v4().replace(/\-/g, ""),
    },
    userIds: Array,
    initiatorId: String,
    type: String,
  },
  {
    timestamps: true,
    collection: "chatrooms",
  }
);

chatroom.statics.initiateChat = async function (userIds, type, initiatorId) {
  try {
    const availableRoom = await this.findOne({
      userIds: {
        $size: userIds.length,
        $all: [...userIds],
      },
    });

    if (availableRoom) {
      return {
        isNew: false,
        message: "retrieving an existing chat room",
        chatRoomId: availableRoom._doc._id,
        type: availableRoom._doc.type,
      };
    }

    const newRoom = await this.create({ userIds, type, initiatorId });

    return {
      isNew: true,
      message: "creating a new chat room",
      chatRoomId: newRoom._doc._id,
      type: newRoom._doc.type,
      _doc: newRoom._doc,
    };
  } catch (e) {
    console.log("error on start chat method ", e);
    throw e;
  }
};

chatroom.statics.getChatRoomById = async function (roomId) {
  try {
    const room = await this.findOne({ _id: roomId });

    return room;
  } catch (e) {
    throw e;
  }
};

chatroom.statics.deleteRoomById = async function (id) {
  try {
    return await this.remove({ _id: id });
  } catch (e) {
    throw e;
  }
};

module.exports = mongoose.model("ChatRoom", chatroom);

module.exports.CHAT_ROOM_TYPES = CHAT_ROOM_TYPES;
