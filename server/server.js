const http = require('http');
const bodyParser = require('body-parser');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();
const router = express.Router();

router.get('/', function (req, res) {
  res.json({message: 'Hello there'}); 
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

