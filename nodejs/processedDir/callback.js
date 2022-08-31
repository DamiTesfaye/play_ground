const fs = require("fs");
const http = require("http");

const port = 5000;

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    getTitle(res);
  }
});

const getTitle = (res) => {
  fs.readFile("./titles.json", (err, data) => {
    if (err) return handleError(err, res);

    const titles = JSON.parse(data.toString());

    formatHtml(titles, res);
  });
};

const formatHtml = (parsedData, res) => {
  fs.readFile("./template.html", (err, data) => {
    if (err) return handleError(err, res);

    const tmpl = data.toString();

    const html = tmpl.replace("%", parsedData.join("</li><li>"));
    res.writeHead(200, { "content-Type": "text/html" });
    res.end(html);
  });
};

const handleError = (err, res) => {
  console.log(err);
  res.end(err);
};

server.listen(port, "127.0.0.1", () => {
  console.log("listening on 5000");
});
