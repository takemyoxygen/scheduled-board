const http = require('http');
const bodyParser = require('body-parser');
const session = require('express-session')
const config = require("./config")
const express = require('express');
const path = require('path');
const Trello = require('./trello');
const Promise = require('promise');

Promise.prototype.complete = function(res){
  return this.then(_ => res.json(_), _ => res.status(500).send(_));
};

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
  console.log("Received a token: " + req.body.token);
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
  Trello.me(req.session.token).complete(res);
});

secureRouter.get('/boards', (req, res) => {
  Trello.myBoards(req.session.token).complete(res);
});

secureRouter.get('/boards/:boardId/lists', (req, res) => {
  Trello.lists(req.session.token, req.params.boardId).complete(res);
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
app.use("/build", express.static(path.join(__dirname, "../build")));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, "../client/index.html")))

module.exports = {
  start: () => {
    app.listen(port, () => {
      console.log(`Server running at http://127.0.0.1:${port}/`);
    });
  }
};