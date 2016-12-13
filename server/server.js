const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const Trello = require("node-trello");

const hostname = '127.0.0.1';
const port = 3000;

const keys = JSON.parse(fs.readFileSync(__dirname + "/trello-keys.json", "utf8"));
const trello = new Trello(keys.key, keys.token);

const express = require('express');
const app = express();
const router = express.Router();

router.get('/', function (req, res) {
  res.json({message: 'Hello there'}); 
});

router.get('/boards', (req, res) => {
  trello.get("/1/members/me/boards", function(err, data) {
    if (err){
      res.status(500).send(err);
    }
    else{
      var boards = data
        .filter(board => !board.closed)
        .map(board => ({name: board.name, id: board.id}));

      res.json(boards);
    }
  });
});

router.put('/save', (req, res) => {
  res.json({processed: true, request: req.body});
});

app.use(bodyParser.json());
app.use("/api", router);

module.exports = {
  start: () => {
    app.listen(port, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  }
};

