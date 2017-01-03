const fs = require('fs');
const path = require('path');
const Promise = require('promise');

const dataFilePath = path.join(__dirname, "schedules.json");

function readSchedules(){
    return new Promise((resolve, reject) => 
        fs.readFile(dataFilePath, (err, data) => {
            if (err) reject(err);
            else resolve(JSON.parse(data));
    }))
}

module.exports = {
    all: () => readSchedules(),

    for: token => readSchedules().then(schedules => schedules.filter(_ => _.token === token))
};