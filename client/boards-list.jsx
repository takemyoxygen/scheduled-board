import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const BoardsList = ({boards}) => {
    const items = boards ? boards.map(_ => <li key={_.id}>{_.name}</li>) : null;
    return <ul>{items}</ul>;
}

BoardsList.propTypes = {
    boards: PropTypes.array
};

export default connect(_ => _)(BoardsList)