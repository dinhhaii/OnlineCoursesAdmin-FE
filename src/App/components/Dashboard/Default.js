import React from 'react';
import {  Row,
          Col,
          Card,
          Table,
          Modal,
          Button,
          Pagination } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchAllUsers } from './../../actions/user';
import { fetchAllCourses, fetchPendingCourses, changeStatus } from './../../actions/course';
import { fetchAllLessons } from './../../actions/lesson';
import { fetchAllFeedback } from './../../actions/feedback';
import { fetchAllInvoices } from './../../actions/invoice';
import { fetchAllSurveys } from './../../actions/survey';

import Aux from "../../../hoc/_Aux";
import RevenueLineChart from "./RevenueLineChart";
import RateLineChart from "./RateLineChart";

const moment = require('moment');

class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pendingCourses: [],
      selectedCourse: null,
      currentPage: 1,
      coursesPerPage: 4,
      isCourseOpen: false,
    };
  }

  componentWillMount() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      const { history } = this.props;
      history.push('/auth/signin');
    }

      Promise
        .resolve(this.props.fetchPendingCoursesAction())
        .then(() => {
          const { pendingCourses } = this.props.courseState;

          this.setState({
            pendingCourses: pendingCourses
          })
        })
        .catch(err => console.log(err));

      this.props.fetchAllCoursesAction();
      this.props.fetchAllSurveysAction();
      this.props.fetchAllLessonsAction();
      this.props.fetchAllFeedbackAction();
      this.props.fetchAllInvoicesAction();
  }

  showCourseModal(index) {
    const { pendingCourses, currentPage, coursesPerPage } = this.state;

    index = (currentPage - 1) * coursesPerPage + (index);

    this.setState({
      isCourseOpen: true,
      selectedCourse: pendingCourses[index]
    });
  }

  hideModals() {
    this.setState({
      isCourseOpen: false
    });
  }


  handleApproveCourse(course) {
    if (window.confirm('Do you want to approve this course?') === true) {

      Promise
        .resolve(this.props.changeStatusAction(course._id, 'approved'))
        .then(() => {
          alert('Course has been approved!');
          window.location.reload();
        })
    }
  }

  handleRejectCourse(course) {
    if (window.confirm('Do you want to reject this course?') === true) {

      Promise
        .resolve(this.props.changeStatusAction(course._id, 'denied'))
        .then(() => {
          alert('Course has been denied!');
          window.location.reload();
        })
    }
  }


  render() {

    const { pendingCourses,
            isCourseOpen,
            selectedCourse,
            currentPage,
            coursesPerPage } = this.state;

    const { allUsers } = this.props.userState;
    const { allCourses } = this.props.courseState;
    const { allLessons } = this.props.lessonState;
    const { allFeedback } = this.props.feedbackState;
    const { allInvoices } = this.props.invoiceState;
    const { allSurveys } = this.props.surveyState;

    // Logic for displaying current todos
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = pendingCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    // Logic for displaying page numbers
    const pageNumbers = [];
    const lastPage = Math.ceil(pendingCourses.length / coursesPerPage);
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

    const courseModal = (
      selectedCourse ?
      <Aux>
      <Modal
         size="xl"
         aria-labelledby="contained-modal-title-vcenter"
         centered
         show={isCourseOpen}
       >
         <Modal.Header>
           <Modal.Title id="change-user-status">
             <h3><b>Course detail</b></h3>
           </Modal.Title>
         </Modal.Header>
         <Modal.Body>
         <Row>
            <Col  md='2'
                  className='d-flex justify-content-center'
            >
               <img  alt="Avatar"
                     src={selectedCourse.imageURL}
                     style={{width: '150px', height: '150px', borderRadius: '50%'}}/>
            </Col>

           <Col md='10'>
             <h5 style={{whiteSpace: 'normal'}}>
               <Table responsive style={{tableLayout: 'fixed', borderBottom: 'none', color: 'black'}}>
                   <tbody>
                   <tr>
                     <td style={{width: '20%', whiteSpace: 'normal'}}
                     >
                       <b>Name: </b>
                     </td>
                     <td style={{whiteSpace: 'normal'}}
                     >{selectedCourse.name}</td>
                   </tr>
                   <tr>
                     <td style={{width: '20%', whiteSpace: 'normal'}}
                   >
                     <b>Subject: </b>
                   </td>
                     <td style={{whiteSpace: 'normal'}}
                     >{selectedCourse.subject.name}</td>
                   </tr>
                   <tr>
                     <td style={{width: '20%', whiteSpace: 'normal'}}
                     >
                       <b>Lessons: </b>
                     </td>
                     <td style={{whiteSpace: 'normal', verticalAlign: 'middle'}}
                     >{selectedCourse.lessons.length}</td>
                   </tr>
                   <tr>
                     <td style={{width: '20%', whiteSpace: 'normal'}}
                     >
                       <b>Lecturer: </b>
                     </td>
                     <td style={{whiteSpace: 'normal'}}
                     >{moment(selectedCourse.startDate).format('YYYY-MM-DD')}</td>
                   </tr>
                   <tr>
                     <td style={{width: '20%', whiteSpace: 'normal'}}
                     >
                       <b>Duration: </b>
                     </td>
                     <td style={{whiteSpace: 'normal'}}
                     >{selectedCourse.duration}</td>
                   </tr>
                   <tr>
                     <td style={{width: '20%', whiteSpace: 'normal'}}
                     >
                       <b>Accessible Days: </b>
                     </td>
                     <td style={{whiteSpace: 'normal'}}
                     >{selectedCourse.accessibleDays}</td>
                   </tr>
                   <tr>
                     <td style={{width: '20%', whiteSpace: 'normal'}}
                     >
                       <b>Price: </b>
                     </td>
                     <td style={{whiteSpace: 'normal'}}
                     >{'$' + selectedCourse.price}</td>
                   </tr>
                   <tr>
                     <td style={{width: '20%', whiteSpace: 'normal'}}
                     >
                       <b>Coupons: </b>
                     </td>
                     <td style={{whiteSpace: 'normal'}}
                     >
                       {selectedCourse.discount.map(discount => (
                         <span>
                           {discount.code + ' '}
                         </span>
                       ))}
                     </td>
                   </tr>
                   <tr>
                     <td style={{width: '20%', whiteSpace: 'normal'}}
                     >
                       <b>Description: </b>
                     </td>
                     <td style={{whiteSpace: 'normal'}}
                     >{selectedCourse.description}</td>
                   </tr>
                   <tr>
                     <td style={{width: '20%', whiteSpace: 'normal'}}
                     >
                       <b>Status: </b>
                     </td>
                     <td>
                       <Button size='sm' style={{width: '20%'}}
                               className={selectedCourse.status === 'approved' ? 'btn-success'
                                         : selectedCourse.status === 'denied' ? 'btn-danger' : 'btn-warning'}
                       >
                         {selectedCourse.status === 'approved' ? 'Approved' : selectedCourse.status === 'denied' ? 'Denied' : 'Pending'}
                       </Button>
                     </td>
                   </tr>
                   </tbody>
               </Table>
             </h5>
           </Col>

         </Row>

         </Modal.Body>
           <Modal.Footer>
             <p>
               <span style={{color: 'red'}}>* </span>
               Note: Denied courses won't be appeared on the app.
             </p>
             <Button className='btn shadow-2' variant="secondary" onClick={() => this.hideModals()}>Close</Button>
             <Button className='btn shadow-2' variant="danger" onClick={() => this.handleRejectCourse(selectedCourse)}>Reject</Button>
             <Button className='btn shadow-2' variant="primary" onClick={() => this.handleApproveCourse(selectedCourse)}>Approve</Button>
           </Modal.Footer>
       </Modal>
      </Aux>
      : null
    );


    return (
        <Aux>

            {/*-------MODAL COURSE-----------*/}
            {courseModal}

            {/*--------------------------*/}
            <Row>
                <Col md={6} xl={6}>
                    <Card>
                        <Card.Body>
                            <RevenueLineChart allInvoices={allInvoices}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card>
                        <Card.Body>
                        <RateLineChart allSurveys={allSurveys}/>
                        </Card.Body>
                    </Card>
                </Col>



                {/*--------------PENDING COURSES-----------------------*/}
                <Col md={6} xl={8}>
                    <Card className='Recent-Users'>
                        <Card.Header>
                            <Card.Title as='h5'>Pending Courses</Card.Title>
                        </Card.Header>
                        <Card.Body className='px-0 py-2'>
                            <Table responsive hover>
                                <tbody>
                                {currentCourses.map((course, index) => {
                                  return (
                                    <tr className="unread"
                                        onClick={() => this.showCourseModal(index)}
                                    >
                                      <td>
                                        <img
                                          className="rounded-circle"
                                          style={{ width: "50px", height: '50px' }}
                                          src={course.imageURL}
                                          alt="activity-user"
                                        />
                                      </td>
                                      <td>
                                        <h6 className="mb-1">{course.name}</h6>
                                        <p className="m-0">Subject: {course.subject.name}</p>
                                      </td>
                                      <td>
                                        <h6 className="text-muted">
                                          {moment(course.createdAt).format('YYYY-MM-DD')}
                                        </h6>
                                      </td>
                                      <td>
                                        <button className="btn label theme-bg2 text-white f-12"
                                                onClick={() => this.handleRejectCourse(course)}
                                        >
                                          Reject
                                        </button>
                                        <button className="btn label theme-bg text-white f-12"
                                                onClick={() => this.handleApproveCourse(course)}
                                        >
                                          Approve
                                        </button>
                                      </td>
                                    </tr>
                                  )
                                })}
                                </tbody>
                            </Table>

                            <Pagination className='ml-3'>
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


                {/*----------------------------*/}



                <Col md={6} xl={4}>
                    <Card>
                        <Card.Body className='border-bottom'>
                            <div className="row d-flex align-items-center">
                                <div className="col-auto">
                                    <i className="feather icon-users f-30 text-c-purple"/>
                                </div>
                                <div className="col">
                                    <h3 className="f-w-300">{allUsers.length}</h3>
                                    <span className="d-block text-uppercase">Total users</span>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body className='border-bottom'>
                            <div className="row d-flex align-items-center">
                                <div className="col-auto">
                                    <i className="feather icon-cast f-30 text-c-red"/>
                                </div>
                                <div className="col">
                                    <h3 className="f-w-300">{allCourses.length}</h3>
                                    <span className="d-block text-uppercase">Total courses</span>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body className='border-bottom'>
                            <div className="row d-flex align-items-center">
                                <div className="col-auto">
                                    <i className="feather icon-play-circle f-30 text-c-green"/>
                                </div>
                                <div className="col">
                                    <h3 className="f-w-300">{allLessons.length}</h3>
                                    <span className="d-block text-uppercase">Total lessons</span>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="row d-flex align-items-center">
                                <div className="col-auto">
                                    <i className="feather icon-edit f-30 text-c-blue"/>
                                </div>
                                <div className="col">
                                    <h3 className="f-w-300">{allFeedback.length}</h3>
                                    <span className="d-block text-uppercase">Total feedback</span>
                                </div>
                            </div>
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
    userState: state.userState,
    courseState: state.courseState,
    lessonState: state.lessonState,
    feedbackState: state.feedbackState,
    invoiceState: state.invoiceState,
    surveyState: state.surveyState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllUsersAction: () => dispatch(fetchAllUsers()),
    fetchAllCoursesAction: () => dispatch(fetchAllCourses()),
    fetchAllLessonsAction: () => dispatch(fetchAllLessons()),
    fetchAllFeedbackAction: () => dispatch(fetchAllFeedback()),
    fetchAllInvoicesAction: () => dispatch(fetchAllInvoices()),
    fetchAllSurveysAction: () => dispatch(fetchAllSurveys()),
    fetchPendingCoursesAction: () => dispatch(fetchPendingCourses()),
    changeStatusAction: (_idCourse, status) => dispatch(changeStatus(_idCourse, status))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
