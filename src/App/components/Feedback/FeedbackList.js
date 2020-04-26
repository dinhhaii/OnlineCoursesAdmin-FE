import React from 'react';
import {Row, Col, Card, Table, Button, Pagination, DropdownButton, Dropdown, Modal} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';

import Aux from "../../../hoc/_Aux";
import { fetchAllFeedback } from './../../actions/feedback';

const moment = require('moment');

class FeedbackList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listFeedbackWillDisplay: [],
      isModalOpen: false,
      selectedFeedback: null,
      currentPage: 1,
      feedbackPerPage: 5
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleStatusFilder = this.handleStatusFilter.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      Promise
        .resolve(this.props.fetchAllFeedbackAction())
        .then(() => {
          $('#loader').hide();
          this.setState({
            listFeedbackWillDisplay: this.props.feedbackState.allFeedback
          });
        });
    }

    handleSearch(e) {
      let value = e.target.value;
      let { allFeedback } = this.props.feedbackState;
      var filter = allFeedback.filter(feedback => feedback.course.name.toLowerCase().indexOf(value.toLowerCase()) !== -1)

      this.setState({
        listFeedbackWillDisplay: filter
      });
    }

    handleStatusFilter(status) {

      $('#statusFilter').text('asd');

      if (status !== 'resetStatus')
      {
        const { listFeedbackWillDisplay } = this.state;

        var filter = listFeedbackWillDisplay.filter(course => course.status === status);

        this.setState({
          listFeedbackWillDisplay: filter
        });
      }
    }

    handleResetFilter() {
      $('#statusFilter').text('Status');
      $('#searchBox').val('');

      const { allFeedback } = this.props.feedbackState;

      this.setState({
        listFeedbackWillDisplay: allFeedback
      });
    }

    hideModal() {
      this.setState({
        isModalOpen: false
      });
    }

    showModal(index) {
      const { listFeedbackWillDisplay } = this.state;

      this.setState({
        isModalOpen: true,
        selectedFeedback: listFeedbackWillDisplay[index]
      });
    }

    handleChangeStatus() {
      const { selectedFeedback } = this.state;
      let status = selectedFeedback.status === 'pending' ? 'approved' : 'denied';

      Promise
        .resolve(this.props.changeStatusAction(selectedFeedback._id, status))
        .then(() => {
          alert('Status has been changed!');
          window.location.reload();
        })
    }

    render() {
      const { listFeedbackWillDisplay,
              isModalOpen,
              selectedFeedback,
              currentPage,
              feedbackPerPage} = this.state;

      // Logic for displaying current todos
      const indexOfLastFeedback = currentPage * feedbackPerPage;
      const indexOfFirstFeedback = indexOfLastFeedback - feedbackPerPage;
      const currentFeedback = listFeedbackWillDisplay.slice(indexOfFirstFeedback, indexOfLastFeedback);

      // Logic for displaying page numbers
      const pageNumbers = [];
      const lastPage = Math.ceil(listFeedbackWillDisplay.length / feedbackPerPage);
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

      var feedbackCounter = indexOfFirstFeedback;

      return (
          <Aux>
              <Row>
                  <Col>

                  {/*-----------MODAL------------*/}
                  {selectedFeedback ?
                      <Modal
                         size="lg"
                         aria-labelledby="contained-modal-title-vcenter"
                         centered
                         show={isModalOpen}
                       >
                         <Modal.Header>
                           <Modal.Title id="change-user-status">
                             <h3><b>Feedback detail</b></h3>
                           </Modal.Title>
                         </Modal.Header>
                         <Modal.Body>
                         <Row>
                           <Col  md='6'
                                 className='d-flex justify-content-center'
                           >
                             <h5 style={{whiteSpace: 'normal'}}>
                              Course
                               <hr />
                               <b>Image:  </b>
                               <img  alt="Avatar"
                                     src={selectedFeedback.course.imageURL}
                                     style={{width: '150px', height: '150px', borderRadius: '50%'}}/>

                              <br /> <br />
                              <b>Name: </b>
                              <span>
                                {selectedFeedback.course.name}
                              </span>

                              <br /> <br />
                              <b>Start date: </b>
                              <span>
                                {moment(selectedFeedback.course.startDate).format('YYYY-MM-DD')}
                              </span>

                              <br /> <br />
                              <b>Duration: </b>
                              <span>
                                {selectedFeedback.course.duration}
                              </span>

                              <br /> <br />
                              <b>Accessible days: </b>
                              <span>
                                {selectedFeedback.course.accessibleDays}
                              </span>

                              <br /> <br />
                              <b>Price: </b>
                                <span>
                                  {'$' + selectedFeedback.course.price}
                                </span>

                              <br /> <br />
                              <b>Description: </b>
                              <span>
                                {selectedFeedback.course.description}
                              </span>

                              <br /> <br />
                              <b>Status: </b>
                              <Button size='sm' style={{width: '30%'}}
                                      className={selectedFeedback.course.status === 'approved' ? 'btn-success'
                                                : selectedFeedback.course.status === 'denied' ? 'btn-danger' : 'btn-warning'}
                              >
                                {selectedFeedback.course.status === 'approved' ? 'Approved' : selectedFeedback.course.status === 'denied' ? 'Denied' : 'Pending'}
                              </Button>
                             </h5>

                           </Col>

                          <Col md='6'>
                            <h5 style={{whiteSpace: 'normal'}}>
                             Feedback
                             <hr />
                             <b>Content: </b>
                             <span>
                               {selectedFeedback.content}
                             </span>

                             <br /> <br />
                             <b>Rate: </b>
                             <span>
                               {selectedFeedback.rate}
                             </span>

                             <br />
                             <hr />
                             User
                             <br /><br />
                             <b>Image:  </b>
                             <img  alt="Avatar"
                                   src={selectedFeedback.user.imageURL}
                                   style={{width: '150px', height: '150px', borderRadius: '50%'}}/>

                             <br /> <br />
                             <b>Full Name: </b>
                             <span>
                               {selectedFeedback.user.firstName + ' ' + selectedFeedback.user.lastName}
                             </span>

                             <br /> <br />
                             <b>Email: </b>
                             <span>
                               {selectedFeedback.user.name}
                             </span>

                             <br /> <br />
                             <b>Type: </b>
                             <span>
                               {selectedFeedback.user.type === 'local' ? 'Local' : selectedFeedback.user.type === 'google' ? 'Google' : 'Facebook'}
                             </span>

                             <br /> <br />
                             <b>Status: </b>
                               <Button  size='sm' style={{width: '30%', verticalAlign: 'middle'}}
                                       className={selectedFeedback.user.status === 'verified' ? 'btn-success'
                                               : selectedFeedback.user.status === 'unverified' ? 'btn-warning' : 'btn-danger'}
                               >
                                 {selectedFeedback.user.status === 'verified' ? 'Verified'
                                 : selectedFeedback.user.status === 'unverified' ? 'Unverified' : 'Banned'}
                               </Button>
                               <hr />
                            </h5>
                          </Col>
                         </Row>
                         </Modal.Body>
                           <Modal.Footer>
                             <p>
                               <span style={{color: 'red'}}>* </span>
                               Note: Any feedback belongs to denied course won't be appeared on the app.
                             </p>
                             <Button className='btn shadow-2' variant="danger" onClick={() => this.hideModal()}>Close</Button>
                           </Modal.Footer>
                       </Modal>
                      : null
                    }

                     {/*----------CARD-------------*/}

                      <Card>
                          <Card.Header>
                              <Card.Title as="h5">List of Feedback</Card.Title>
                          </Card.Header>
                          <Card.Body>

                          <input id='searchBox' name='searchBox'
                                  type="text"
                                  placeholder="Search by course..."
                                  className="form-control mb-3 mr-3"
                                  style={{maxWidth: '25%', float: 'left'}}
                                  onChange={this.handleSearch}/>

                          {/* Status Filter */}

                              <DropdownButton
                                  title='Status'
                                  variant='secondary'
                                  id='statusFilter'
                                  key='statusFilter'
                                  style={{maxWidth: '10%', float: 'left'}}
                                  className='mb-3 mr-3'
                              >
                                  <Dropdown.Item eventKey="success" onClick={() => this.handleStatusFilter('success')}>
                                    Success
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="canceled" onClick={() => this.handleStatusFilter('canceled')}>
                                    Canceled
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="reported" onClick={() => this.handleStatusFilter('reported')}>
                                    Reported
                                  </Dropdown.Item>
                              </DropdownButton>

                              <Button className="btn btn-danger" onClick={() => this.handleResetFilter()}>Reset Filters</Button>

                              <Table hover responsive style={{tableLayout: 'fixed'}}>
                                  <thead>
                                  <tr>
                                      <th style={{width: '5%'}}>#</th>
                                      <th style={{width: '20%'}}>User</th>
                                      <th style={{width: '20%'}}>Course</th>
                                      <th style={{width: '25%'}}>Content</th>
                                      <th style={{width: '10%'}}>Rate</th>
                                  </tr>

                                  <span id='loader'
                                        className='spinner-border align-self-center mb-5 mt-5'
                                        role='status'
                                        style={{marginLeft: '750%'}}/>


                                  </thead>
                                  <tbody>
                                    {currentFeedback.map((feedback, index) => {
                                      feedbackCounter++;
                                      return (
                                        <tr key={index.toString()}
                                            onClick={() => this.showModal(index)}
                                        >
                                            <th scope="row">{feedbackCounter}</th>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {feedback.user.email}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {feedback.course.name}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'normal'}}>
                                              {feedback.content}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {feedback.rate}
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
    feedbackState: state.feedbackState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllFeedbackAction: () => dispatch(fetchAllFeedback())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FeedbackList));
