const Trello = require("node-trello");
const config = require("./config")
const Promise = require('promise');

function request(token, method, uri, filter){
    return new Promise((resolve, reject) => {
        const t = new Trello(config.trelloKey, token);
        
        const callback = (err, data) => {
            if (err) reject(err);
            else resolve(data);
        };

        if (arguments.length == 4) {
            method(t).call(t, uri, filter, callback);
        } else {
            method(t).call(t, uri, callback);
        }
    });
}

module.exports = {

    myBoards: token => 
        request(token, t => t.get, '/1/members/me/boards', {filter: 'open'})
            .then(boards => boards.map(_ => ({ name: _.name, id: _.id }))),
    
    lists: (token, board) =>
        request(token, t => t.get, `/1/boards/${board}/lists`, {filter: 'open'})
            .then(lists => lists.map(_ => ({id: _.id, name: _.name}))),

    me: token =>
        request(token, t => t.get, '1/members/me')
            .then(_ => ({fullName: _.fullName, username: _.username, id: _.id}))
}