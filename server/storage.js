const fs = require('fs');
const path = require('path');
const Promise = require('promise');
const config = require('./config');
const MongoClient = require('mongodb').MongoClient;

function connect(){
    return Promise.denodeify(MongoClient.connect)(config.mongoUrl);
}

function query(criteria){
    return db => {
        const cursor = db.collection("scheduled_cards").find(criteria);
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
}

function log(cards){
    console.log(`Loaded ${cards.length} active scheduled cards.`);
    return cards;
}

module.exports = {
    allActiveScheduledCards: () => connect().then(query({status: 'active'})).then(log),

    myScheduledCards: token => connect().then(query({token})).then(log)
};