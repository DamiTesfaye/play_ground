const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const socketio = require("socket.io");

const userRouter = require("../routes/user");
const indexRouter = require("../routes/index");
const chatroomRouter = require("../routes/chatroom");
const deleteRouter = require("../routes/delete");

require("../config/mongo");

const websockets = require("../utils/WebSockets");

const { decode } = require("../middlewares/jwt");

const app = express();

const port = process.env.PORT || 3000;

app.set("port", port);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/rooms", decode, chatroomRouter);
app.use("/delete", deleteRouter);

app.use("*", (req, res) => {
  return res.status(400).json({
    status: false,
    message: "API endpoint doesn't exist",
  });
});

const server = http.createServer(app);

server.on("listening", () => {
  console.log("Listening to port ", port);
});

server.listen(port);

global.io = socketio(server);
global.io.on("connection", websockets.connection);
