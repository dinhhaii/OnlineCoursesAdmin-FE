import React from 'react';
import {Row, Col, Card, Table, Button, Pagination, Modal} from 'react-bootstrap';
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
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        const { history } = this.props;
        history.push('/auth/signin');
      }

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

    handleResetFilter() {
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
      const { listCommentsWillDisplay, currentPage, commentsPerPage } = this.state;

      index = (currentPage - 1) * commentsPerPage + (index);

      this.setState({
        isModalOpen: true,
        selectedComment: listCommentsWillDisplay[index]
      });
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
                         size="xl"
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
                         >

                         <h5 style={{whiteSpace: 'normal'}}>
                           <b>COMMENT</b>
                           <Table responsive style={{tableLayout: 'fixed', borderBottom: 'none', color: 'black'}}>
                               <tbody>
                               <tr>
                                 <td style={{width: '30%', whiteSpace: 'normal'}}
                                 >
                                   <b>Content: </b>
                                 </td>
                                 <td style={{whiteSpace: 'normal'}}
                                 >{selectedComment.content}</td>
                               </tr>
                               </tbody>
                           </Table>
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
                                 >{selectedComment.lesson.name}</td>
                               </tr>
                               <tr>
                                 <td style={{width: '30%', whiteSpace: 'normal'}}
                               >
                                 <b>Lecture URL: </b>
                               </td>
                                 <td style={{whiteSpace: 'normal'}}
                                 ><Link to={selectedComment.lesson.lectureURL}>Click here</Link></td>
                               </tr>
                               {selectedComment.lesson.files.length === 0 ?
                                 null
                                 :
                                 <tr>
                                   <td style={{width: '30%', whiteSpace: 'normal'}}
                                   >
                                     <b>Files: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >
                                     {selectedComment.lesson.files.map(file => (
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
                                 >{selectedComment.lesson.description}</td>
                               </tr>
                               </tbody>
                           </Table>

                         </h5>

                         </Col>

                        <Col md='6'>
                          <h5 style={{whiteSpace: 'normal'}}>
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
                                          src={selectedComment.user.imageURL}
                                          style={{width: '100px', height: '100px', borderRadius: '50%'}}/>
                                  </td>
                                </tr>
                                <tr>
                                  <td style={{width: '30%', whiteSpace: 'normal'}}
                                >
                                  <b>Full name: </b>
                                </td>
                                  <td style={{whiteSpace: 'normal'}}
                                  >{selectedComment.user.firstName + ' ' + selectedComment.user.lastName}</td>
                                </tr>
                                <tr>
                                  <td style={{width: '30%', whiteSpace: 'normal'}}
                                  >
                                    <b>Email: </b>
                                  </td>
                                  <td style={{whiteSpace: 'normal'}}
                                  >{selectedComment.user.email}</td>
                                </tr>
                                <tr>
                                  <td style={{width: '30%', whiteSpace: 'normal'}}
                                  >
                                    <b>Type: </b>
                                  </td>
                                  <td style={{whiteSpace: 'normal'}}
                                  >{selectedComment.user.type === 'local' ? 'Local' : selectedComment.user.type === 'google' ? 'Google' : 'Facebook'}</td>
                                </tr>
                                <tr>
                                  <td style={{width: '30%', whiteSpace: 'normal'}}
                                  >
                                    <b>Status: </b>
                                  </td>
                                  <td style={{whiteSpace: 'normal'}}
                                  >
                                    <Button  size='sm' style={{width: '30%', verticalAlign: 'middle'}}
                                            className={selectedComment.user.status === 'verified' ? 'btn-success'
                                                    : selectedComment.user.status === 'unverified' ? 'btn-warning' : 'btn-danger'}
                                    >
                                      {selectedComment.user.status === 'verified' ? 'Verified'
                                      : selectedComment.user.status === 'unverified' ? 'Unverified' : 'Banned'}
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
                               Note: Any comments belongs to denied course won't be appeared on the app.
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
                                  placeholder="Search by lesson..."
                                  className="form-control mb-3 mr-3"
                                  style={{maxWidth: '25%', float: 'left'}}
                                  onChange={this.handleSearch}/>


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
