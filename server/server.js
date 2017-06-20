const http = require('http');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const config = require("./config");
const express = require('express');
const path = require('path');
const Trello = require('./trello');
const Promise = require('promise');
const Storage = require('./storage');
const Schedule = require('./schedule');

Promise.prototype.complete = function (res) {
    return this.then(_ => res.json(_), _ => res.status(500).send(_));
};

const port = 3000;

const app = express();
const publicRouter = express.Router();


publicRouter.get('/authentication-status', (req, res) => {
    const response = req.session.token
        ? { authenticated: true }
        : { key: config.trelloKey, authenticated: false };
    res.json(response);
});

publicRouter.post('/token', (req, res) => {
    req.session.token = req.body.token;
    res.json({ authenticated: true });
});

const secureRouter = express.Router();

secureRouter.use((req, res, next) => {
    if (req.session.token) {
        next();
    } else {
        res.status(401).send("You are not authorized to access this resource.");
    }
});

secureRouter.delete('/token', (req, res) => {
    req.session.destroy();
    res.json({authenticated: false, key: config.trelloKey});
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

secureRouter.get('/scheduled-cards/mine', (req, res) => {
    Storage.myScheduledCards(req.session.token).complete(res);
});

const privateRouter = express.Router();
privateRouter.post('/scheduled-cards/create', (req, res) => {
    if (req.header("secret-code") === config.secretAuthCode){
        Schedule.createCards().complete(res);
    } else {
        res.status(401).send("You are not authorized to access this resource.");
    }
});

// TODO move to mongo
app.use(session(
    {
        cookie: { maxAge: 1000 * 60 * 60 },
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        store: new FileStore()
    }));

app.use(bodyParser.json());
app.use("/api", publicRouter, privateRouter, secureRouter);
app.use("/build", express.static(path.join(__dirname, "../build")));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, "../client/index.html")));

module.exports = {
    start: () => {
        app.listen(port, () => {
            console.log(`Server running at http://127.0.0.1:${port}/`);
        });
    }
};