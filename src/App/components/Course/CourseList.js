import React from 'react';
import {Row, Col, Card, Table, Button, Pagination, DropdownButton, Dropdown, Modal} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';

import Aux from "../../../hoc/_Aux";
import { fetchAllCourses, changeStatus } from './../../actions/course';

class CourseList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listCoursesWillDisplay: [],
      isModalOpen: false,
      selectedCourse: null
    };

    this.handleStatusFilder = this.handleStatusFilter.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      Promise
        .resolve(this.props.fetchAllCoursesAction())
        .then(() => {
          $('#loader').hide();
          this.setState({
            listCoursesWillDisplay: this.props.courseState.allCourses
          });
        });
    }

    handleStatusFilter(status) {

      $('#statusFilter').text(`${status === 'approved' ? 'Approved' : status === 'Denied' ? 'denied' : 'Pending'}`);

      if (status !== 'resetStatus')
      {
        const { listCoursesWillDisplay } = this.state;

        var filter = listCoursesWillDisplay.filter(course => course.status === status);

        this.setState({
          listCoursesWillDisplay: filter
        });
      }
    }

    handleResetFilter() {
      $('#statusFilter').text('Status');

      const { allCourses } = this.props.courseState;

      this.setState({
        listCoursesWillDisplay: allCourses
      });
    }

    hideModal() {
      this.setState({
        isModalOpen: false
      });
    }

    showModal(index) {
      const { listCoursesWillDisplay } = this.state;

      this.setState({
        isModalOpen: true,
        selectedCourse: listCoursesWillDisplay[index]
      });
    }

    handleChangeStatus() {
      const { selectedCourse } = this.state;
      let status = selectedCourse.status === 'pending' ? 'approved' : 'denied';

      Promise
        .resolve(this.props.changeStatusAction(selectedCourse._id, status))
        .then(() => {
          alert('Status has been changed!');
          window.location.reload();
        })
    }

    render() {
      const { listCoursesWillDisplay, isModalOpen, selectedCourse } = this.state;

      var courseCounter = 0;

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
                  {selectedCourse ?
                      <Modal
                         size="lg"
                         aria-labelledby="contained-modal-title-vcenter"
                         centered
                         show={isModalOpen}
                       >
                         <Modal.Header>
                           <Modal.Title id="change-user-status">
                             <h3><b>Are you sure to {selectedCourse.status !== 'pending' ? 'approve' : 'deny'} this course?</b></h3>
                           </Modal.Title>
                         </Modal.Header>
                         <Modal.Body>
                           <h5 style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                            <b>Name: </b>
                              <span>
                                {selectedCourse.name}
                              </span>
                            <br /> <br />
                            <b>Subject: </b>
                              <span>
                                {selectedCourse.subject.name}
                              </span>
                            <br /> <br />
                            <b>Price: </b>
                              <span>
                                {'$' + selectedCourse.price}
                              </span>
                            <br /> <br />
                            <b>Coupons: </b>
                              {selectedCourse.discount.map(discount => (
                                <span>
                                  {discount.code + ' | '}
                                </span>
                              ))}
                           </h5>
                         </Modal.Body>
                           <Modal.Footer>
                             <p>
                               <span style={{color: 'red'}}>* </span>
                               Note: Denied courses won't be appeared on the app.
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
                              <Card.Title as="h5">List of Courses</Card.Title>
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
                                  <Dropdown.Item eventKey="approved" onClick={() => this.handleStatusFilter('approved')}>
                                    Approved
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="denied" onClick={() => this.handleStatusFilter('denied')}>
                                    Denied
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="pending" onClick={() => this.handleStatusFilter('pending')}>
                                    Pending
                                  </Dropdown.Item>
                              </DropdownButton>

                              <Button className="btn btn-danger" onClick={() => this.handleResetFilter()}>Reset Filters</Button>

                              <Table striped responsive style={{tableLayout: 'fixed'}}>
                                  <thead>
                                  <tr>
                                      <th style={{width: '10%'}}>#</th>
                                      <th style={{width: '20%'}}>Name</th>
                                      <th style={{width: '20%'}}>Subject</th>
                                      <th style={{width: '15%'}}>Price($)</th>
                                      <th style={{width: '15%'}}>Coupons</th>
                                      <th style={{width: '20%'}}>Status</th>
                                  </tr>

                                  <span id='loader'
                                        className='spinner-border align-self-center mb-5 mt-5'
                                        role='status'
                                        style={{marginLeft: '750%'}}/>

                                        
                                  </thead>
                                  <tbody>
                                    {listCoursesWillDisplay.map((course, index) => {
                                      courseCounter++;
                                      return (
                                        <tr key={index.toString()}>
                                            <th scope="row">{courseCounter}</th>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {course.name}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {course.subject.name}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {course.price}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {course.discount.length}
                                            </td>
                                            <td>
                                              <Button size='sm' style={{width: '50%'}}
                                                      className={course.status === 'approved' ? 'btn-success'
                                                                : course.status === 'denied' ? 'btn-danger' : 'btn-warning'
                                                                  + " btn shadow-2"}
                                                      onClick={() => this.showModal(index)}
                                              >
                                                {course.status === 'approved' ? 'Approved' : course.status === 'denied' ? 'Denied' : 'Pending'}
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
    courseState: state.courseState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllCoursesAction: () => dispatch(fetchAllCourses()),
    changeStatusAction: (_idCourse, status) => dispatch(changeStatus(_idCourse, status))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CourseList));
