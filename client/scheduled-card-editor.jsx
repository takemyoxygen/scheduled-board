import React from 'react';

export default class ScheduledCardEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pattern: 'weekly'};
    }

    render() {
        return (
            <div>
                <div>
                    <label>Pattern:</label>
                    <select onChange={this._onPatternChanged.bind(this)} value={this.state.pattern}>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>

                {this._renderDetails()}
            </div>
        )
    }

    _onPatternChanged(event) {
        this.setState({pattern: event.target.value});
    }

    _renderDetails() {
        switch (this.state.pattern) {
            case 'weekly':
                return <span>Weekly goes here!</span>;
            case 'monthly':
                return <span>Monthly goes here!</span>;
            default:
                throw `Patten '${this.state.pattern}' is not supported`;
        }
    }
}