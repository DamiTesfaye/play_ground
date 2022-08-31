const fs = require("fs");
const Events = require("events");

class Watcher extends Events.EventEmitter {
  constructor(watchDir, processedDir) {
    super();

    this.watchDir = watchDir;
    this.processedDir = processedDir;
  }

  watch() {
    fs.readdir(this.watchDir, (err, files) => {
      if (err) throw err;

      for (let file in files) {
        this.emit("process", files[file]);
      }
    });
  }

  start() {
    fs.watchFile(this.watchDir, () => {
      this.watch();
    });
  }
}

module.exports = Watcher;
