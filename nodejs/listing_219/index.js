const fs = require("fs");
const exec = require("child_process").exec;

let completedTasks = 0;
let tasks = [];
let downloadTasks = [];

const areTasksCompleted = () => {
  completedTasks++;
  console.log("All done completedTasks ", completedTasks);

  if (completedTasks === downloadTasks.length) {
    next();
  }
};

const createDownloadArchive = () => {
  console.log("creating download archive...");

  exec(
    `tar cvf node_distros.tar /private/tmp/4.4.7.tgz /private/tmp/6.3.0.tgz`,
    (err) => {
      if (err) throw err;

      console.log("All done!");
    }
  );
};

const downloadNodeVersion = (version, destination, callback) => {
  const url = `$https://nodejs.org/dist/v${version}/node-v${version}.tar.gz`;

  const filePath = `${destination}/${version}.tgz`;

  exec(`curl ${url} > ${filePath}`, callback);
};

const downloadNode4 = (callback) => {
  downloadNodeVersion("4.4.7", "/tmp", () => {
    console.log("downloaded node 4");
    callback();
  });
};

const downloadNode6 = (callback) => {
  downloadNodeVersion("6.3.0", "/tmp", () => {
    console.log("downloaded node 6");
    callback();
  });
};

downloadTasks = [downloadNode4, downloadNode6];

const downloadNodeVersions = () => {
  downloadTasks.forEach((downloadTask) => {
    downloadTask(() => {
      areTasksCompleted();
    });
  });
};

tasks = [downloadNodeVersions, createDownloadArchive];

const next = () => {
  const currentTask = tasks.shift();

  if (currentTask) {
    currentTask();
  }
};

next();
