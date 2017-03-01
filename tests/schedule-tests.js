const assert = require('assert');
const Storage = require('./../server/storage');
const Trello = require('./../server/trello');
const sinon = require('sinon');
const Promise = require('promise');
const Schedule = require('./../server/schedule');

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

function testSchedule(pattern){
    return {token: "test-token", listId: "test list ID", text: "some text on a card.", schedule: pattern};
}

function setup(sandbox, all, toCreate, today){
    if (today){
        sandbox.useFakeTimers(today.getTime())
    }

    sandbox.stub(Storage, "allActive").returns(Promise.resolve(all));

    if (toCreate.length > 0){
        toCreate.forEach(schedule => sandbox
            .mock(Trello)
            .expects("createCard")
            .withArgs(schedule.token, schedule.listId, schedule.text)
            .returns(Promise.resolve())
            .once());
    } else {
        sandbox.mock(Trello).expects("createCard").never();
    }
}

describe('Schedule', () =>{
    it("createCards should call Trello API", sandboxed(sandbox => {
        const schedule = testSchedule({days: Object.keys(daysOfWeek)});
        setup(sandbox, [schedule], [schedule]);
        return Schedule.createCards();
    }));

    it("createCards should create cards for schedules with matching day of the week", sandboxed(sandbox => {
        const schedule = testSchedule({days: ["Mon", "Tue", "Wed"]});
        setup(sandbox, [schedule], [], daysOfWeek["Fri"]);
        return Schedule.createCards();
    }));
});