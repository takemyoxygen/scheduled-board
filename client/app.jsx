import React from 'react';
import User from './user';
import BoardsList from './boards-list';
import ScheduledCardsList from './scheduled-cards-list';
import ScheduledCardEditor from './scheduled-card-editor';

const App = () => (
    <div>
        <div>
            <User />
        </div>

        <div>
            <BoardsList />
        </div>

        <div>
            <ScheduledCardsList/>
        </div>

        <div>
            <ScheduledCardEditor/>
        </div>
    </div>);

export default App