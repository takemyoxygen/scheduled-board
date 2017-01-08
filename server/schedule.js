const Promise = require('promise');
const Trello = require('./trello');
const Storage = require('./storage');

// sequentially :: [a] -> (a -> Promise b) -> Promise [b]
function sequentially(xs, f) {
    return xs.reduce(
        (acc, x) => acc.then(results => f(x).then(_ => {
            results.push(_);
            return results;
        })),
        Promise.resolve([]));
}

module.exports = {
    createCards: () => Storage
        .allActive()
        .then(schedules => sequentially(schedules, _ => Trello.createCard(_.token, _.listId, _.text)))
        .then(_ => ({ count: _.length }))
};