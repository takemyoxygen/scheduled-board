const fs = require('fs');
const path = require('path');
const Promise = require('promise');

const dataFilePath = path.join(__dirname, "schedules.json");

function readSchedules(){
    console.log("Reading saved schedules.");
    return Promise.denodeify(fs.readFile)(dataFilePath).then(JSON.parse);
}

module.exports = {
    allActive: () => readSchedules()
        .then(schedules => schedules.filter(_ => _.status === "active"))
        .then(schedules => {
            console.log(`Loaded ${schedules.length} active schedules.`);
            return schedules;
        }),

    for: token => readSchedules().then(schedules => schedules.filter(_ => _.token === token))
};