import React, { Component } from 'react';
import {Dropdown} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import ChatList from './ChatList';
import Aux from "../../../../../hoc/_Aux";
import DEMO from "../../../../helpers/demo";
import { logout } from '../../../../actions/user';

import Avatar1 from '../../../../../assets/images/user/avatar-1.jpg';

class NavRight extends Component {
    state = {
        listOpen: false
    };

    handleLogout = e => {
      this.props.logoutAction();
      this.props.history.push('/auth/signin');
    }

    render() {

        return (
            <Aux>
                <ul className="navbar-nav ml-auto">
                    <li className={this.props.rtlLayout ? 'm-r-15' : 'm-l-15'}>
                        <a href={DEMO.BLANK_LINK} className="displayChatbox" onClick={() => {this.setState({listOpen: true});}}><i className="icon feather icon-mail"/></a>
                    </li>
                    <li>
                        <Dropdown alignRight={!this.props.rtlLayout} className="drp-user">
                            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                                <i className="icon feather icon-settings"/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu alignRight className="profile-notification">
                                <div className="pro-head">
                                    <img src={Avatar1} className="img-radius" alt="User Profile"/>
                                    <span>John Doe</span>
                                    <a href={DEMO.BLANK_LINK} className="dud-logout" title="Logout">
                                        <i className="feather icon-log-out"/>
                                    </a>
                                </div>
                                <ul className="pro-body">
                                    <li><a href={DEMO.BLANK_LINK} className="dropdown-item"><i className="feather icon-user"/> Profile</a></li>
                                    <li><a href={DEMO.BLANK_LINK} className="dropdown-item" onClick={e => this.handleLogout(e)}><i className="feather icon-lock"/> Log Out</a></li>
                                </ul>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                </ul>
                <ChatList listOpen={this.state.listOpen} closed={() => {this.setState({listOpen: false});}} />
            </Aux>
        );
    }
}

const mapDispatchToProps = dispatch => {
  return {
    logoutAction: () => dispatch(logout())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withRouter(NavRight));
