import React from 'react';
import {Row, Col, Card, Table, Button, Pagination, DropdownButton, Dropdown, Modal} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';


import Aux from "../../../hoc/_Aux";
import { fetchallInvoices } from './../../actions/invoice';

const moment = require('moment');

class InvoiceList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listInvoicesWillDisplay: [],
      isModalOpen: false,
      selectedInvoice: null
    };

    this.handleStatusFilder = this.handleStatusFilter.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      Promise
        .resolve(this.props.fetchallInvoicesAction())
        .then(() => {
          this.setState({
            listInvoicesWillDisplay: this.props.invoiceState.allInvoices
          });
        });
    }

    handleStatusFilter(status) {

      $('#statusFilter').text(`${status === 'success' ? 'Success' : status === 'canceled' ? 'Canceled' : 'Reported'}`);

      if (status !== 'resetStatus')
      {
        const { listInvoicesWillDisplay } = this.state;

        var filter = listInvoicesWillDisplay.filter(course => course.status === status);

        this.setState({
          listInvoicesWillDisplay: filter
        });
      }
    }

    handleResetFilter() {
      $('#statusFilter').text('Status');

      const { allInvoices } = this.props.invoiceState;

      this.setState({
        listInvoicesWillDisplay: allInvoices
      });
    }

    hideModal() {
      this.setState({
        isModalOpen: false
      });
    }

    showModal(index) {
      const { listInvoicesWillDisplay } = this.state;

      this.setState({
        isModalOpen: true,
        selectedInvoice: listInvoicesWillDisplay[index]
      });
    }

    handleChangeStatus() {
      const { selectedInvoice } = this.state;
      let status = selectedInvoice.status === 'pending' ? 'approved' : 'denied';

      Promise
        .resolve(this.props.changeStatusAction(selectedInvoice._id, status))
        .then(() => {
          alert('Status has been changed!');
          window.location.reload();
        })
    }

    render() {
      const { listInvoicesWillDisplay, isModalOpen, selectedInvoice } = this.state;

      var invoiceCounter = 0;

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
                  {selectedInvoice ?
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
                              <Card.Title as="h5">List of Invoices</Card.Title>
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
                                      <th style={{width: '20%'}}>ID</th>
                                      <th style={{width: '20%'}}>Email</th>
                                      <th style={{width: '15%'}}>Course</th>
                                      <th style={{width: '15%'}}>Total($)</th>
                                      <th style={{width: '15%'}}>Date</th>
                                      <th style={{width: '20%'}}>Status</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                    {listInvoicesWillDisplay.map((invoice, index) => {
                                      invoiceCounter++;
                                      return (
                                        <tr key={index.toString()}>
                                            <th scope="row">{invoiceCounter}</th>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'normal'}}>
                                              {invoice._id}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {invoice.user.email}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {invoice.course.name}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                              {invoice.totalPrice}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                             {moment(invoice.payDay).format('YYYY-MM-DD')}
                                            </td>
                                            <td>
                                              <Button size='sm' style={{width: '50%'}}
                                                      className={invoice.status === 'success' ? 'btn-success'
                                                                : invoice.status === 'canceled' ? 'btn-danger' : 'btn-warning'
                                                                  + " btn shadow-2"}
                                                      onClick={() => this.showModal(index)}
                                              >
                                                {invoice.status === 'success' ? 'Success' : invoice.status === 'canceled' ? 'Canceled' : 'Reported'}
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
    invoiceState: state.invoiceState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchallInvoicesAction: () => dispatch(fetchallInvoices())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InvoiceList));