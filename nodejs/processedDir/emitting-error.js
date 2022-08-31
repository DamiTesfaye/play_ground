const Events = require("events");

const emitter = new Events.EventEmitter();

emitter.on("error", function (error) {
  console.log(`Error: ${error.stack}`);
});

emitter.emit("error", new Error());
