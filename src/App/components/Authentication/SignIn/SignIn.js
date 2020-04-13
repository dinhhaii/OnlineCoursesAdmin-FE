import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import './../../../../assets/scss/style.scss';
import Aux from "../../../../hoc/_Aux";
import Breadcrumb from "./../../../layout/AdminLayout/Breadcrumb";
import { login } from './../../../actions/user';

class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.loginAction(e.target.email.value, e.target.password.value);


    console.log(this.props);
  }

  render () {
    console.log(this.props);
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
                                onSubmit={ this.handleSubmit }
                                noValidate
                              >
                                <div className="input-group mb-3">
                                    <input id="email" name="email" type="Email" className="form-control" placeholder="Email"/>
                                </div>
                                <div className="input-group mb-4">
                                    <input id="password" name="password" type="password" className="form-control" placeholder="Password"/>
                                </div>
                                <button type="submit" form="loginForm" className="btn btn-primary shadow-2 mb-4">Login</button>

                                <p className="mb-2 text-muted">Forgot password? <NavLink to="/auth/reset-password-1">Reset</NavLink></p>
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
    loginAction: (email, password) => dispatch(login(email, password))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
