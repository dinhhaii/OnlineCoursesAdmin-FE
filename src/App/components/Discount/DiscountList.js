import React from 'react';
import {Row, Col, Card, Table, Button, Pagination, DropdownButton, Dropdown, Modal} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';

import Aux from "../../../hoc/_Aux";
import { fetchAllDiscount } from './../../actions/discount';

class DiscountList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listDiscountWillDisplay: [],
      isModalOpen: false,
      selectedDiscount: null
    };

    this.handleStatusFilder = this.handleStatusFilter.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      Promise
        .resolve(this.props.fetchAllDiscountAction())
        .then(() => {
          this.setState({
            listDiscountWillDisplay: this.props.discountState.allDiscount
          });
        });
    }

    handleStatusFilter(status) {

      $('#statusFilter').text('asd');

      if (status !== 'resetStatus')
      {
        const { listDiscountWillDisplay } = this.state;

        var filter = listDiscountWillDisplay.filter(course => course.status === status);

        this.setState({
          listDiscountWillDisplay: filter
        });
      }
    }

    handleResetFilter() {
      $('#statusFilter').text('Status');

      const { allDiscount } = this.props.discountState;

      this.setState({
        listDiscountWillDisplay: allDiscount
      });
    }

    hideModal() {
      this.setState({
        isModalOpen: false
      });
    }

    showModal(index) {
      const { listDiscountWillDisplay } = this.state;

      this.setState({
        isModalOpen: true,
        selectedDiscount: listDiscountWillDisplay[index]
      });
    }

    handleChangeStatus() {
      const { selectedDiscount } = this.state;
      let status = selectedDiscount.status === 'pending' ? 'approved' : 'denied';

      Promise
        .resolve(this.props.changeStatusAction(selectedDiscount._id, status))
        .then(() => {
          alert('Status has been changed!');
          window.location.reload();
        })
    }

    render() {
      const { listDiscountWillDisplay, isModalOpen, selectedDiscount } = this.state;

      var discountCounter = 0;

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
                  {selectedDiscount ?
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
                              <Card.Title as="h5">List of Coupons</Card.Title>
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
                                      <th style={{width: '20%'}}>Code</th>
                                      <th style={{width: '20%'}}>Course</th>
                                      <th style={{width: '25%'}}>Percentage(%)</th>
                                      <th style={{width: '10%'}}>Status</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                    {listDiscountWillDisplay.map((discount, index) => {
                                      discountCounter++;
                                      return (
                                        <tr key={index.toString()}>
                                            <th scope="row">{discountCounter}</th>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {discount.code}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {discount.course.name}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'normal'}}>
                                             {discount.percentage}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {discount.status}
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
    discountState: state.discountState

  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllDiscountAction: () => dispatch(fetchAllDiscount())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DiscountList));
