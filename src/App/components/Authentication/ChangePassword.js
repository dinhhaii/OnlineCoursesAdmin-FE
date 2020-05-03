import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';

import './../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "./../../layout/AdminLayout/Breadcrumb";
import { fetchUserById, changePassword } from './../../actions/user';
import bcrypt from 'bcryptjs';


class ChangePassword extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const { id } = this.props.match.params;

    this.props.fetchUserByIdAction(id);
  }

  shouldComponentUpdate(nextProps, nextState) {

    const { token } = nextProps.match.params;
    const { userState } = nextProps;

    if (userState.user)
    {
      var hash = bcrypt.compareSync(`${userState.user.email}-reset`, token);
      if (!hash) {
        this.props.history.push('/auth/reset-password');
      }
    }
  }

  handleChange(e) {
    $('#loader').hide();
    $('#successMessage').hide();
    $('#failedMessage').hide();
  }

  handleSubmit = e => {
    e.preventDefault();

    $('#loader').show();
    $('#successMessage').hide();
    $('#failedMessage').hide();
    $("input").attr('disabled','disabled');
    const password = e.target.password.value;
    const confirm = e.target.confirmPassoword.value;

    if (password === confirm) {
      const { _id } = this.props.userState.user;
      Promise
        .resolve(this.props.changePasswordAction(_id, password))
        .then(() => {
          const { userState } = this.props;
          if (userState.isPasswordReset)
          {
            $('#loader').hide();
            $('#successMessage').show();
            $("input").removeAttr('disabled');

            setTimeout(() => {
              this.props.history.push('/auth/signin');
            }, 3000);
          }
          else {
            $('#loader').hide();
            $('#failedMessage').show();
            $("input").removeAttr('disabled');
          }
        })
    }
    else {
      $('#loader').hide();
      $('#failedMessage').show();
      $("input").removeAttr('disabled');
    }
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
                                <i className="feather icon-refresh-cw auth-icon"/>
                            </div>
                            <h3 className="mb-4">Change Password</h3>
                            <form
                              id='changePasswordForm'
                              onSubmit={ this.handleSubmit }
                            >
                              <div className="input-group mb-3">
                                  <input id="passoword" name='password' type="password" className="form-control" placeholder="Password" onChange={this.handleChange}/>
                              </div>

                              <div className="input-group mb-3">
                                  <input id="confirmPassoword" name='confirmPassoword' type="password" className="form-control" placeholder="Confirm password" onChange={this.handleChange}/>
                              </div>

                              <div  className="d-flex justify-content-center mb-3">
                                  <span style={{ display: 'none' }} id='loader' className='spinner-border text-info' role='status'/>
                              </div>

                              <div  className="d-flex justify-content-center mb-3">
                                  <span style={{ display: 'none' }} id='successMessage' className='text-success'>Change password success! <br />Redirect to Login page in 3 seconds...</span>
                              </div>

                              <div  className="d-flex justify-content-center mb-3">
                                  <span style={{ display: 'none' }} id='failedMessage' className='text-danger'>Passwords do not match! Please try again!</span>
                              </div>

                              <button type="submit" form="changePasswordForm" className="btn btn-primary shadow-2 mb-4">Save</button>

                              <p className="mb-2 text-muted">Remember your password? <NavLink to="/auth/signin"> Login</NavLink></p>
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
    changePasswordAction: (_idUser, password) => dispatch(changePassword(_idUser, password)),
    fetchUserByIdAction: _idUser => dispatch(fetchUserById(_idUser))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChangePassword));
