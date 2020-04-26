import React from 'react';
import {Row, Col, Card, Table, Button, Pagination, DropdownButton, Dropdown, Modal} from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';

import Aux from "../../../hoc/_Aux";
import { fetchAllComments } from './../../actions/comment';

class CommentList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listCommentsWillDisplay: [],
      isModalOpen: false,
      selectedComment: null,
      currentPage: 1,
      commentsPerPage: 5
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleStatusFilder = this.handleStatusFilter.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      Promise
        .resolve(this.props.fetchAllCommentsAction())
        .then(() => {
          $('#loader').hide();
          this.setState({
            listCommentsWillDisplay: this.props.commentState.allComments
          });
        });
    }

    handleSearch(e) {
      let value = e.target.value;
      let { allComments } = this.props.commentState;
      var filter = allComments.filter(comment => comment.lesson.name.toLowerCase().indexOf(value.toLowerCase()) !== -1)

      this.setState({
        listCommentsWillDisplay: filter
      });
    }

    handleStatusFilter(status) {

      $('#statusFilter').text('asd');

      if (status !== 'resetStatus')
      {
        const { listCommentsWillDisplay } = this.state;

        var filter = listCommentsWillDisplay.filter(course => course.status === status);

        this.setState({
          listCommentsWillDisplay: filter
        });
      }
    }

    handleResetFilter() {
      $('#statusFilter').text('Status');
      $('#searchBox').val('');

      const { allComments } = this.props.commentState;

      this.setState({
        listCommentsWillDisplay: allComments
      });
    }

    hideModal() {
      this.setState({
        isModalOpen: false
      });
    }

    showModal(index) {
      const { listCommentsWillDisplay } = this.state;

      this.setState({
        isModalOpen: true,
        selectedComment: listCommentsWillDisplay[index]
      });
    }

    handleChangeStatus() {
      const { selectedComment } = this.state;
      let status = selectedComment.status === 'pending' ? 'approved' : 'denied';

      Promise
        .resolve(this.props.changeStatusAction(selectedComment._id, status))
        .then(() => {
          alert('Status has been changed!');
          window.location.reload();
        })
    }

    render() {
      const { listCommentsWillDisplay,
              isModalOpen,
              selectedComment,
              currentPage,
              commentsPerPage} = this.state;

      // Logic for displaying current todos
      const indexOfLastComment = currentPage * commentsPerPage;
      const indexOfFirstComment = indexOfLastComment - commentsPerPage;
      const currentComments = listCommentsWillDisplay.slice(indexOfFirstComment, indexOfLastComment);

      // Logic for displaying page numbers
      const pageNumbers = [];
      const lastPage = Math.ceil(listCommentsWillDisplay.length / commentsPerPage);
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

      var commentCounter = indexOfFirstComment;

      return (
          <Aux>
              <Row>
                  <Col>

                  {/*-----------MODAL------------*/}
                  {selectedComment ?
                      <Modal
                         size="lg"
                         aria-labelledby="contained-modal-title-vcenter"
                         centered
                         show={isModalOpen}
                       >
                         <Modal.Header>
                           <Modal.Title id="change-user-status">
                             <h3><b>Comment detail</b></h3>
                           </Modal.Title>
                         </Modal.Header>
                         <Modal.Body>
                         <Row>
                         <Col  md='6'
                               className='d-flex justify-content-center'
                         >

                         <h5 style={{whiteSpace: 'normal'}}>
                          Lesson
                          <hr />
                          <b>Name: </b>
                          <span>
                            {selectedComment.lesson.name}
                          </span>

                          <br /> <br />
                          <b>Lecture URL: </b>
                          <Link to={selectedComment.lesson.lectureURL}>Click here</Link>

                          <br /> <br />
                          <b>Files: </b>
                          {selectedComment.lesson.files.map(file => (
                            <div>
                             <Link to={file.fileURL}>{file.name}</Link>
                             <br />
                            </div>
                          ))}

                          <br />
                          <b>Description: </b>
                          <span>
                            {selectedComment.lesson.description}
                          </span>
                         </h5>

                         </Col>

                        <Col md='6'>
                          <h5 style={{whiteSpace: 'normal'}}>
                           Comment
                           <hr />
                           <b>Content: </b>
                           <span>
                             {selectedComment.content}
                           </span>

                           <br />
                           <hr />
                           User
                           <br /><br />
                           <b>Image:  </b>
                           <img  alt="Avatar"
                                 src={selectedComment.user.imageURL}
                                 style={{width: '150px', height: '150px', borderRadius: '50%'}}/>

                           <br /> <br />
                           <b>Full Name: </b>
                           <span>
                             {selectedComment.user.firstName + ' ' + selectedComment.user.lastName}
                           </span>

                           <br /> <br />
                           <b>Email: </b>
                           <span>
                             {selectedComment.user.name}
                           </span>

                           <br /> <br />
                           <b>Type: </b>
                           <span>
                             {selectedComment.user.type === 'local' ? 'Local' : selectedComment.user.type === 'google' ? 'Google' : 'Facebook'}
                           </span>

                           <br /> <br />
                           <b>Status: </b>
                             <Button  size='sm' style={{width: '30%', verticalAlign: 'middle'}}
                                     className={selectedComment.user.status === 'verified' ? 'btn-success'
                                             : selectedComment.user.status === 'unverified' ? 'btn-warning' : 'btn-danger'}
                             >
                               {selectedComment.user.status === 'verified' ? 'Verified'
                               : selectedComment.user.status === 'unverified' ? 'Unverified' : 'Banned'}
                             </Button>
                             <hr />
                          </h5>
                        </Col>
                        </Row>
                         </Modal.Body>
                           <Modal.Footer>
                             <p>
                               <span style={{color: 'red'}}>* </span>
                               Note: Any comments belongs to denied course won't be appeared on the app.
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
                                  placeholder="Search by lesson..."
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
                                      <th style={{width: '20%'}}>Lesson</th>
                                      <th style={{width: '20%'}}>Content</th>
                                  </tr>

                                  <span id='loader'
                                        className='spinner-border align-self-center mb-5 mt-5'
                                        role='status'
                                        style={{marginLeft: '750%'}}/>


                                  </thead>
                                  <tbody>
                                    {currentComments.map((comment, index) => {
                                      commentCounter++;
                                      return (
                                        <tr key={index.toString()}
                                            onClick={() => this.showModal(index)}
                                        >
                                            <th scope="row">{commentCounter}</th>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {comment.user.email}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {comment.lesson.name}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'normal'}}>
                                              {comment.content}
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
    commentState: state.commentState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllCommentsAction: () => dispatch(fetchAllComments())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CommentList));
