import React, { Component } from 'react';
import {Dropdown} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';

import ChatList from './ChatList';
import Aux from "../../../../../hoc/_Aux";
import DEMO from "../../../../helpers/demo";
import { logout, authorizeUser } from '../../../../actions/user';

import Avatar1 from '../../../../../assets/images/user/avatar-1.jpg';

class NavRight extends Component {
    state = {
        listOpen: false
    };

    componentWillMount() {
      this.props.authorizeUserAction();
    }

    shouldComponentUpdate(nextProps, nextState) {

      const { user } = nextProps.userState;

      if (user) {
        $('#fullName').text(user.firstName + ' ' + user.lastName);
        $('img').attr('src', user.imageURL);
      }
    }

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
                                  <span id='fullName'/>
                              </div>
                              <ul className="pro-body">
                                  <li><a href={DEMO.BLANK_LINK} className="dropdown-item"><i className="feather icon-user"/> Profile</a></li>
                                  <li><a href={DEMO.BLANK_LINK} className="dropdown-item" onClick={e => this.handleLogout(e)}><i className="feather icon-log-out"/> Log Out</a></li>
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

const mapStateToProps = state => {
  return {
    userState: state.userState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logoutAction: () => dispatch(logout()),
    authorizeUserAction: () => dispatch(authorizeUser())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NavRight));
