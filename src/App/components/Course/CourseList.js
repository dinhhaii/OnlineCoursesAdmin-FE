import React from 'react';
import {Row, Col, Card, Table, Button, Pagination, DropdownButton, Dropdown, Modal} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';

import Aux from "../../../hoc/_Aux";
import { fetchAllCourses, changeStatus } from './../../actions/course';

const moment = require('moment');

class CourseList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listCoursesWillDisplay: [],
      isModalOpen: false,
      selectedCourse: null,
      currentPage: 1,
      coursesPerPage: 5
    };

    this.handleSearch = this.handleSearch.bind(this);
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

    handleSearch(e) {
      let value = e.target.value;
      let { allCourses } = this.props.courseState;
      var filter = allCourses.filter(course => course.name.toLowerCase().indexOf(value.toLowerCase()) !== -1)

      this.setState({
        listCoursesWillDisplay: filter
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
      $('#searchBox').val('');

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
      if (window.confirm('Do you want to change this course status?') === true) {
        const { selectedCourse } = this.state;
        let status = selectedCourse.status === 'approved' ? 'denied' : 'approved';

        Promise
          .resolve(this.props.changeStatusAction(selectedCourse._id, status))
          .then(() => {
            alert('Status has been changed!');
            window.location.reload();
          })
      }
    }

    render() {
      const { listCoursesWillDisplay,
              isModalOpen,
              selectedCourse,
              currentPage,
              coursesPerPage} = this.state;

      // Logic for displaying current todos
      const indexOfLastCourse = currentPage * coursesPerPage;
      const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
      const currentCourses = listCoursesWillDisplay.slice(indexOfFirstCourse, indexOfLastCourse);

      // Logic for displaying page numbers
      const pageNumbers = [];
      const lastPage = Math.ceil(listCoursesWillDisplay.length / coursesPerPage);
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

      var courseCounter = indexOfFirstCourse;

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
                             <h3><b>Course detail</b></h3>
                           </Modal.Title>
                         </Modal.Header>
                         <Modal.Body>
                         <Row>
                            <Col  md='4'
                                  className='d-flex justify-content-center'
                            >
                               <img  alt="Avatar"
                                     src={selectedCourse.imageURL}
                                     style={{width: '150px', height: '150px', borderRadius: '50%'}}/>
                            </Col>

                           <Col md='8'>
                             <h5 style={{whiteSpace: 'normal'}}>
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
                              <b>Lessons: </b>
                              {selectedCourse.lessons.length}

                              <br /> <br />
                              <b>Lecturer: </b>
                              <span>
                                {selectedCourse.lecturer.firstName + ' ' + selectedCourse.lecturer.lastName
                                + ' (' + selectedCourse.lecturer.email + ')'}
                              </span>

                              <br /> <br />
                              <b>Start date: </b>
                              <span>
                                {moment(selectedCourse.startDate).format('YYYY-MM-DD')}
                              </span>

                              <br /> <br />
                              <b>Duration: </b>
                              <span>
                                {selectedCourse.duration}
                              </span>

                              <br /> <br />
                              <b>Accessible days: </b>
                              <span>
                                {selectedCourse.accessibleDays}
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
                                  {discount.code + ' '}
                                </span>
                              ))}

                              <br /> <br />
                              <b>Description: </b>
                              <span>
                                {selectedCourse.description}
                              </span>

                              <br /> <br />
                              <b>Status: </b>
                              <Button size='sm' style={{width: '20%'}}
                                      className={selectedCourse.status === 'approved' ? 'btn-success'
                                                : selectedCourse.status === 'denied' ? 'btn-danger' : 'btn-warning'}
                              >
                                {selectedCourse.status === 'approved' ? 'Approved' : selectedCourse.status === 'denied' ? 'Denied' : 'Pending'}
                              </Button>
                             </h5>
                           </Col>

                         </Row>

                         </Modal.Body>
                           <Modal.Footer>
                             <p>
                               <span style={{color: 'red'}}>* </span>
                               Note: Denied courses won't be appeared on the app.
                             </p>
                             <Button className='btn shadow-2' variant="danger" onClick={() => this.hideModal()}>Close</Button>
                             <Button className='btn shadow-2' variant="primary" onClick={() => this.handleChangeStatus()}>Change status</Button>
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


                          <input id='searchBox' name='searchBox'
                                  type="text"
                                  placeholder="Search by name..."
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

                              <Table hover responsive style={{tableLayout: 'fixed'}}>
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
                                    {currentCourses.map((course, index) => {
                                      courseCounter++;
                                      return (
                                        <tr key={index.toString()}
                                            onClick={() => this.showModal(index)}
                                        >
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
