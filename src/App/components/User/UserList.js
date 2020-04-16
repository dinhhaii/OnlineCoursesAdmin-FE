import React from 'react';
import {Row, Col, Card, Table, Button, Pagination, DropdownButton, Dropdown} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';

import Aux from "../../../hoc/_Aux";
import { fetchAllUsers } from './../../actions/user';

class UserList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listUsersWillDisplay: []
    };

    this.handleRoleFilter = this.handleRoleFilter.bind(this);
    this.handleTypeFilter = this.handleTypeFilter.bind(this);
    this.handleStatusFilder = this.handleStatusFilter.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      Promise
        .resolve(this.props.fetchAllUsersAction())
        .then(() => {
          this.setState({
            listUsersWillDisplay: this.props.userState.allUsers
          });
        });
    }

    handleRoleFilter(role) {

      $('#roleFilter').text(`${role === 'learner' ? 'Learner' : 'Lecturer'}`);

      if (role !== 'resetRole')
      {
        const { listUsersWillDisplay } = this.state;

        var filter = listUsersWillDisplay.filter(user => user.role === role);

        this.setState({
          listUsersWillDisplay: filter
        });
      }
    }

    handleTypeFilter(type) {

      $('#typeFilter').text(`${type === 'local' ? 'Local' : type === 'google' ? 'Google' : 'Facebook'}`);

      if (type !== 'resetType')
      {
        const { listUsersWillDisplay } = this.state;

        var filter = listUsersWillDisplay.filter(user => user.type === type);

        this.setState({
          listUsersWillDisplay: filter
        });
      }
    }

    handleStatusFilter(status) {

      $('#statusFilter').text(`${status === 'verified' ? 'Verified' : status === 'unverified' ? 'Unverified' : 'Banned'}`);

      if (status !== 'resetStatus')
      {
        const { listUsersWillDisplay } = this.state;

        var filter = listUsersWillDisplay.filter(user => user.status === status);

        this.setState({
          listUsersWillDisplay: filter
        });
      }
    }

    handleResetFilter() {
      $('#roleFilter').text('Role');
      $('#typeFilter').text('Type');
      $('#statusFilter').text('Status');

      const { allUsers } = this.props.userState;

      this.setState({
        listUsersWillDisplay: allUsers
      });
    }

    render() {
      const { listUsersWillDisplay } = this.state;

      var userCounter = 0;

      let active = 3;
      let activeItems = [];

      for (let number = 1; number <= 5; number++) {
          activeItems.push(
              <Pagination.Item key={number} active={number === active}>
                  {number}
              </Pagination.Item>
          );
      }

      return (
          <Aux>
              <Row>
                  <Col>
                      <Card>
                          <Card.Header>
                              <Card.Title as="h5">List of Users</Card.Title>
                          </Card.Header>
                          <Card.Body>

                          {/* Role Filter */}
                              <DropdownButton
                                  id='roleFilter'
                                  title='Role'
                                  variant='secondary'
                                  key='roleFilter'
                                  style={{maxWidth: '10%', float: 'left'}}
                                  className='mb-3'
                              >
                                  <Dropdown.Item eventKey="learner" onClick={() => this.handleRoleFilter('learner')}>
                                    Learner
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="lecturer" onClick={() => this.handleRoleFilter('lecturer')}>
                                    Lecturer
                                  </Dropdown.Item>
                              </DropdownButton>

                          {/* Type Filter */}

                              <DropdownButton
                                  title='Type'
                                  variant='secondary'
                                  id='typeFilter'
                                  key='typeFilter'
                                  style={{maxWidth: '10%', float: 'left'}}
                                  className='mb-3 ml-3 mr-3'
                              >
                                  <Dropdown.Item eventKey="local" onClick={() => this.handleTypeFilter('local')}>
                                    Local
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="google" onClick={() => this.handleTypeFilter('google')}>
                                    Google
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="facebook" onClick={() => this.handleTypeFilter('facebook')}>
                                    Facebook
                                  </Dropdown.Item>
                              </DropdownButton>

                          {/* Status Filter */}

                              <DropdownButton
                                  title='Status'
                                  variant='secondary'
                                  id='statusFilter'
                                  key='statusFilter'
                                  style={{maxWidth: '10%', float: 'left'}}
                                  className='mb-3 mr-3'
                              >
                                  <Dropdown.Item eventKey="verified" onClick={() => this.handleStatusFilter('verified')}>
                                    Verified
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="unverified" onClick={() => this.handleStatusFilter('unverified')}>
                                    Unverified
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="banned" onClick={() => this.handleStatusFilter('banned')}>
                                    Banned
                                  </Dropdown.Item>
                              </DropdownButton>

                              <Button className="btn btn-danger" onClick={() => this.handleResetFilter()}>Reset Filters</Button>

                              <Table striped responsive style={{tableLayout: 'fixed'}}>
                                  <thead>
                                  <tr>
                                      <th style={{width: '10%'}}>#</th>
                                      <th style={{width: '20%'}}>Full Name</th>
                                      <th style={{width: '20%'}}>Email</th>
                                      <th style={{width: '15%'}}>Role</th>
                                      <th style={{width: '15%'}}>Type</th>
                                      <th style={{width: '20%'}}>Status</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                    {listUsersWillDisplay.map((user, index) => {
                                      userCounter++;
                                      return (
                                        <tr key={index.toString()}>
                                            <th scope="row">{userCounter}</th>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {user.firstName + ' ' + user.lastName}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {user.email}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {user.role === 'learner' ? 'Learner' : 'Lecturer'}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {user.type === 'local' ? 'Local'
                                              : user.type === 'google' ? 'Google' : 'Facebook'}
                                            </td>
                                            <td>
                                              <Button size='sm' style={{width: '50%'}}
                                                      className={user.status === 'verified' ? 'btn-success'
                                                                : user.status === 'unverified' ? 'btn-warning' : 'btn-danger'
                                                                + " btn shadow-2"}
                                              >
                                                {user.status === 'verified' ? 'Verified'
                                                                : user.status === 'unverified' ? 'Unverified' : 'Banned'}
                                              </Button>
                                            </td>
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                              </Table>

                              <Pagination>
                                {activeItems}
                              </Pagination>
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
