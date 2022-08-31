class Websocket {
  users = [];

  connection(client) {
    client.on("disconnect", () => {
      this.users = this.users.filter((user) => user.socketId !== client.id);
    });

    client.on("identity", (id) => {
      this.users.push({
        id,
        socketId: client.id,
      });
    });

    client.on("unsubscribe", (room) => {
      client.leave(room);
    });

    client.on("subscribe", (room, otherUserId = "") => {
      this.subscribeOtherUser(room, otherUserId);
      client.join(room);
    });
  }

  subscribeOtherUser(room, otherUserId) {
    const userSockets = this.users.filter(
      (user) => user.socketId === otherUserId
    );

    userSockets.map((socket) => {
      const socketConnection = global.io.sockets.connected(socket.socketId);

      if (socketConnection) {
        socketConnection.join(room);
      }
    });
  }
}

module.exports = new Websocket();
