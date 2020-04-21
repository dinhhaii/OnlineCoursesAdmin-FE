import React from 'react';
import {Row, Col, Card, Table, Button, Pagination, DropdownButton, Dropdown, Modal} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';

import Aux from "../../../hoc/_Aux";
import { fetchAllFeedback } from './../../actions/feedback';

class FeedbackList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listFeedbackWillDisplay: [],
      isModalOpen: false,
      selectedFeedback: null
    };

    this.handleStatusFilder = this.handleStatusFilter.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      Promise
        .resolve(this.props.fetchAllFeedbackAction())
        .then(() => {
          this.setState({
            listFeedbackWillDisplay: this.props.feedbackState.allFeedback
          });
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
      const { listFeedbackWillDisplay, isModalOpen, selectedFeedback } = this.state;

      var feedbackCounter = 0;

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
                             <h3>
                               <b>

                               </b>
                             </h3>
                           </Modal.Title>
                         </Modal.Header>
                         <Modal.Body>
                           <h5 style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                            <b>Name: </b>
                              <span>

                              </span>
                            <br /> <br />
                            <b>Subject: </b>
                              <span>

                              </span>
                            <br /> <br />
                            <b>Price: </b>
                              <span>

                              </span>
                            <br /> <br />
                            <b>Coupons: </b>
                            <span>

                            </span>
                           </h5>
                         </Modal.Body>
                           <Modal.Footer>
                             <p>
                               <span style={{color: 'red'}}>* </span>
                               Note: Denied feedback won't be appeared on the app.
                             </p>
                             <Button variant="danger" onClick={() => this.hideModal()}>Cancel</Button>
                             <Button variant="primary" onClick={() => this.handleChangeStatus()}>Save</Button>
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

                              <Table striped responsive style={{tableLayout: 'fixed'}}>
                                  <thead>
                                  <tr>
                                      <th style={{width: '5%'}}>#</th>
                                      <th style={{width: '20%'}}>User</th>
                                      <th style={{width: '20%'}}>Course</th>
                                      <th style={{width: '25%'}}>Content</th>
                                      <th style={{width: '10%'}}>Rate</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                    {listFeedbackWillDisplay.map((feedback, index) => {
                                      feedbackCounter++;
                                      return (
                                        <tr key={index.toString()}>
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
