import { ActionsTypes } from './actions';

export default function(state, action){
    console.dir(action);
    switch (action.type){

        case ActionsTypes.AUTHENTICATION_IN_PROGRESS:
            return { ...state, user: {...state.user, status: "in-progress"} };

        case ActionsTypes.USER_NOT_LOGGED_IN:
            return { ...state, user: {...state.user, status: "not-logged-in"}, applicationKey: action.applicationKey };

        case ActionsTypes.USER_LOGGED_IN:
            return { ...state, user: {...state.user, status: "logged-in", name: action.name}};

        default:
            return state;
    }
}