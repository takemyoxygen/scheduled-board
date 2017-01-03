import { ActionsTypes } from './actions';

function handle(state, action) {
    switch (action.type){

        case ActionsTypes.AUTHENTICATION_IN_PROGRESS:
            return { ...state, user: {...state.user, status: "in-progress"} };

        case ActionsTypes.USER_NOT_LOGGED_IN:
            return { ...state, user: {...state.user, status: "not-logged-in"}, applicationKey: action.applicationKey, boards: [] };

        case ActionsTypes.USER_LOGGED_IN:
            return { ...state, user: {...state.user, status: "logged-in", id: action.id, name: action.name}};

        case ActionsTypes.BOARDS_LOADED:
            return { ...state, boards: action.boards };

        default:
            return state;
    }
}

export default function(state, action){
    console.log("Event:");
    console.dir(action);

    const nextState = handle(state, action);
    console.log("State:");
    console.dir(nextState);

    return nextState;
}