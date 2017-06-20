import React from 'react';
import {loadAll} from './scheduled-cards';

export default class ScheduledCardsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {scheduledCards: []};
    }

    componentDidMount(){
        loadAll().then(_ => this.setState({
            scheduledCards: _
        }));
    }

    render() {
        const items = this.state.scheduledCards.map((_, index) =>
            <li key={index}>{this._convertToString(_)}</li>);

        return (
            <div>
                <h3>Scheduled cards</h3>
                <ul>{items}</ul>
            </div>);
    }

    _convertToString(scheduledCard) {
        switch (scheduledCard.schedule.pattern) {
            case 'weekly':
                const frequency = scheduledCard.schedule.frequency === 1
                    ? 'week'
                    : `${scheduledCard.schedule.frequency} weeks`;

                const days = scheduledCard.schedule.days.join(', ');
                return `Every ${frequency} on ${days} - ${scheduledCard.text}`;
                break;
            default:
                throw `Scheduled card pattetn '${scheduledCard.schedule.pattern}' is not supported`;
        }
    }
}