const http = require('http');
const bodyParser = require('body-parser');
const session = require('express-session')
const Trello = require("node-trello");
const config = require("./config")
const express = require('express');
const path = require('path');

const port = 3000;

const app = express();
const router = express.Router();

router.get('/authentication-status', (req, res) => {
  const response = req.session.token
    ? {authenticated: true}
    : {key: config.trelloKey, authenticated: false}
  res.json(response);
});

router.post('/token', (req, res) => {
  req.session.token = req.body.token;
  res.json({authenticated: true});
})

router.get('/boards', (req, res) => {
  const trello = new Trello(config.trelloKey, req.session.token);
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

app.use(session(
  {
    cookie: { maxAge: 1000 * 60 * 60 },
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
  }));

app.use(bodyParser.json());
app.use("/api", router);
app.use(express.static(path.join(__dirname, "static")));

module.exports = {
  start: () => {
    app.listen(port, () => {
      console.log(`Server running at http://127.0.0.1:${port}/`);
    });
  }
};

