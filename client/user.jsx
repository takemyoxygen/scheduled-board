import React, { PropTypes } from 'react'
import { connect } from 'react-redux';
import Auth from './auth';
import { Actions } from './actions';

class User extends React.Component {

    componentDidMount(){
        this.props.requestUserStatus();
    }
    
    render(){
        switch (this.props.status){
            case "in-progress":
                return <span>Thinking...</span>;

            case "logged-in":
                return <span>Hello, {this.props.name} <a href="#" onClick={this.props.logout}>Logout</a></span>;

            case "not-logged-in":
                return (
                    <span>
                        We don't know you.
                        <a href="#" onClick={() => this.props.login(this.props.appKey)}>Introduce yourself.</a>
                    </span>
                );

            default:
                return null;
        }
    }
}

User.propTypes = {
    requestUserStatus: PropTypes.func.isRequired,
    status: PropTypes.string,
    name: PropTypes.string,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
};

export default connect(
    state => ({status: state.user.status, name: state.user.name, appKey: state.applicationKey}),
    dispatch => ({
        requestUserStatus: () => dispatch(Actions.checkStatus()),
        login: key => dispatch(Actions.login(key)), 
        logout: () => dispatch(Actions.logout())})
) (User)