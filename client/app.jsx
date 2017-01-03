import React from 'react';
import User from './user';
import BoardsList from './boards-list';

const App = () => (
    <div>
        <div>
            <User />
        </div>
        <div>
            <BoardsList />
        </div>
    </div>);

export default App