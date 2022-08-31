const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const Articles = require("./db").Articles;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 8080);

app.get("/articles", (req, res, next) => {
  Articles.all((err, articles) => {
    if (err) next(err);

    res.send(articles);
  });
});

app.post("/articles", (req, res) => {
  const data = { title: req.body.title };

  articles.push(data);
  res.send(articles);
});

app.get("/articles/:id", (req, res) => {
  const id = req.params.id;

  if (articles[id]) res.send(articles[id]);
  else res.send("error");
});

app.delete("/articles/:id", (req, res) => {
  const id = req.params.id;

  if (articles[id]) {
    delete articles[id];
  }

  res.send(articles);
});

app.listen(app.get("port"), () => {
  console.log("listening on ", app.get("port"));
});

module.exports = app;
