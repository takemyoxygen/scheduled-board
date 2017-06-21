import React from 'react';
import WeeklyPatternEditor from './editors/weekly';
import MonthlyPatternEditor from './editors/monthly';

export default class ScheduledCardEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pattern: 'weekly', text: ''};
    }

    render() {
        return (
            <div>

                <div>
                    <label>Card text:</label>
                    <input type="text" value={this.state.text} onChange={this._onTextChange.bind(this)}/>
                </div>

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

    _onTextChange(event) {
        this.setState({text: event.target.value});
    }

    _renderDetails() {
        switch (this.state.pattern) {
            case 'weekly':
                return <WeeklyPatternEditor/>;
            case 'monthly':
                return <MonthlyPatternEditor/>;
            default:
                throw `Patten '${this.state.pattern}' is not supported`;
        }
    }
}