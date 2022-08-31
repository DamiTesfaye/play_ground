const mongoose = require("mongoose");
const uuid = require("uuid");

const MESSAGE_TYPES = {
  TYPE_TEXT: "text",
};

const readByRecipient = new mongoose.Schema(
  {
    _id: false,
    readByUserId: String,
    readAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: false,
  }
);

const chatMessage = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuid.v4().replace(/\-/g, ""),
    },
    chatRoomId: String,
    message: mongoose.Schema.Types.Mixed,
    type: {
      type: String,
      default: () => MESSAGE_TYPES.TYPE_TEXT,
    },
    postedByUser: String,
    readByRecipients: [readByRecipient],
  },
  {
    timestamps: true,
    collection: "chatmessages",
  }
);

/**
 * @param {String} chatRoomId
 * @param {String} message
 * @param {String} postedByUser
 * */
chatMessage.statics.createPostInChatroom = async function (
  chatRoomId,
  message,
  postedByUser
) {
  try {
    const post = await this.create({
      chatRoomId,
      message,
      postedByUser,
      readByRecipients: { readByUserId: postedByUser },
    });

    const aggregate = await this.aggregate([
      { $match: { _id: post._id } },
      {
        $lookup: {
          from: "users",
          localField: "postedByUser",
          foreignField: "_id",
          as: "postedByUser",
        },
      },
      { $unwind: "$postedByUser" },
      {
        $lookup: {
          from: "chatrooms",
          localField: "chatRoomId",
          foreignField: "_id",
          as: "chatRoomInfo",
        },
      },
      { $unwind: "$chatRoomInfo" },
      { $unwind: "$chatRoomInfo.userIds" },
      {
        $lookup: {
          from: "users",
          localField: "chatRoomInfo.userIds",
          foreignField: "_id",
          as: "chatRoomInfo.userProfile",
        },
      },
      { $unwind: "$chatRoomInfo.userProfile" },
      {
        $group: {
          _id: "$chatRoomInfo._id",
          postId: { $last: "$_id" },
          chatRoomId: { $last: "$chatRoomInfo._id" },
          message: { $last: "$message" },
          type: { $last: "$type" },
          postedByUser: { $last: "$postedByUser" },
          readByRecipients: { $last: "$readByRecipients" },
          chatRoomInfo: { $addToSet: "$chatRoomInfo.userProfile" },
          createdAt: { $last: "$createdAt" },
          updatedAt: { $last: "$updatedAt" },
        },
      },
    ]);

    return aggregate[0];
  } catch (e) {
    throw e;
  }
};

chatMessage.statics.getConversationByRoomId = async function (
  chatRoomId,
  options
) {
  try {
    return await this.aggregate([
      { $match: { chatRoomId } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "postedByUser",
          foreignField: "_id",
          as: "postedByUser",
        },
      },
      { $unwind: "$postedByUser" },
      { $skip: options.page * options.limit },
      { $limit: options.limit },
      { $sort: { createdAt: 1 } },
    ]);
  } catch (e) {
    throw e;
  }
};

chatMessage.statics.markMessageRead = async function (chatRoomId, userId) {
  try {
    return await this.updateMany(
      {
        chatRoomId,
        "readByRecipients.readByUserId": { $ne: userId },
      },
      {
        $addToSet: {
          readByRecipients: { readByUserId: userId },
        },
      },
      {
        multi: true,
      }
    );
  } catch (e) {
    throw e;
  }
};

chatMessage.statics.deleteMessageById = async function (id) {
  try {
    return await this.remove({ _id: id });
  } catch (e) {
    throw e;
  }
};

chatMessage.statics.deleteMessageByChatRoomId = async function (id) {
  try {
    return await this.remove({ chatRoomId: id });
  } catch (e) {
    throw e;
  }
};

module.exports = mongoose.model("ChatMessage", chatMessage);
module.exports.MESSAGE_TYPES = MESSAGE_TYPES;
