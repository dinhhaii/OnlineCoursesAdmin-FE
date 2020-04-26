import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {Row, Col, Card, Form, Button} from 'react-bootstrap';
import $ from 'jquery';

import Aux from "../../../hoc/_Aux";
import { changeStatus, fetchUserById } from './../../actions/user';

class UserDetail extends React.Component {

  componentWillMount() {
    const { id } = this.props.match.params;

    Promise
      .resolve(this.props.fetchUserByIdAction(id))
      .then(() => {
        const { fetchedUser } = this.props.userState;
        if (fetchedUser) {
          $('#fullName').val(fetchedUser.firstName + ' ' + fetchedUser.lastName);
          $('#email').val(fetchedUser.email);
          $('#type').val(fetchedUser.type === 'local' ? 'Local' : fetchedUser.type === 'google' ? 'Google' : 'Facebook');
          $('#role').val(fetchedUser.role === 'learner' ? 'Learner' : 'Lecturer');
          $('#avatar').attr('src', fetchedUser.imageURL);
        }
        else {
          this.props.history.push('/dashboard/default');
        }
      });
  }

  handleSubmit = e => {
    e.preventDefault();

    $('#loader').show();
    $('#successMessage').hide();
    $('#failedMessage').hide();
    $("#submit").attr('disabled','disabled');
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

  handleCheck() {
    var attr = $('#submit').attr('disabled');

    if (typeof attr !== typeof undefined && attr !== false) {
        $("#submit").removeAttr('disabled');
    }
    else {
      $('#submit').attr('disabled', 'disabled');
    }
  }

  render() {

    return (
        <Aux>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">User Detail</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={4}>
                                  <img id='avatar' className="img-radius" alt="Avatar" style={{width: '50%', height: '50%'}}/>
                                </Col>
                                <Col md={8}>
                                <Form>
                                    <Form.Group controlId="formBasicFullName">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control id='fullName' type="text" readOnly/>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control id='email' type="email" readOnly />
                                    </Form.Group>

                                    <Form.Group controlId="formBasicRople">
                                        <Form.Label>Role</Form.Label>
                                        <Form.Control id='role' type="email" readOnly />
                                    </Form.Group>

                                    <Form.Group controlId="formBasicType">
                                        <Form.Label>Type</Form.Label>
                                        <Form.Control id='type' type="text" readOnly/>
                                    </Form.Group>

                                    <div  className="d-flex justify-content-center mb-3">
                                        <span style={{ display: 'none' }} id='loader' className='spinner-border text-info' role='status'/>
                                    </div>


                                    <Button id='submit' type='submit' variant="primary" style={{float: 'left'}}>
                                        Update
                                    </Button>
                                    <Form.Group inline controlId="formBasicStatus">
                                        <Form.Check
                                            custom
                                            type="checkbox"
                                            label="Update user info"
                                            inline
                                            onClick={() => this.handleCheck()}
                                        />
                                    </Form.Group>

                                    <div  className="d-flex justify-content-center mb-3">
                                        <span style={{ display: 'none' }} id='successMessage' className='text-success'>User is updated!</span>
                                    </div>

                                    <div  className="d-flex justify-content-center mb-3">
                                        <span style={{ display: 'none' }} id='failedMessage' className='text-danger'>Something wrong! Please try again!</span>
                                    </div>

                                </Form>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
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
    changeStatusAction: (_idUser, status) => dispatch(changeStatus(_idUser, status)),
    fetchUserByIdAction: _idUser => dispatch(fetchUserById(_idUser))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserDetail));
