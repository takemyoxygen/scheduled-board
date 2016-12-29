import React from 'react';
import Auth from './auth';

export default class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = { authenticated: false };
    }

    componentDidMount(){
        Auth.status().then(_ => {
            this.state.authenticated = _.authenticated;
            this.state.key = _.key;
        });
    }

    onLogin = () => {
        if (this.state.key){
            Auth.authenticate(this.state.key);
        }
    }

    render() {
        return this.state.authenticated
            ? (<div>Hello, {this.state.fullName}</div>)
            : (<div><a onClick={this.onLogin}>Login</a></div>);
    }
}