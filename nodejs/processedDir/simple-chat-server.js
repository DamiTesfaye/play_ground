const net = require("net");
const EventEmitter = require("events").EventEmitter;

const channel = new EventEmitter();

channel.clients = {};
channel.subscriptions = {};

channel.on("join", function (id, client) {
  const welcome = `welcome guests online: ${
    this.listeners("broadcast").length
  }`;
  client.write(`${welcome}\n`);

  this.clients[id] = client;
  this.subscriptions[id] = (senderId, message) => {
    if (id !== senderId) {
      this.clients[id].write(message);
    }
  };

  this.on("broadcast", this.subscriptions[id]);
});

channel.on("leave", function (id) {
  this.removeListener("broadcast", this.subscriptions[id]);

  this.emit("broadcast", id, `user with ${id} has left the chatroom \n`);
});

channel.on("shutdown", function () {
  this.emit("broadcast", "", "The server has shutdown \n");

  this.removeAllListeners("broadcast");
});

channel.setMaxListeners(50); //increase listener for event emitter to prevent memory leak

const server = net.createServer((client) => {
  const id = `${client.remoteAddress}:${client.remotePort}`;

  channel.emit("join", id, client);

  client.on("data", (data) => {
    data = data.toString();

    if (data === "shutdown\r\n") {
      channel.emit("shutdown");
    }
    channel.emit("broadcast", id, data);
  });

  channel.on("close", () => {
    channel.emit("leave", id);
  });
});

server.listen(8080, () => {
  console.log("listening at port 8080");
});
