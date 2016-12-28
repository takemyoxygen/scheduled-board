const http = require('http');
const bodyParser = require('body-parser');
const session = require('express-session')
const Trello = require("node-trello");
const config = require("./config")
const express = require('express');
const path = require('path');

const port = 3000;

const app = express();
const publicRouter = express.Router();
const secureRouter = express.Router();

publicRouter.get('/authentication-status', (req, res) => {
  const response = req.session.token
    ? {authenticated: true}
    : {key: config.trelloKey, authenticated: false}
  res.json(response);
});

publicRouter.post('/token', (req, res) => {
  req.session.token = req.body.token;
  res.json({authenticated: true});
});

secureRouter.use((req, res, next) => {
  if (req.session.token) {
    next();
  } else {
    res.status(401).send("You are not authorized to access this resource.");
  }
});

secureRouter.get('/me', (req, res) => {
  const trello = new Trello(config.trelloKey, req.session.token);
  trello.get("/1/members/me", (err, data) => {
    if (err){
      res.status(500).send(err);
    } else {
      const me = {fullName: data.fullName, username: data.username};
      res.json(me);
    }
  })
})

secureRouter.get('/boards', (req, res) => {
  const trello = new Trello(config.trelloKey, req.session.token);
  trello.get("/1/members/me/boards", {filter: "open"}, function (err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      const boards = data.map(_ => ({ name: _.name, id: _.id }));
      res.json(boards);
    }
  });
});

secureRouter.get('/boards/:boardId/lists', (req, res) => {
  const trello = new Trello(config.trelloKey, req.session.token);
  trello.get(`/1/boards/${req.params.boardId}/lists`, {filter: "open"}, (err, data) => {
    if (err){
      res.status(500).send(err);
    } else {
      const lists = data.map(_ => ({id: _.id, name: _.name}));
      res.json(lists);
    }
  })
});

app.use(session(
  {
    cookie: { maxAge: 1000 * 60 * 60 },
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
  }));

app.use(bodyParser.json());
app.use("/api", publicRouter, secureRouter);
app.use(express.static(path.join(__dirname, "static")));

module.exports = {
  start: () => {
    app.listen(port, () => {
      console.log(`Server running at http://127.0.0.1:${port}/`);
    });
  }
};