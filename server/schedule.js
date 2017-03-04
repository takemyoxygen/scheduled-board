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

    function convertDate(dateRepresentation){
        if (dateRepresentation instanceof Date){
            return dateRepresentation;
        } else if (typeof dateRepresentation === "string"){
            return new Date(dateRepresentation);
        } else {
            return null;
        }
    }

    function startsNotLaterThan(date){
        const startDate = convertDate(schedule.schedule.startDate);
        return !startDate || startDate <= date;
    }

    function endsNotEarlierThan(date){
        const endDate = convertDate(schedule.schedule.endDate);
        return !endDate || endDate >= date;
    }

    function activeOnDayOfWeek(date){
        const dayOfWeek = daysOfWeek[date.getDay()];
        return schedule.schedule.days.indexOf(dayOfWeek) >= 0;
    }

    const today = new Date();
    return startsNotLaterThan(today) && activeOnDayOfWeek(today) && endsNotEarlierThan(today);
}

module.exports = {
    createCards: () => Storage
        .allActive()
        .then(schedules => schedules.filter(shouldBeCreatedToday))
        .then(schedules => sequentially(schedules, _ => Trello.createCard(_.token, _.listId, _.text)))
        .then(_ => ({ count: _.length }))
};