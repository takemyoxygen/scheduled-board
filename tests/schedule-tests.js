const assert = require('assert');
const Storage = require('./../server/storage');
const Trello = require('./../server/trello');
const sinon = require('sinon');
const Promise = require('promise');
const Schedule = require('./../server/schedule');
const extend = require('util')._extend;


const today = new Date();
today.setUTCHours(0, 0, 0, 0);

// sinon.test doesn't wait if result of the test is Promise and restores sandbox immediately.
// Therefore a custom function that supports "then-able" return values;
function sandboxed(test){
    return () => {
        const sandbox = sinon.sandbox.create();
        const result = test(sandbox);
        if (typeof result.then === 'function'){
            return result.then(
                () => sandbox.verifyAndRestore(),
                error => {
                    sandbox.verifyAndRestore();
                    throw error;
                });
        } else {
            sandbox.verifyAndRestore();
            return result;
        }
    }
}

const daysOfWeek = {
    "Mon": new Date("2017-03-06"),
    "Tue": new Date("2017-03-07"),
    "Wed": new Date("2017-03-08"),
    "Thu": new Date("2017-03-09"),
    "Fri": new Date("2017-03-10"),
    "Sat": new Date("2017-03-11"),
    "Sun": new Date("2017-03-12"),
};

function testCard(pattern){
    const defaults = {days: Object.keys(daysOfWeek), frequency: 1, startDate: today, pattern: 'weekly'};
    return {
        token: "test-token",
        listId: "test list ID",
        text: "some text on a card.",
        schedule: extend(defaults, pattern)
    };
}

function setup(sandbox, card, shouldBeCreated, currentDate){
    if (currentDate){
        sandbox.useFakeTimers(currentDate.getTime())
    }

    sandbox.stub(Storage, "allActiveScheduledCards").returns(Promise.resolve([card]));

    if (shouldBeCreated){
        sandbox
            .mock(Trello)
            .expects("createCard")
            .withArgs(card.token, card.listId, card.text)
            .returns(Promise.resolve())
            .once();
    } else {
        sandbox.mock(Trello).expects("createCard").never();
    }
}

describe('Schedule', () =>{
    it("createCards should call Trello API", sandboxed(sandbox => {
        setup(sandbox, testCard(), true);
        return Schedule.createCards();
    }));

    it("createCards should create cards for schedules with matching day of the week", sandboxed(sandbox => {
        const card = testCard({days: ["Mon", "Tue", "Wed"]});
        setup(sandbox, card, false, daysOfWeek["Fri"]);
        return Schedule.createCards();
    }));

    it("createCards should create cards only after scheduled start date", sandboxed(sandbox => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const card = testCard({startDate: tomorrow});
        setup(sandbox, card, false);
        return Schedule.createCards();
    }));

    it("createCards should create cards only before scheduled end date", sandboxed(sandbox => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const card = testCard({endDate: yesterday});
        setup(sandbox, card, false);
        return Schedule.createCards();
    }));

    it("createCards should not create cards if week does not match configured frequency", sandboxed(sandbox => {
        const weekAgo = new Date(today.valueOf());
        weekAgo.setDate(weekAgo.getDate() - 7);

        setup(sandbox, testCard({startDate: weekAgo, frequency: 2}), false);
        return Schedule.createCards();
    }));

    it("createCards should create for the first week regardless of frequency", sandboxed(sandbox => {
        setup(sandbox, testCard({frequency: 5}), true);
        return Schedule.createCards();
    }));

    it("createCards should create cards if week matches configured frequency", sandboxed(sandbox => {
        const twoWeeksAgo = new Date(today.valueOf());
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        setup(sandbox, testCard({startDate: twoWeeksAgo, frequency: 2}), true);
        return Schedule.createCards();
    }));
});