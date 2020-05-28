import React from 'react';
import {  Row,
          Col,
          Card,
          Table,
          Button,
          DropdownButton,
          Dropdown,
          Modal,
          Pagination} from 'react-bootstrap';
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
      const token = localStorage.getItem('authToken');
      if (!token) {
        const { history } = this.props;
        history.push('/auth/signin');
      }

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

      const status = $('#statusFilter').text();
      const type = $('#typeFilter').text();
      var filter;

      const { allUsers } = this.props.userState;
      filter = allUsers.filter(user => user.role === role);

      if (status !== 'Status') {
        filter = filter.filter(user => user.status === status.toLowerCase());
      }

      if (type !== 'Type') {
        filter = filter.filter(user => user.type === type.toLowerCase());
      }

      this.setState({
        listUsersWillDisplay: filter
      });
    }

    handleTypeFilter(type) {

      $('#typeFilter').text(`${type === 'local' ? 'Local' : type === 'google' ? 'Google' : 'Facebook'}`);

      const status = $('#statusFilter').text();
      const role = $('#roleFilter').text();

      var filter;

      const { allUsers } = this.props.userState;
      filter = allUsers.filter(user => user.type === type);

      if (status !== 'Status') {
        filter = filter.filter(user => user.status === status.toLowerCase());
      }

      if (role !== 'Role') {
        filter = filter.filter(user => user.role === role.toLowerCase());
      }

      this.setState({
        listUsersWillDisplay: filter
      });
    }

    handleStatusFilter(status) {

      $('#statusFilter').text(`${status === 'verified' ? 'Verified' : status === 'unverified' ? 'Unverified' : 'Banned'}`);

      const role = $('#roleFilter').text();
      const type = $('#typeFilter').text();
      var filter;

      const { allUsers } = this.props.userState;
      filter = allUsers.filter(user => user.status === status);

      if (role !== 'Role') {
        filter = filter.filter(user => user.role === role.toLowerCase());
      }

      if (type !== 'Type') {
        filter = filter.filter(user => user.type === type.toLowerCase());
      }

      this.setState({
        listUsersWillDisplay: filter
      });
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
      const { listUsersWillDisplay, currentPage, usersPerPage } = this.state;

      index = (currentPage - 1) * usersPerPage + (index);

      this.setState({
        isModalOpen: true,
        selectedUser: listUsersWillDisplay[index]
      });
    }

    handleChangeStatus() {
      if (window.confirm('Do you want to change this user status?') === true) {
        const { selectedUser } = this.state;
        let status = selectedUser.status === 'verified' ? 'banned' : 'verified';

        Promise
          .resolve(this.props.changeStatusAction(selectedUser._id, status))
          .then(() => {
            alert('Status has been changed!');
            window.location.reload();
          })
      }
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
                         size="xl"
                         aria-labelledby="contained-modal-title-vcenter"
                         centered
                         show={isModalOpen}
                       >
                         <Modal.Header>
                           <Modal.Title id="change-user-status">
                             <h3><b>User detail</b></h3>
                           </Modal.Title>
                         </Modal.Header>
                         <Modal.Body>
                         <Row>
                          <Col md='2'
                               className='d-flex justify-content-center'>
                            <img  alt="Avatar"
                                  src={selectedUser.imageURL}
                                  style={{width: '150px', height: '150px', borderRadius: '50%'}}/>
                          </Col>
                          <Col md='10'>
                            <h5 style={{whiteSpace: 'normal'}}>
                            <Table responsive style={{tableLayout: 'fixed', borderBottom: 'none', color: 'black'}}>
                                <tbody>
                                <tr>
                                  <td style={{width: '20%', whiteSpace: 'normal'}}
                                  >
                                    <b>Full name: </b>
                                  </td>
                                  <td style={{whiteSpace: 'normal'}}
                                  >{selectedUser.firstName + ' ' + selectedUser.lastName}</td>
                                </tr>
                                <tr>
                                  <td style={{width: '20%', whiteSpace: 'normal'}}
                                >
                                  <b>Email: </b>
                                </td>
                                  <td style={{whiteSpace: 'normal'}}
                                  >{selectedUser.email}</td>
                                </tr>
                                <tr>
                                  <td style={{width: '20%', whiteSpace: 'normal'}}
                                  >
                                    <b>Role: </b>
                                  </td>
                                  <td style={{whiteSpace: 'normal', verticalAlign: 'middle'}}
                                  >{selectedUser.role === 'learner' ? 'Learner' : 'Lecturer'}</td>
                                </tr>
                                <tr>
                                  <td style={{width: '20%', whiteSpace: 'normal'}}
                                  >
                                    <b>Type: </b>
                                  </td>
                                  <td style={{whiteSpace: 'normal'}}
                                  >{selectedUser.type === 'local' ? 'Local' : selectedUser.type === 'google' ? 'Google' : 'Facebook'}</td>
                                </tr>
                                <tr>
                                  <td style={{width: '20%', whiteSpace: 'normal'}}
                                  >
                                    <b>Bio: </b>
                                  </td>
                                  <td style={{whiteSpace: 'normal'}}
                                  >{selectedUser.bio}</td>
                                </tr>
                                <tr>
                                  <td style={{width: '20%', whiteSpace: 'normal'}}
                                  >
                                    <b>Status: </b>
                                  </td>
                                  <td>
                                    <Button  size='sm' style={{width: '20%', verticalAlign: 'middle'}}
                                            className={selectedUser.status === 'verified' ? 'btn-success'
                                                    : selectedUser.status === 'unverified' ? 'btn-warning' : 'btn-danger'}
                                    >
                                      {selectedUser.status === 'verified' ? 'Verified'
                                      : selectedUser.status === 'unverified' ? 'Unverified' : 'Banned'}
                                    </Button>
                                  </td>
                                </tr>
                                </tbody>
                            </Table>
                            </h5>
                          </Col>

                         </Row>
                         </Modal.Body>
                         {selectedUser.status === 'unverified' ?
                           <Modal.Footer>
                             <p>
                               <span style={{color: 'red'}}>* </span>
                               Note: Only verified users can be banned.
                             </p>
                             <Button className='btn shadow-2' variant="secondary" onClick={() => this.hideModal()}>Close</Button>
                             <Button className='btn shadow-2' disabled variant="secondary">Change status</Button>
                           </Modal.Footer>
                           :
                           <Modal.Footer>
                             <p>
                               <span style={{color: 'red'}}>* </span>
                               Note: Banned users won't be allowed to sign in the app.
                             </p>
                             <Button className='btn shadow-2' variant="secondary" onClick={() => this.hideModal()}>Close</Button>
                             <Button className='btn shadow-2' variant="primary" onClick={() => this.handleChangeStatus()}>Change status</Button>
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

                              <Table hover responsive style={{tableLayout: 'fixed'}}>
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
                                            onClick={() => this.showModal(index)}
                                        >
                                            <th style={{verticalAlign: 'middle', display: 'table-cell'}} scope="row">{userCounter}</th>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'middle'}}>
                                              {user.firstName + ' ' + user.lastName}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'middle'}}>
                                              {user.email}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'middle'}}>
                                              {user.role === 'learner' ? 'Learner' : 'Lecturer'}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'middle'}}>
                                              {user.type === 'local' ? 'Local'
                                              : user.type === 'google' ? 'Google' : 'Facebook'}
                                            </td>
                                            <td>
                                              <Button  size='sm'
                                                      style={{width: '50%', verticalAlign: 'middle'}}
                                                      className={user.status === 'verified' ? 'btn-success'
                                                              : user.status === 'unverified' ? 'btn-warning' : 'btn-danger'
                                                              + ' btn shadow-2'}
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
