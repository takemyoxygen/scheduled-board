import React from 'react';

const daysOfWeek = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun'
]

export default class WeeklyPatternEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedDaysOfWeek: []};
    }

    render() {
        return (
            <div>
                {this._renderDaysOfWeek()}
            </div>);
    }

    _renderDaysOfWeek() {
        return (
            <div>
                {daysOfWeek.map(day => {
                    const id = `day-of-week-${day.toLowerCase()}`;
                    return (
                        <div key={id}>
                            <label htmlFor={id}>{day}</label>
                            <input
                                type="checkbox"
                                id={id}
                                value={this._isDayChecked()}
                                onChange={event => this._onDayCheckedChange(day, event)}/>
                        </div>);
                })}
            </div>);
    }

    _isDayChecked(dayOfWeek) {
        return this.state.selectedDaysOfWeek.indexOf(dayOfWeek) >= 0;
    }

    _onDayCheckedChange(dayOfWeek, event) {
        const newDaysOfWeek = this.state.selectedDaysOfWeek.slice(0);
        if (event.target.checked) {
            newDaysOfWeek.push(dayOfWeek);
        } else {
            const index = newDaysOfWeek.indexOf(dayOfWeek);
            if (index >= 0) {
                newDaysOfWeek.splice(index, 1);
            }
        }

        this.setState({selectedDaysOfWeek: newDaysOfWeek});

        console.log('Selected days: ', newDaysOfWeek.join(', '));
    }
}