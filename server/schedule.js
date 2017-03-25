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

function shouldBeCreatedToday(card){

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
        const startDate = convertDate(card.schedule.startDate);
        return !startDate || startDate <= date;
    }

    function endsNotEarlierThan(date){
        const endDate = convertDate(card.schedule.endDate);
        return !endDate || endDate >= date;
    }

    function activeOnDayOfWeek(date){
        const dayOfWeek = daysOfWeek[date.getDay()];
        return card.schedule.days.indexOf(dayOfWeek) >= 0;
    }

    function activeTheWeekOf(date){
        const startDate = convertDate(card.schedule.startDate);
        const mondayOfStartWeek = new Date(startDate);
        const startDateDayOfWeek = startDate.getDate();
        if (startDateDayOfWeek === 0) { // Sunday
            mondayOfStartWeek.setDate(startDate.getDate() - 6);
        } else {
            mondayOfStartWeek.setDate(startDate.getDate() - startDateDayOfWeek + 1);
        }
        const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
        const weeksBetween = Math.floor((date - startDate) / millisecondsPerWeek);
        return weeksBetween % card.schedule.frequency === 0;
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return card.schedule.pattern === 'weekly' &&
        startsNotLaterThan(today) &&
        endsNotEarlierThan(today) &&
        activeTheWeekOf(today) &&
        activeOnDayOfWeek(today);
}

module.exports = {
    createCards: () => Storage
        .allActiveScheduledCards()
        .then(cards => cards.filter(shouldBeCreatedToday))
        .then(cards => sequentially(cards, _ => Trello.createCard(_.token, _.listId, _.text)))
        .then(_ => ({ count: _.length }))
};