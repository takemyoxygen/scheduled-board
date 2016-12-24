const fs = require('fs');
const path = require('path');

const configFilePath = path.join(__dirname, "config.json");
console.log(`Loading config from "${configFilePath}."`);
const config = JSON.parse(fs.readFileSync(configFilePath, "utf8"));

module.exports = config;
