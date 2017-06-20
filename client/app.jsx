import React from 'react';
import User from './user/user';
import BoardsList from './boards/boards-list';
import ScheduledCardsList from './scheduled-cards/scheduled-cards-list';
import ScheduledCardEditor from './scheduled-cards/scheduled-card-editor';

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