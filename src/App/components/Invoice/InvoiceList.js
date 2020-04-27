import React from 'react';
import {Row, Col, Card, Table, Button, Pagination, DropdownButton, Dropdown, Modal, Collapse} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';


import Aux from "../../../hoc/_Aux";
import { fetchAllInvoices } from './../../actions/invoice';

const moment = require('moment');

class InvoiceList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      listInvoicesWillDisplay: [],
      isModalOpen: false,
      isCollapsed: false,
      selectedInvoice: null,
      currentPage: 1,
      invoicesPerPage: 5
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleStatusFilder = this.handleStatusFilter.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      Promise
        .resolve(this.props.fetchAllInvoicesAction())
        .then(() => {
          $('#loader').hide();
          this.setState({
            listInvoicesWillDisplay: this.props.invoiceState.allInvoices
          });
        });
    }

    handleSearch(e) {
      let value = e.target.value;
      let { allInvoices } = this.props.invoiceState;
      var filter = allInvoices.filter(invoice => invoice.course.name.toLowerCase().indexOf(value.toLowerCase()) !== -1)

      this.setState({
        listInvoicesWillDisplay: filter
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
      $('#searchBox').val('');

      const { allInvoices } = this.props.invoiceState;

      this.setState({
        listInvoicesWillDisplay: allInvoices
      });
    }

    hideModal() {
      this.setState({
        isModalOpen: false,
        isCollapsed: false
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
      const { listInvoicesWillDisplay,
              isModalOpen,
              selectedInvoice,
              isCollapsed,
              currentPage,
              invoicesPerPage } = this.state;

      // Logic for displaying current todos
      const indexOfLastInvoice = currentPage * invoicesPerPage;
      const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
      const currentInvoices = listInvoicesWillDisplay.slice(indexOfFirstInvoice, indexOfLastInvoice);

      // Logic for displaying page numbers
      const pageNumbers = [];
      const lastPage = Math.ceil(listInvoicesWillDisplay.length / invoicesPerPage);
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

      var invoiceCounter = indexOfFirstInvoice;

      return (
          <Aux>
              <Row>
                  <Col>

                  {/*-----------MODAL------------*/}
                  {selectedInvoice ?
                      <Modal
                         size="xl"
                         aria-labelledby="contained-modal-title-vcenter"
                         centered
                         show={isModalOpen}
                       >
                         <Modal.Header>
                           <Modal.Title id="change-user-status">
                             <h3><b>Invoice detail</b></h3>
                           </Modal.Title>
                         </Modal.Header>
                         <Modal.Body>
                          <Row>
                            <Col md='6'>
                             <h5 style={{whiteSpace: 'normal'}}>
                               <Table responsive style={{tableLayout: 'fixed', borderBottom: 'none', color: 'black'}}>
                                   <tbody>
                                   <tr>
                                     <td style={{width: '30%', whiteSpace: 'normal'}}
                                     >
                                       <b>User: </b>
                                     </td>
                                     <td style={{whiteSpace: 'normal'}}
                                     >{selectedInvoice.user.firstName + ' ' + selectedInvoice.user.lastName
                                     + ' (' + selectedInvoice.user.email + ')'}</td>
                                   </tr>
                                   <tr>
                                     <td style={{width: '30%', whiteSpace: 'normal'}}
                                   >
                                     <b>Course: </b>
                                   </td>
                                     <td style={{whiteSpace: 'normal'}}
                                     >{selectedInvoice.course.name}</td>
                                   </tr>
                                   <tr>
                                     <td style={{width: '30%', whiteSpace: 'normal'}}
                                     >
                                       <b>Coupon: </b>
                                     </td>
                                     <td style={{whiteSpace: 'normal'}}
                                     >{selectedInvoice.discount.code + ' - '
                                     + selectedInvoice.discount.percentage + '%'}</td>
                                   </tr>
                                   </tbody>
                               </Table>
                             </h5>
                            </Col>

                            <Col md='6'>
                              <h5 style={{whiteSpace: 'normal'}}>
                                <Table responsive style={{tableLayout: 'fixed', borderBottom: 'none', color: 'black'}}>
                                    <tbody>
                                    <tr>
                                      <td style={{width: '30%', whiteSpace: 'normal'}}
                                      >
                                        <b>Total price: </b>
                                      </td>
                                      <td style={{whiteSpace: 'normal'}}
                                      >{'$' + selectedInvoice.totalPrice}</td>
                                    </tr>
                                    <tr>
                                      <td style={{width: '30%', whiteSpace: 'normal'}}
                                    >
                                      <b>Pay day: </b>
                                    </td>
                                      <td style={{whiteSpace: 'normal'}}
                                      >{moment(selectedInvoice.payDay).format('YYYY-MM-DD')}</td>
                                    </tr>
                                    <tr>
                                      <td style={{width: '30%', whiteSpace: 'normal'}}
                                      >
                                        <b>Status: </b>
                                      </td>
                                      <td style={{whiteSpace: 'normal'}}
                                      >
                                        <Button  onClick={() => {if (selectedInvoice.status === 'reported') {this.setState({ isCollapsed: !isCollapsed })}}}
                                                 size='sm' style={{width: '30%'}}
                                                 className={selectedInvoice.status === 'success' ? 'btn-success'
                                                          : selectedInvoice.status === 'canceled' ? 'btn-danger' : 'btn-warning'}
                                        >
                                         {selectedInvoice.status === 'success' ? 'Success' : selectedInvoice.status === 'canceled' ? 'Canceled' : 'Reported'}
                                       </Button>
                                        <Collapse in={this.state.isCollapsed}>
                                            <div id="basic-collapse">
                                                <Card.Body>
                                                    <Card.Text>
                                                    <b>Report message: </b>{selectedInvoice.reportMsg}
                                                    </Card.Text>
                                                </Card.Body>
                                            </div>
                                        </Collapse>
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
                             <Button className='btn shadow-2' variant="danger" onClick={() => this.hideModal()}>Close</Button>
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


                          <input id='searchBox' name='searchBox'
                                  type="text"
                                  placeholder="Search by course..."
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
                                      <th style={{width: '20%'}}>Course</th>
                                      <th style={{width: '15%'}}>Total($)</th>
                                      <th style={{width: '15%'}}>Date</th>
                                      <th style={{width: '20%'}}>Status</th>
                                  </tr>

                                  <span id='loader'
                                        className='spinner-border align-self-center mb-5 mt-5'
                                        role='status'
                                        style={{marginLeft: '750%'}}/>


                                  </thead>
                                  <tbody>
                                    {currentInvoices.map((invoice, index) => {
                                      invoiceCounter++;
                                      return (
                                        <tr key={index.toString()}
                                            onClick={() => this.showModal(index)}
                                        >
                                            <th scope="row">{invoiceCounter}</th>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'middle'}}>
                                              {invoice.user.email}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'middle'}}>
                                              {invoice.course.name}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'middle'}}>
                                              {invoice.totalPrice}
                                            </td>
                                            <td style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'middle'}}>
                                             {moment(invoice.payDay).format('YYYY-MM-DD')}
                                            </td>
                                            <td>
                                              <Button size='sm' style={{width: '50%', verticalAlign: 'middle'}}
                                                      className={invoice.status === 'success' ? 'btn-success'
                                                                : invoice.status === 'canceled' ? 'btn-danger' : 'btn-warning'
                                                                  + " btn shadow-2"}
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
    invoiceState: state.invoiceState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllInvoicesAction: () => dispatch(fetchAllInvoices())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InvoiceList));
