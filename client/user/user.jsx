import React from 'react'
import * as Auth from './auth';

export default class User extends React.Component {

    constructor(props){
        super(props);
        this.state = {status: 'in-progress'};
    }

    componentDidMount(){
        Auth.login().then(user => this.setState({name: user.fullName, status: 'logged-in'}));
    }

    render(){
        switch (this.state.status){
            case "in-progress":
                return <span>Thinking...</span>;

            case "logged-in":
                return <span>Hello, {this.state.name}</span>;

            default:
                return null;
        }
    }
}