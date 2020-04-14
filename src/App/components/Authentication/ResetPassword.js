import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';

import './../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "./../../layout/AdminLayout/Breadcrumb";
import { forgotPassword } from './../../actions/user';

class ResetPassword extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    $('#loader').hide();
    $('#successMessage').hide();
    $('#failedMessage').hide();
  }

  handleSubmit = e => {
    e.preventDefault();

    $('#loader').show();
    $("input").attr('disabled','disabled');
    const email = e.target.email.value;

    Promise
      .resolve(this.props.forgotPasswordAction(email))
      .then(() => {
        const { userState } = this.props;
        if (!userState.isSendingEmail)
        {
          if (userState.isPasswordReset)
          {
            $('#loader').hide();
            $('#successMessage').show();
            $("input").removeAttr('disabled');
          }
          else {
            $('#loader').hide();
            $('#failedMessage').show();
            $("input").removeAttr('disabled');
          }
        }
      })
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
                                <i className="feather icon-mail auth-icon"/>
                            </div>
                            <h3 className="mb-4">Reset Password</h3>
                            <form
                              id='resetPasswordForm'
                              onSubmit={ this.handleSubmit }
                            >
                              <div className="input-group mb-3">
                                  <input id="email" name="email" type="Email" className="form-control" placeholder="Email" onChange={this.handleChange}/>
                              </div>

                              <div  className="d-flex justify-content-center mb-3">
                                  <span style={{ display: 'none' }} id='loader' className='spinner-border text-info' role='status'/>
                              </div>

                              <div  className="d-flex justify-content-center mb-3">
                                  <span style={{ display: 'none' }} id='successMessage' className='text-success'>Email is sent to your Mailbox!</span>
                              </div>

                              <div  className="d-flex justify-content-center mb-3">
                                  <span style={{ display: 'none' }} id='failedMessage' className='text-danger'>Wrong email! Please check again!</span>
                              </div>

                              <button type="submit" form="resetPasswordForm" className="btn btn-primary shadow-2 mb-4">Send</button>

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
    forgotPasswordAction: email => dispatch(forgotPassword(email))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ResetPassword));
