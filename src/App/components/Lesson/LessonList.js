import React from 'react';
import {Row, Col, Card, Table, Button, Pagination, DropdownButton, Dropdown, Modal} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';

import Aux from "../../../hoc/_Aux";
import { fetchAllLessons } from './../../actions/lesson';

class LessonList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listLessonsWillDisplay: [],
      isModalOpen: false,
      selectedLesson: null
    };

    this.handleStatusFilder = this.handleStatusFilter.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      Promise
        .resolve(this.props.fetchAllLessonsAction())
        .then(() => {
          $('#loader').hide();
          this.setState({
            listLessonsWillDisplay: this.props.lessonState.allLessons
          });
        });
    }

    handleStatusFilter(status) {

      $('#statusFilter').text('asd');

      if (status !== 'resetStatus')
      {
        const { listLessonsWillDisplay } = this.state;

        var filter = listLessonsWillDisplay.filter(course => course.status === status);

        this.setState({
          listLessonsWillDisplay: filter
        });
      }
    }

    handleResetFilter() {
      $('#statusFilter').text('Status');

      const { allLessons } = this.props.lessonState;

      this.setState({
        listLessonsWillDisplay: allLessons
      });
    }

    hideModal() {
      this.setState({
        isModalOpen: false
      });
    }

    showModal(index) {
      const { listLessonsWillDisplay } = this.state;

      this.setState({
        isModalOpen: true,
        selectedLesson: listLessonsWillDisplay[index]
      });
    }

    handleChangeStatus() {
      const { selectedLesson } = this.state;
      let status = selectedLesson.status === 'pending' ? 'approved' : 'denied';

      Promise
        .resolve(this.props.changeStatusAction(selectedLesson._id, status))
        .then(() => {
          alert('Status has been changed!');
          window.location.reload();
        })
    }

    render() {
      const { listLessonsWillDisplay, isModalOpen, selectedLesson } = this.state;

      var lessonCounter = 0;

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
                  {selectedLesson ?
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
                               Note: Denied lessons won't be appeared on the app.
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
                              <Card.Title as="h5">List of Lessons</Card.Title>
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
                                      <th style={{width: '25%'}}>Name</th>
                                      <th style={{width: '20%'}}>Course</th>
                                      <th style={{width: '10%'}}>Files</th>
                                      <th style={{width: '20%'}}>Lecture URL</th>
                                  </tr>

                                  <span id='loader'
                                        className='spinner-border align-self-center mb-5 mt-5'
                                        role='status'
                                        style={{marginLeft: '750%'}}/>

                                        
                                  </thead>
                                  <tbody>
                                    {listLessonsWillDisplay.map((lesson, index) => {
                                      lessonCounter++;
                                      return (
                                        <tr key={index.toString()}>
                                            <th scope="row">{lessonCounter}</th>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {lesson.name}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {lesson.course.name}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {lesson.files.length}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'normal'}}>
                                              {lesson.lectureURL}
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
    lessonState: state.lessonState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllLessonsAction: () => dispatch(fetchAllLessons())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LessonList));
