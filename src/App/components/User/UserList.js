import React from 'react';
import {Row, Col, Card, Table, Button, DropdownButton, Dropdown, Modal, Pagination} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';


import Aux from "../../../hoc/_Aux";
import { fetchAllUsers, changeStatus } from './../../actions/user';


class UserList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listUsersWillDisplay: [],
      isModalOpen: false,
      selectedUser: null,
      currentPage: 1,
      usersPerPage: 5,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleRoleFilter = this.handleRoleFilter.bind(this);
    this.handleTypeFilter = this.handleTypeFilter.bind(this);
    this.handleStatusFilder = this.handleStatusFilter.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      Promise
        .resolve(this.props.fetchAllUsersAction())
        .then(() => {
          $('#loader').hide();
          this.setState({
            listUsersWillDisplay: this.props.userState.allUsers
          });
        });
    }

    handleSearch(e) {
      let value = e.target.value;
      let { allUsers } = this.props.userState;
      var filter = allUsers.filter(user => user.email.toLowerCase().indexOf(value.toLowerCase()) !== -1)

      this.setState({
        listUsersWillDisplay: filter
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
      $('#searchBox').val('');

      const { allUsers } = this.props.userState;

      this.setState({
        listUsersWillDisplay: allUsers
      });
    }

    hideModal() {
      this.setState({
        isModalOpen: false
      });
    }

    showModal(index) {
      const { listUsersWillDisplay } = this.state;

      this.setState({
        isModalOpen: true,
        selectedUser: listUsersWillDisplay[index]
      });
    }

    handleChangeStatus() {
      const { selectedUser } = this.state;
      let status = selectedUser.status === 'verified' ? 'banned' : 'verified';

      Promise
        .resolve(this.props.changeStatusAction(selectedUser._id, status))
        .then(() => {
          alert('Status has been changed!');
          window.location.reload();
        })
    }

    render() {
      const { listUsersWillDisplay,
              isModalOpen,
              selectedUser,
              currentPage,
              usersPerPage} = this.state;

      // Logic for displaying current todos
      const indexOfLastUser = currentPage * usersPerPage;
      const indexOfFirstUser = indexOfLastUser - usersPerPage;
      const currentUsers = listUsersWillDisplay.slice(indexOfFirstUser, indexOfLastUser);

      // Logic for displaying page numbers
      const pageNumbers = [];
      const lastPage = Math.ceil(listUsersWillDisplay.length / usersPerPage);
      for (let number = 1; number <= lastPage; number++) {
        pageNumbers.push(
          <Pagination.Item  key={number}
                            id={number}
                            active={number === currentPage}
                            onClick={() => this.setState({currentPage: number})}>
            {number}
          </Pagination.Item>
      );
      }

      var userCounter = indexOfFirstUser;

      return (
          <Aux>
              <Row>
                  <Col>

                  {/*-----------MODAL------------*/}
                  {selectedUser ?
                      <Modal
                         size="lg"
                         aria-labelledby="contained-modal-title-vcenter"
                         centered
                         show={isModalOpen}
                       >
                         <Modal.Header>
                          {selectedUser.status === 'unverified' ?
                            <Modal.Title id="change-user-status">
                              <h3><b>This user have not been verified!</b></h3>
                            </Modal.Title>
                            :
                            <Modal.Title id="change-user-status">
                              <h3><b>Are you sure to {selectedUser.status !== 'banned' ? 'ban' : 'activate'} this user?</b></h3>
                            </Modal.Title>
                          }
                         </Modal.Header>
                         <Modal.Body>
                         {selectedUser.status === 'unverified' ?
                           <p>
                             <span style={{color: 'red'}}>* </span>
                             Note: This action is only for verified and banned users!
                           </p>
                           :
                           <h5 style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                            <b>Full name: </b>
                              <span>
                                {selectedUser.firstName + ' ' + selectedUser.lastName}
                              </span>
                            <br /> <br />
                            <b>Email: </b>
                              <span>
                                {selectedUser.email}
                              </span>
                            <br /> <br />
                            <b>Role: </b>
                              <span>
                                {selectedUser.role === 'learner' ? 'Learner' : 'Lecturer'}
                              </span>
                            <br /> <br />
                            <b>Type: </b>
                              <span>
                                {selectedUser.type === 'local' ? 'Local' : selectedUser.type === 'google' ? 'Google' : 'Facebook'}
                              </span>
                           </h5>
                         }
                         </Modal.Body>
                         {selectedUser.status === 'unverified' ?
                           <Modal.Footer>
                             <Button variant="danger" onClick={() => this.hideModal()}>Close</Button>
                           </Modal.Footer>
                           :
                           <Modal.Footer>
                             <p>
                               <span style={{color: 'red'}}>* </span>
                               Note: Banned users won't be allowed to sign in the app.
                             </p>
                             <Button variant="danger" onClick={() => this.hideModal()}>Cancel</Button>
                             <Button variant="primary" onClick={() => this.handleChangeStatus()}>Save</Button>
                           </Modal.Footer>
                         }
                       </Modal>
                      : null
                    }

                     {/*----------CARD-------------*/}

                      <Card>
                          <Card.Header>
                              <Card.Title as="h5">List of Users</Card.Title>
                          </Card.Header>
                          <Card.Body>

                          <input id='searchBox' name='searchBox'
                                  type="text"
                                  placeholder="Search by email..."
                                  className="form-control mb-3 mr-3"
                                  style={{maxWidth: '25%', float: 'left'}}
                                  onChange={this.handleSearch}/>

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

                                  <span id='loader'
                                        className='spinner-border align-self-center mb-5 mt-5'
                                        role='status'
                                        style={{marginLeft: '750%'}}/>


                                  </thead>
                                  <tbody>
                                    {currentUsers.map((user, index) => {
                                      userCounter++;
                                      return (
                                        <tr key={index.toString()}
                                            >
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
                                                      onClick={() => this.showModal(index)}
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
                                <Pagination.First
                                  style={{display: `${currentPage === 1 ? 'none' : 'initial'}`}}
                                  onClick={() => this.setState({currentPage: 1})}
                                />
                                <Pagination.Prev
                                  style={{display: `${currentPage === 1 ? 'none' : 'initial'}`}}
                                  onClick={() => this.setState({currentPage: currentPage - 1})}
                                />
                                {pageNumbers}
                                <Pagination.Next
                                  style={{display: `${currentPage === lastPage ? 'none' : 'initial'}`}}
                                  onClick={() => this.setState({currentPage: currentPage + 1})}
                                />
                                <Pagination.Last
                                  style={{display: `${currentPage === lastPage ? 'none' : 'initial'}`}}
                                  onClick={() => this.setState({currentPage: lastPage})}
                                />
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
    fetchAllUsersAction: email => dispatch(fetchAllUsers()),
    changeStatusAction: (_idUser, status) => dispatch(changeStatus(_idUser, status))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserList));
