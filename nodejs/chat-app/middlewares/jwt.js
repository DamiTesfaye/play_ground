const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const SECRET_KEY = "1234567890";

const encode = async (req, res, next) => {
  try {
    const { id } = req.body;

    const user = await UserModel.getUserById(id);

    const payload = {
      id: user._id,
      type: user.type,
    };

    const authToken = jwt.sign(payload, SECRET_KEY);

    req.authToken = authToken;

    next();
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

const decode = async (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid authorization" });
  }

  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.id = decoded.id;
    req.type = decoded.type;

    next();
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = { encode, decode };
