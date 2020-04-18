import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';

import './../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "./../../layout/AdminLayout/Breadcrumb";
import { login, logout } from './../../actions/user';

class SignIn extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const { userState } = this.props;

    try {
      if (userState.user !== null
        && userState.user.user.role === 'admin') {
          const { history } = this.props;
          history.push('/dashboard/default');
      }
    } catch(e) {
      this.props.logoutAction();
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      const { history } = this.props;
      history.push('/dashboard/default');
    }
  }

  componentWillUpdate() {
    const token = localStorage.getItem('authToken');
    if (token) {
      const { history } = this.props;
      history.push('/dashboard/default');
    }
  }

  handleChange(e) {
    $('#loader').hide();
    $('#failedMessage').hide();
  }

  handleSubmit = e => {
    e.preventDefault();

    $('#loader').show();
    $('#failedMessage').hide();
    $("input").attr('disabled','disabled');

    const email = e.target.email.value;
    const password = e.target.password.value;

    Promise
      .resolve(this.props.loginAction(email, password))
      .then(() => {
        const { userState } = this.props;
        if (userState.isFetching === false) {
          if (userState.user === null) {
            $('#loader').hide();
            $('#failedMessage').show();
            $("input").removeAttr('disabled');
          }
          else {
            if (userState.user.user.role === 'admin') {
              const { history } = this.props;
              history.push('/dashboard/default');
            }
            else {
              $('#loader').hide();
              $('#failedMessage').show();
              $("input").removeAttr('disabled');
            }
          }
        }
      });
  }

  render () {

    return(
        <Aux>
            <Breadcrumb/>
            <div className="auth-wrapper">
                <div className="auth-content">
                    <div className="auth-bg">
                        <span className="r"/>
                        <span className="r s"/>
                        <span className="r s"/>
                        <span className="r"/>
                    </div>
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="mb-4">
                                <i className="feather icon-unlock auth-icon"/>
                            </div>
                            <h3 className="mb-4">Login</h3>
                            <form
                              id='loginForm'
                              onSubmit={ this.handleSubmit } noValidate
                            >
                              <div className="input-group mb-3">
                                  <input id="email" name="email" type="Email" className="form-control" placeholder="Email" onChange={this.handleChange}/>
                              </div>
                              <div className="input-group mb-4">
                                  <input id="password" name="password" type="password" className="form-control" placeholder="Password" onChange={this.handleChange}/>
                              </div>

                              <div  className="d-flex justify-content-center mb-3">
                                  <span style={{ display: 'none' }} id='loader' className='spinner-border text-info' role='status'/>
                              </div>

                              <div  className="d-flex justify-content-center mb-3">
                                  <span style={{ display: 'none' }} id='failedMessage' className='text-danger'>Wrong email or password! Please try again!</span>
                              </div>

                              <button type="submit" form="loginForm" className="btn btn-primary shadow-2 mb-4">Login</button>

                              <p className="mb-2 text-muted">Forgot password? <NavLink to="/auth/reset-password">Reset</NavLink></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
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
    loginAction: (email, password) => dispatch(login(email, password)),
    logoutAction: () => dispatch(logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SignIn));
