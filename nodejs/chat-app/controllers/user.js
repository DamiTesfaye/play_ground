const makeValidation = require("@withvoid/make-validation");
const { USER_TYPES } = require("../models/user");
const UserModel = require("../models/user");

const user = {
  onGetAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getAllUsers();

      return res.status(200).json({ success: true, users });
    } catch (e) {
      return res.status(500).json({ success: false, error: e });
    }
  },
  onCreateUser: async (req, res) => {
    try {
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          firstName: { type: types.string },
          lastName: { type: types.string },
          type: { type: types.enum, options: { enum: USER_TYPES } },
        },
      }));

      if (!validation.success) return res.status(400).json(validation);

      const { firstName, lastName, type } = req.body;

      const user = await UserModel.createUser(firstName, lastName, type);

      return res.status(200).json({ success: true, user });
    } catch (e) {
      return res.status(500).json({ success: false, error: e });
    }
  },
  onGetUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserModel.getUserById(id);

      return res.status(200).json({ success: true, user });
    } catch (e) {
      return res.status(500).json({ success: false, error: e });
    }
  },
  onDeleteUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await UserModel.deleteUserById(id);

      return res
        .status(200)
        .json({
          success: true,
          message: `Deleted a count of ${result.deletedCount} user.`,
        });
    } catch (e) {
      return res.status(500).json({ success: false, error: e });
    }
  },
};

module.exports = user;
