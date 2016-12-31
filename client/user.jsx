import React from 'react';
import Auth from './auth';

const Hello = (props) =>
    <span>Hello, {props.name} <a href="#" onClick={props.logout}>Logout</a></span>;

const Introduce = (props) =>
    <span>We don't know you. <a href="#" onClick={props.login}>Introduce yourself.</a></span>;

export default class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = { status: "unknown" };
    }

    loadUserDetails(){
        return Auth.me().then(_ => this.setState({fullName: _.fullName, status: "logged-in"}));
    }

    componentDidMount(){
        Auth.status().then(_ => {
            if (_.authenticated){
                return this.loadUserDetails();
            } else {
                this.setState({key: _.key, status: "not-logged-in"})
            }
        });
    }

    onLogin = () => {
        if (this.state.key){
            Auth.authenticate(this.state.key)
                .then(_ => this.loadUserDetails());
        }
    }

    onLogout = () => {
        this.setState({status: "unknown"});
        Auth.logout().then(_ => this.setState({status: "not-logged-in", key: _.key}));
    }

    render() {
        switch (this.state.status){
            case "unknown":
                return <span>Thinking...</span>;

            case "logged-in":
                return <Hello name={this.state.fullName} logout={this.onLogout} />

            case "not-logged-in":
                return <Introduce login={this.onLogin}/>;
        }
    }
}