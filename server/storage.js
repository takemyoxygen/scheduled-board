const fs = require('fs');
const path = require('path');
const Promise = require('promise');
const config = require('./config');
const MongoClient = require('mongodb').MongoClient;

function connect(){
    return Promise.denodeify(MongoClient.connect)(config.mongoUrl);
}

function query(db){
    const cursor = db.collection("scheduled_cards").find({status: 'active'});
    return Promise
        .denodeify(cursor.toArray)
        .call(cursor)
        .then(
            cards => {
                db.close();
                return cards;
            },
            err => {
                db.close();
                throw err;
            });
}

function log(cards){
    console.log(`Loaded ${cards.length} active scheduled cards.`);
    return cards;
}

module.exports = {
    allActiveScheduledCards: () => connect().then(query).then(log)
};