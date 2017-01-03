const request = require('request');
const Trello = require('node-trello');
const Promise = require('promise');

function loadSchedules() {
    return new Promise((resolve, reject) => {
        request("http://127.0.0.1:3000/api/schedules/all", (err, resp, data) => {
            if (err) reject(err);
            else resolve(JSON.parse(data));
        });
    });
}

function createTask(token, list, text){
    console.log(`Creating a card in list ${list} with text "${text}"`);
    const trello = new Trello("app-key", token)
    trello.post('/1/cards', {idList: list, name: text}, (err, data) => {
        if (err) console.dir(err);
        else console.log("Card has been created.");
    });
}

module.exports = {
    run: () => {
        loadSchedules()
            .then(schedules => {
                console.log(`Loaded ${schedules.length} schedules.`);
                schedules
                    .filter(_ => _.status === "active")
                    .forEach(_ => createTask(_.token, _.listId, _.text));
            });
    }
}