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
      selectedDiscount: null,
      currentPage: 1,
      discountPerPage: 5
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleStatusFilder = this.handleStatusFilter.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
  }

    componentWillMount() {
      Promise
        .resolve(this.props.fetchAllDiscountAction())
        .then(() => {
          $('#loader').hide();
          this.setState({
            listDiscountWillDisplay: this.props.discountState.allDiscount
          });
        });
    }

    handleSearch(e) {
      let value = e.target.value;
      let { allDiscount } = this.props.discountState;
      var filter = allDiscount.filter(discount => discount.code.toLowerCase().indexOf(value.toLowerCase()) !== -1)

      this.setState({
        listDiscountWillDisplay: filter
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
      $('#searchBox').val('');

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
      const { listDiscountWillDisplay,
              isModalOpen,
              selectedDiscount,
              currentPage,
              discountPerPage} = this.state;

      // Logic for displaying current todos
      const indexOfLastDiscount = currentPage * discountPerPage;
      const indexOfFirstDiscount = indexOfLastDiscount - discountPerPage;
      const currentDiscount = listDiscountWillDisplay.slice(indexOfFirstDiscount, indexOfLastDiscount);

      // Logic for displaying page numbers
      const pageNumbers = [];
      const lastPage = Math.ceil(listDiscountWillDisplay.length / discountPerPage);
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

      var discountCounter = indexOfFirstDiscount;

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

                          <input id='searchBox' name='searchBox'
                                  type="text"
                                  placeholder="Search by code..."
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



                              <Table striped responsive style={{tableLayout: 'fixed'}}>
                                  <thead>
                                  <tr>
                                      <th style={{width: '5%'}}>#</th>
                                      <th style={{width: '15%'}}>Code</th>
                                      <th style={{width: '25%'}}>Course</th>
                                      <th style={{width: '15%'}}>Percentage</th>
                                      <th style={{width: '20%'}}>Status</th>
                                  </tr>

                                  <span id='loader'
                                        className='spinner-border align-self-center mb-5 mt-5'
                                        role='status'
                                        style={{marginLeft: '750%'}}/>


                                  </thead>
                                  <tbody>
                                    {currentDiscount.map((discount, index) => {
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
                                             {discount.percentage + '%'}
                                            </td>
                                            <td>
                                              <Button size='sm' style={{width: '50%'}}
                                                      className={discount.status === 'available' ? 'btn-success'
                                                                : discount.status === 'coupon' ? 'btn-info' : 'btn-danger'
                                                                  + " btn shadow-2"}
                                                      onClick={() => this.showModal(index)}
                                              >
                                                {discount.status === 'available' ? 'Available' : discount.status === 'coupon' ? 'Coupon' : 'Expired'}
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
