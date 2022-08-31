const mongoose = require("mongoose");
const config = require("./index");

const CONNECTION_URL = `mongodb://${config.db.url}/${config.db.name}`;

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("mongo has connected successfully");
});

mongoose.connection.on("reconnected", () => {
  console.log("mongo has reconnected");
});

mongoose.connection.on("disconnected", () => {
  console.log("mongo has disconnected");
});

mongoose.connection.on("error", (error) => {
  console.log("mongo connection has encountered error ", error);

  mongoose.disconnect();
});
