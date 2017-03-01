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

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function shouldBeCreatedToday(schedule){
    const today = new Date();
    const dayOfWeek = daysOfWeek[today.getDay()];
    return schedule.schedule.days.indexOf(dayOfWeek) >= 0;
}

module.exports = {
    createCards: () => Storage
        .allActive()
        .then(schedules => schedules.filter(shouldBeCreatedToday))
        .then(schedules => sequentially(schedules, _ => Trello.createCard(_.token, _.listId, _.text)))
        .then(_ => ({ count: _.length }))
};