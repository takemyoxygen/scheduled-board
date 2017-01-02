import Auth from './auth';

export const ActionsTypes = {
    CHECK_STATUS: "CHECK_STATUS",
    USER_NOT_LOGGED_IN: "USER_NOT_LOGGED_IN",
    USER_LOGGED_IN: "USER_LOGGED_IN",
    AUTHENTICATION_IN_PROGRESS: "AUTHENTICATION_IN_PROGRESS",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
}

function userNotLoggedIn(appKey){
    return {type: ActionsTypes.USER_NOT_LOGGED_IN, applicationKey: appKey};
} 

function userLoggedIn(name){
    return {type: ActionsTypes.USER_LOGGED_IN, name: name};
}

function authenticationInProgress(){
    return {type: ActionsTypes.AUTHENTICATION_IN_PROGRESS};
}

export const Actions = {

    checkStatus: () => dispatch => {
        dispatch(authenticationInProgress());

        return Auth.status().then(_ => {
            if (_.authenticated){
                Auth.me().then(user => dispatch(userLoggedIn(user.fullName)));
            } else {
                dispatch(userNotLoggedIn(_.key));
            }
        })
    },

    login: key => dispatch => {
        dispatch(authenticationInProgress());

        return Auth
            .authenticate(key)
            .then(Auth.me)
            .then(_ => dispatch(userLoggedIn(_.fullName)));
    },

    logout: () => dispatch => {
        dispatch(authenticationInProgress());

        return Auth
            .logout()
            .then(_ => dispatch(userNotLoggedIn(_.key)));
    }
};