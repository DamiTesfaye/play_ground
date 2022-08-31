const express = require("express");

const { encode } = require("../middlewares/jwt");

const router = express.Router();

router
  .get("/", (req, res) => {
    return res.status(200).json({ message: "we good" });
  })
  .post("/login", encode, (req, res) => {
    try {
      return res
        .status(200)
        .json({ success: true, authorization: req.authToken });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  });

module.exports = router;
