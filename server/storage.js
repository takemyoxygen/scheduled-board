const fs = require('fs');
const path = require('path');
const Promise = require('promise');

const dataFilePath = path.join(__dirname, "scheduled-cards.json");

function readSchedules(){
    console.log(`Reading saved scheduled cards from ${dataFilePath}`);
    return Promise.denodeify(fs.readFile)(dataFilePath).then(JSON.parse);
}

module.exports = {
    allActiveScheduledCards: () => readSchedules()
        .then(cards => cards.filter(_ => _.status === "active"))
        .then(cards => {
            console.log(`Loaded ${cards.length} active scheduled cards.`);
            return cards;
        })
};