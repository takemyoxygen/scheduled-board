import React from 'react';
import * as Auth from '../user/auth';
import * as Boards from './boards';

export default class BoardsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {boards: []};
    }

    componentDidMount() {
        Auth.currentUser.subscribe(_ =>
            Boards.load().then(boards => this.setState({boards})));
    }

    render(){
        const items = this.state.boards.map(_ => <li key={_.id}>{_.name}</li>);
        return <ul>{items}</ul>;
    }
}