import Auth from './auth';
import Boards from './boards';

export const ActionsTypes = {
    CHECK_STATUS: "CHECK_STATUS",
    USER_NOT_LOGGED_IN: "USER_NOT_LOGGED_IN",
    USER_LOGGED_IN: "USER_LOGGED_IN",
    AUTHENTICATION_IN_PROGRESS: "AUTHENTICATION_IN_PROGRESS",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",

    BOARDS_LOADED: "BOARDS_LOADED"
}

function userNotLoggedIn(appKey){
    return {type: ActionsTypes.USER_NOT_LOGGED_IN, applicationKey: appKey};
} 

function userLoggedIn(id, name){
    return {type: ActionsTypes.USER_LOGGED_IN, id: id, name: name};
}

function authenticationInProgress(){
    return {type: ActionsTypes.AUTHENTICATION_IN_PROGRESS};
}

function boardsLoaded(boards){
    return {type: ActionsTypes.BOARDS_LOADED, boards: boards};
}

function loadUserDetails(dispatch){
    return Auth
        .me()
        .then(_ => dispatch(userLoggedIn(_.id, _.fullName)))
        .then(Boards.load)
        .then(_ => dispatch(boardsLoaded(_)));
}

export const Actions = {

    checkStatus: () => dispatch => {
        dispatch(authenticationInProgress());

        return Auth.status().then(_ => {
            if (_.authenticated){
                return loadUserDetails(dispatch);
            } else {
                dispatch(userNotLoggedIn(_.key));
            }
        })
    },

    login: key => dispatch => {
        dispatch(authenticationInProgress());

        return Auth
            .authenticate(key)
            .then(_ => loadUserDetails(dispatch));
    },

    logout: () => dispatch => {
        dispatch(authenticationInProgress());

        return Auth
            .logout()
            .then(_ => dispatch(userNotLoggedIn(_.key)));
    }
};