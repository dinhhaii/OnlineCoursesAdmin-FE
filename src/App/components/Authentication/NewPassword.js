import React from 'react';
import { NavLink } from 'react-router-dom';

import './../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "./../../layout/AdminLayout/Breadcrumb";

class NewPassword extends React.Component {


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
                                <i className="feather icon-check-circle auth-icon"/>
                            </div>
                            <h3 className="mb-4">New password is sent to your email!</h3>
                            <p className="mb-2 text-muted">Want to Sign In? <NavLink to="/auth/signin"> Login</NavLink></p>
                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    );
  }
}

export default NewPassword;
