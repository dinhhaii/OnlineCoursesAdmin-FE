import React from 'react';
import {Row, Col, Card, Table, Button, Pagination, DropdownButton, Dropdown, Modal} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
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
      selectedComment: null
    };

    this.handleStatusFilder = this.handleStatusFilter.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      Promise
        .resolve(this.props.fetchAllCommentsAction())
        .then(() => {
          this.setState({
            listCommentsWillDisplay: this.props.commentState.allComments
          });
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
      const { listCommentsWillDisplay, isModalOpen, selectedComment } = this.state;

      var commentCounter = 0;

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
                  {selectedComment ?
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
                                      <th style={{width: '20%'}}>Lesson</th>
                                      <th style={{width: '20%'}}>Content</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                    {listCommentsWillDisplay.map((comment, index) => {
                                      commentCounter++;
                                      return (
                                        <tr key={index.toString()}>
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
