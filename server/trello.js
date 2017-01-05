const Trello = require("node-trello");
const config = require("./config")
const Promise = require('promise');

function request(token, method, uri, filter) {
    const t = new Trello(config.trelloKey, token);
    const trello = Promise.denodeify(method(t));
    return arguments.length == 4
        ? trello.call(t, uri, filter)
        : trello.call(t, uri);
}

module.exports = {

    myBoards: token =>
        request(token, _ => _.get, '/1/members/me/boards', { filter: 'open' })
            .then(boards => boards.map(_ => ({ name: _.name, id: _.id }))),

    lists: (token, board) =>
        request(token, _ => _.get, `/1/boards/${board}/lists`, { filter: 'open' })
            .then(lists => lists.map(_ => ({ id: _.id, name: _.name }))),

    me: token =>
        request(token, _ => _.get, '1/members/me')
            .then(_ => ({ fullName: _.fullName, username: _.username, id: _.id })),

    createCard: (token, list, text) =>
        request(token, _ => _.post, '1/cards', { idList: list, name: text })
}