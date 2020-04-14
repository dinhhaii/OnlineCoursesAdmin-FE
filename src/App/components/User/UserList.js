import React from 'react';
import {Row, Col, Card, Table, Button} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Aux from "../../../hoc/_Aux";
import { fetchAllUsers } from './../../actions/user';

class UserList extends React.Component {

    componentWillMount() {
      this.props.fetchAllUsersAction();
    }


    render() {
      const { allUsers } = this.props.userState;

      var leanerCount = 0;
      var lecturerCount = 0;

      return (
          <Aux>
              <Row>
                  <Col>
                      <Card>
                          <Card.Header>
                              <Card.Title as="h5">List of Leaners</Card.Title>
                          </Card.Header>
                          <Card.Body>
                              <Table striped responsive style={{tableLayout: 'fixed'}}>
                                  <thead>
                                  <tr>
                                      <th style={{width: '10%'}}>#</th>
                                      <th style={{width: '20%'}}>Full Name</th>
                                      <th style={{width: '20%'}}>Email</th>
                                      <th style={{width: '15%'}}>Role</th>
                                      <th style={{width: '15%'}}>Type</th>
                                      <th style={{width: '20%'}}>Actions</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                    {allUsers.map((user, index) => {
                                      if (user.role === 'learner')
                                      {
                                        leanerCount++;
                                        return (
                                          <tr>
                                              <th scope="row">{leanerCount}</th>
                                              <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                                {user.firstName + user.lastName}
                                              </td>
                                              <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                                {user.email}
                                              </td>
                                              <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                                {user.role}
                                              </td>
                                              <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                                {user.type}
                                              </td>
                                              <td>
                                                <Button size='sm' style={{width: '50%'}}
                                                        className={"btn shadow-2" + user.status === 'verified' ? 'btn-success'
                                                                                  : user.status === 'unverified' ? 'btn-warning' : 'btn-danger'}
                                                >
                                                  {"btn shadow-2" + user.status === 'verified' ? 'Verified'
                                                                  : user.status === 'unverified' ? 'Unverified' : 'Banned'}
                                                </Button>
                                              </td>
                                          </tr>
                                        )
                                      }
                                      else return null;
                                    })}
                                  </tbody>
                              </Table>
                          </Card.Body>
                      </Card>

                      {/* ----------------- */}

                      <Card>
                          <Card.Header>
                              <Card.Title as="h5">List of Lecturers</Card.Title>
                          </Card.Header>
                          <Card.Body>
                              <Table striped responsive style={{tableLayout: 'fixed'}}>
                                  <thead>
                                  <tr>
                                      <th style={{width: '10%'}}>#</th>
                                      <th style={{width: '20%'}}>Full Name</th>
                                      <th style={{width: '20%'}}>Email</th>
                                      <th style={{width: '15%'}}>Role</th>
                                      <th style={{width: '15%'}}>Type</th>
                                      <th style={{width: '20%'}}>Actions</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                    {allUsers.map((user, index) => {
                                      if (user.role === 'lecturer')
                                      {
                                        lecturerCount++;
                                        return (
                                          <tr>
                                              <th scope="row">{lecturerCount}</th>
                                              <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                                {user.firstName + user.lastName}
                                              </td>
                                              <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                                {user.email}
                                              </td>
                                              <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                                {user.role}
                                              </td>
                                              <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                                {user.type}
                                              </td>
                                              <td>
                                                <Button size='sm' style={{width: '50%'}}
                                                        className={"btn shadow-2" + user.status === 'verified' ? 'btn-success'
                                                                                  : user.status === 'unverified' ? 'btn-warning' : 'btn-danger'}
                                                >
                                                  {"btn shadow-2" + user.status === 'verified' ? 'Verified'
                                                                  : user.status === 'unverified' ? 'Unverified' : 'Banned'}
                                                </Button>
                                              </td>
                                          </tr>
                                        )
                                      }
                                      else return null;
                                    })}
                                  </tbody>
                              </Table>
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
    fetchAllUsersAction: email => dispatch(fetchAllUsers())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserList));
