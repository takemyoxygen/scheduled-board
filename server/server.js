const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session')
const Trello = require("node-trello");

const port = 3000;

const keys = JSON.parse(fs.readFileSync(__dirname + "/trello-keys.json", "utf8"));
const trello = new Trello(keys.key, keys.token);

const express = require('express');
const app = express();
const router = express.Router();

router.get('/', function (req, res) {
  req.session.visited = (req.session.visited || 0) + 1;
  res.json({ message: 'Hello there', visited: req.session.visited });
});

router.get('/boards', (req, res) => {
  trello.get("/1/members/me/boards", function (err, data) {
    if (err) {
      res.status(500).send(err);
    }
    else {
      var boards = data
        .filter(board => !board.closed)
        .map(board => ({ name: board.name, id: board.id }));

      res.json(boards);
    }
  });
});

router.put('/save', (req, res) => {
  res.json({ processed: true, request: req.body });
});

app.use(session(
  {
    cookie: { maxAge: 1000 * 60 * 60 },
    secret: "this is the secret",
    resave: false,
    saveUninitialized: false
  }));

app.use(bodyParser.json());
app.use("/api", router);

module.exports = {
  start: () => {
    app.listen(port, () => {
      console.log(`Server running at http://127.0.0.1:${port}/`);
    });
  }
};

