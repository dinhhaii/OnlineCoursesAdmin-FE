import React from 'react';
import {Row, Col, Card, Table, Button, Pagination, Modal} from 'react-bootstrap';
import ReactStars from 'react-stars'
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
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        const { history } = this.props;
        history.push('/auth/signin');
      }

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

    handleResetFilter() {
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
      const { listFeedbackWillDisplay, currentPage, feedbackPerPage } = this.state;

      index = (currentPage - 1) * feedbackPerPage + (index);

      this.setState({
        isModalOpen: true,
        selectedFeedback: listFeedbackWillDisplay[index]
      });
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
      for (let number = -3; number <= 3; number++) {
        if (currentPage + number > 0 && currentPage + number <= lastPage) {
          pageNumbers.push(
            <Pagination.Item  key={currentPage + number}
                              id={currentPage + number}
                              active={currentPage + number === currentPage}
                              onClick={() => this.setState({currentPage: currentPage + number})}>
              {currentPage + number}
            </Pagination.Item>
          );
        }
      }

      var feedbackCounter = indexOfFirstFeedback;

      return (
          <Aux>
              <Row>
                  <Col>

                  {/*-----------MODAL------------*/}
                  {selectedFeedback ?
                      <Modal
                         size="xl"
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
                             <b>FEEDBACK</b>
                             <Table responsive style={{tableLayout: 'fixed', borderBottom: 'none', color: 'black'}}>
                                 <tbody>
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                   >
                                     <b>Content: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{selectedFeedback.content}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                 >
                                   <b>Rate: </b>
                                 </td>
                                   <td style={{whiteSpace: 'normal'}}>
                                   <ReactStars
                                    value={selectedFeedback.rate}
                                    size={24}
                                    color2={'#ffd700'} />
                                   </td>
                                 </tr>
                                 </tbody>
                             </Table>

                             <b>USER</b>
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
                                           src={selectedFeedback.user.imageURL}
                                           style={{width: '100px', height: '100px', borderRadius: '50%'}}/>
                                   </td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                 >
                                   <b>Full name: </b>
                                 </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{selectedFeedback.user.firstName + ' ' + selectedFeedback.user.lastName}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                   >
                                     <b>Email: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{selectedFeedback.user.email}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                   >
                                     <b>Type: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{selectedFeedback.user.type === 'local' ? 'Local' : selectedFeedback.user.type === 'google' ? 'Google' : 'Facebook'}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                   >
                                     <b>Status: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >
                                     <Button  size='sm' style={{width: '30%', verticalAlign: 'middle'}}
                                             className={selectedFeedback.user.status === 'verified' ? 'btn-success'
                                                     : selectedFeedback.user.status === 'unverified' ? 'btn-warning' : 'btn-danger'}
                                     >
                                       {selectedFeedback.user.status === 'verified' ? 'Verified'
                                       : selectedFeedback.user.status === 'unverified' ? 'Unverified' : 'Banned'}
                                     </Button>
                                   </td>
                                 </tr>
                                 </tbody>
                             </Table>
                             </h5>

                           </Col>

                          <Col md='6'>
                            <h5 style={{whiteSpace: 'normal'}}>
                             <b>COURSE</b>
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
                                           src={selectedFeedback.course.imageURL}
                                           style={{width: '100px', height: '100px', borderRadius: '50%'}}/>
                                   </td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                 >
                                   <b>Name: </b>
                                 </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{selectedFeedback.course.name}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                   >
                                     <b>Start date: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{moment(selectedFeedback.course.startDate).format('ll')}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                   >
                                     <b>Duration: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{selectedFeedback.course.duration}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                   >
                                     <b>Accessible days: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{selectedFeedback.course.accessibleDays}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                   >
                                     <b>Price: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{'$' + selectedFeedback.course.price}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                   >
                                     <b>Status: </b>
                                   </td>
                                   <td>
                                     <Button size='sm' style={{width: '30%'}}
                                             className={selectedFeedback.course.status === 'approved' ? 'btn-success'
                                                       : selectedFeedback.course.status === 'denied' ? 'btn-danger' : 'btn-warning'}
                                     >
                                       {selectedFeedback.course.status === 'approved' ? 'Approved' : selectedFeedback.course.status === 'denied' ? 'Denied' : 'Pending'}
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
                               Note: Any feedback belongs to denied course won't be appeared on the app.
                             </p>
                             <Button className='btn shadow-2' variant="secondary" onClick={() => this.hideModal()}>Close</Button>
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


                              <Button className="btn btn-danger" onClick={() => this.handleResetFilter()}>Reset Filters</Button>

                              <Table hover responsive style={{tableLayout: 'fixed'}}>
                                  <thead>
                                  <tr>
                                      <th style={{width: '5%'}}>#</th>
                                      <th style={{width: '20%'}}>User</th>
                                      <th style={{width: '20%'}}>Course</th>
                                      <th style={{width: '20%'}}>Content</th>
                                      <th style={{width: '20%'}}>Rate</th>
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

                                              <ReactStars
                                               value={feedback.rate}
                                               size={24}
                                               color2={'#ffd700'} />
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
