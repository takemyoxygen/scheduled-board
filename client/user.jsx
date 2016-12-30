import React from 'react';
import Auth from './auth';

export default class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = { authenticated: false };
    }

    loadUserDetails(){
        return Auth.me().then(_ => this.setState({fullName: _.fullName, authenticated: true}));
    }

    componentDidMount(){
        Auth.status().then(_ => {
            if (_.authenticated){
                return this.loadUserDetails();
            } else {
                this.setState({key: _.key})
            }
        });
    }

    onLogin = () => {
        if (this.state.key){
            Auth.authenticate(this.state.key)
                .then(_ => this.loadUserDetails());
        }
    }

    render() {
        return this.state.authenticated
            ? (<div>Hello, {this.state.fullName}</div>)
            : (<div><a onClick={this.onLogin}>Login</a></div>);
    }
}