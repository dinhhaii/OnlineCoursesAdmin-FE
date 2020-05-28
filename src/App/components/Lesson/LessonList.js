import React from 'react';
import {Row, Col, Card, Table, Button, Pagination, Modal} from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';

import Aux from "../../../hoc/_Aux";
import { fetchAllLessons } from './../../actions/lesson';

const moment = require('moment');

class LessonList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listLessonsWillDisplay: [],
      isModalOpen: false,
      selectedLesson: null,
      currentPage: 1,
      lessonsPerPage: 5
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        const { history } = this.props;
        history.push('/auth/signin');
      }

      Promise
        .resolve(this.props.fetchAllLessonsAction())
        .then(() => {
          $('#loader').hide();
          this.setState({
            listLessonsWillDisplay: this.props.lessonState.allLessons
          });
        });
    }

    handleSearch(e) {
      let value = e.target.value;

      let { allLessons } = this.props.lessonState;
      var filter = allLessons.filter(lesson => lesson.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);

      this.setState({
        listLessonsWillDisplay: filter
      });
    }

    handleResetFilter() {
      $('#searchBox').val('');

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
      const { listLessonsWillDisplay, currentPage, lessonsPerPage } = this.state;

      index = (currentPage - 1) * lessonsPerPage + (index);

      this.setState({
        isModalOpen: true,
        selectedLesson: listLessonsWillDisplay[index]
      });
    }

    render() {
      const { listLessonsWillDisplay,
              isModalOpen,
              selectedLesson,
              currentPage,
              lessonsPerPage } = this.state;

      // Logic for displaying current todos
      const indexOfLastLesson = currentPage * lessonsPerPage;
      const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
      const currentLessons = listLessonsWillDisplay.slice(indexOfFirstLesson, indexOfLastLesson);

      // Logic for displaying page numbers
      const pageNumbers = [];
      const lastPage = Math.ceil(listLessonsWillDisplay.length / lessonsPerPage);
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

      var lessonCounter = indexOfFirstLesson;

      return (
          <Aux>
              <Row>
                  <Col>

                  {/*-----------MODAL------------*/}
                  {selectedLesson ?
                      <Modal
                         size="xl"
                         aria-labelledby="contained-modal-title-vcenter"
                         centered
                         show={isModalOpen}
                       >
                         <Modal.Header>
                           <Modal.Title id="change-user-status">
                             <h3><b>Lesson detail</b></h3>
                           </Modal.Title>
                         </Modal.Header>
                         <Modal.Body>
                           <Row>
                           <Col  md='6'
                                 className='d-flex justify-content-center'
                           >
                             <h5 style={{whiteSpace: 'normal'}}>
                              <b>COURSE</b>
                              <br />
                               <Table responsive style={{tableLayout: 'fixed', borderBottom: 'none', color: 'black'}}>
                                   <tbody>
                                   <tr>
                                     <td style={{width: '30%', whiteSpace: 'normal'}}
                                     >
                                       <b>Image: </b>
                                     </td>
                                     <td style={{whiteSpace: 'normal'}}
                                     >
                                       <img  alt="Avatar"
                                             src={selectedLesson.course.imageURL}
                                             style={{width: '100px', height: '100px', borderRadius: '50%'}}/>
                                     </td>
                                   </tr>
                                   <tr>
                                     <td style={{width: '30%', whiteSpace: 'normal'}}
                                   >
                                     <b>Name: </b>
                                   </td>
                                     <td style={{whiteSpace: 'normal'}}
                                     >{selectedLesson.course.name}</td>
                                   </tr>
                                   <tr>
                                     <td style={{width: '30%', whiteSpace: 'normal'}}
                                     >
                                       <b>Start date: </b>
                                     </td>
                                     <td style={{whiteSpace: 'normal'}}
                                     >{moment(selectedLesson.course.startDate).format('YYYY-MM-DD')}</td>
                                   </tr>
                                   <tr>
                                     <td style={{width: '30%', whiteSpace: 'normal'}}
                                     >
                                       <b>Duration: </b>
                                     </td>
                                     <td style={{whiteSpace: 'normal'}}
                                     >{selectedLesson.course.duration}</td>
                                   </tr>
                                   <tr>
                                     <td style={{width: '30%', whiteSpace: 'normal'}}
                                     >
                                       <b>Accessible days: </b>
                                     </td>
                                     <td style={{whiteSpace: 'normal'}}
                                     >{selectedLesson.course.accessibleDays}</td>
                                   </tr>
                                   <tr>
                                     <td style={{width: '30%', whiteSpace: 'normal'}}
                                     >
                                       <b>Price: </b>
                                     </td>
                                     <td style={{whiteSpace: 'normal'}}
                                     >{'$' + selectedLesson.course.price}</td>
                                   </tr>
                                   <tr>
                                     <td style={{width: '30%', whiteSpace: 'normal'}}
                                     >
                                       <b>Status: </b>
                                     </td>
                                     <td>
                                       <Button size='sm' style={{width: '30%'}}
                                               className={selectedLesson.course.status === 'approved' ? 'btn-success'
                                                         : selectedLesson.course.status === 'denied' ? 'btn-danger' : 'btn-warning'}
                                       >
                                         {selectedLesson.course.status === 'approved' ? 'Approved' : selectedLesson.course.status === 'denied' ? 'Denied' : 'Pending'}
                                       </Button>
                                     </td>
                                   </tr>
                                   </tbody>
                               </Table>
                             </h5>

                           </Col>

                          <Col md='6'>
                            <h5 style={{whiteSpace: 'normal'}}>
                             <b>LESSON</b>
                             <br />
                             <Table responsive style={{tableLayout: 'fixed', borderBottom: 'none', color: 'black'}}>
                                 <tbody>
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                   >
                                     <b>Name: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{selectedLesson.name}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                 >
                                   <b>Lecture URL: </b>
                                 </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   ><Link to={selectedLesson.lectureURL}>Click here</Link></td>
                                 </tr>
                                 {selectedLesson.files.length === 0 ?
                                   null
                                   :
                                   <tr>
                                     <td style={{width: '30%', whiteSpace: 'normal'}}
                                     >
                                       <b>Files: </b>
                                     </td>
                                     <td style={{whiteSpace: 'normal'}}
                                     >
                                       {selectedLesson.files.map(file => (
                                         <div>
                                          <Link to={file.fileURL}>{file.name}</Link>
                                          <br />
                                         </div>
                                       ))}
                                     </td>
                                   </tr>
                                 }
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                   >
                                     <b>Description: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{selectedLesson.description}</td>
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
                               Note: Any lesson belongs to denied course won't be appeared on the app.
                             </p>
                             <Button className='btn shadow-2' variant="secondary" onClick={() => this.hideModal()}>Close</Button>
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

                          <input id='searchBox' name='searchBox'
                                  type="text"
                                  placeholder="Search by name..."
                                  className="form-control mb-3 mr-3"
                                  style={{maxWidth: '25%', float: 'left'}}
                                  onChange={this.handleSearch}/>

                              <Button className="btn btn-danger" onClick={() => this.handleResetFilter()}>Reset Filters</Button>

                              <Table hover responsive style={{tableLayout: 'fixed'}}>
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
                                    {currentLessons.map((lesson, index) => {
                                      lessonCounter++;
                                      return (
                                        <tr key={index.toString()}
                                            onClick={() => this.showModal(index)}
                                        >
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
