const mongoose = require("mongoose");
const uuid = require("uuid");

const USER_TYPES = {
  CONSUMER: "consumer",
  SUPPORT: "support",
};

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuid.v4().replace(/\-/g, ""),
    },
    firstName: String,
    lastName: String,
    type: String,
  },
  {
    timestamps: true,
    collection: "users",
  }
);

/**
 * @param {String} firstName
 * @param {String} lastName
 * @param {String} type
 * @return {Object} new user object created
 * */
userSchema.statics.createUser = async function (firstName, lastName, type) {
  try {
    const user = await this.create({ firstName, lastName, type });
    return user;
  } catch (e) {
    throw e;
  }
};

/**
 *  @param {String} id
 *  @return {Object} existing users
 * */
userSchema.statics.getUserById = async function (id) {
  try {
    const user = await this.findOne({ _id: id });

    if (!user) throw { error: "User not found" };

    return user;
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * @return {Array} list of all users
 * */
userSchema.statics.getAllUsers = async function () {
  try {
    const users = await this.find();

    if (!users) throw { error: "Users not found" };

    return users;
  } catch (e) {
    throw e;
  }
};

/**
 *  @param {String} id
 *  @return {Object} existing users
 * */
userSchema.statics.deleteUserById = async function (id) {
  try {
    const result = await this.remove({ _id: id });

    return result;
  } catch (e) {
    throw e;
  }
};

userSchema.statics.getUserbyIds = async function (ids) {
  try {
    const result = await this.find({ _id: { $in: ids } });

    return result;
  } catch (e) {
    throw e;
  }
};

module.exports = mongoose.model("User", userSchema);

module.exports.USER_TYPES = USER_TYPES;
