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
      const token = localStorage.getItem('authToken');
      if (!token) {
        const { history } = this.props;
        history.push('/auth/signin');
      }

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
      const status = $('#statusFilter').text();

      let { allDiscount } = this.props.discountState;
      var filter = allDiscount.filter(discount => discount.code.toLowerCase().indexOf(value.toLowerCase()) !== -1);

      if (status !== 'Status') {
        filter = filter.filter(discount => discount.status === status.toLowerCase());
      }

      this.setState({
        listDiscountWillDisplay: filter
      });
    }

    handleStatusFilter(status) {

      $('#statusFilter').text(`${status === 'available' ? 'Available' : status === 'expired' ? 'Expired' : 'Coupon'}`);

      const search = $('#searchBox').val();

      let { allDiscount } = this.props.discountState;

      var filter = allDiscount.filter(discount => discount.status === status);

      if (search !== '') {
        filter = filter.filter(discount => discount.code.toLowerCase().indexOf(search.toLowerCase()) !== -1);
      }

      this.setState({
        listDiscountWillDisplay: filter
      });
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
      const { listDiscountWillDisplay, currentPage, discountPerPage } = this.state;

      index = (currentPage - 1) * discountPerPage + (index);

      this.setState({
        isModalOpen: true,
        selectedDiscount: listDiscountWillDisplay[index]
      });
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
                         size="xl"
                         aria-labelledby="contained-modal-title-vcenter"
                         centered
                         show={isModalOpen}
                       >
                         <Modal.Header>
                           <Modal.Title id="change-user-status">
                             <h3>
                               <b> Coupon detail
                               </b>
                             </h3>
                           </Modal.Title>
                         </Modal.Header>
                         <Modal.Body>
                           <Row>
                           <Col  md='4'
                                 className='d-flex justify-content-center'
                           >
                             <h5 style={{whiteSpace: 'normal'}}>
                              <b>COUPON</b>
                              <Table responsive style={{tableLayout: 'fixed', borderBottom: 'none', color: 'black'}}>
                                  <tbody>
                                  <tr>
                                    <td style={{width: '30%', whiteSpace: 'normal'}}
                                    >
                                      <b>Code: </b>
                                    </td>
                                    <td style={{whiteSpace: 'normal'}}
                                    >{selectedDiscount.code}</td>
                                  </tr>
                                  <tr>
                                    <td style={{width: '30%', whiteSpace: 'normal'}}
                                  >
                                    <b>Percentage: </b>
                                  </td>
                                    <td style={{whiteSpace: 'normal'}}
                                    >{selectedDiscount.percentage + '%'}</td>
                                  </tr>
                                  <tr>
                                    <td style={{width: '30%', whiteSpace: 'normal'}}
                                    >
                                      <b>Status: </b>
                                    </td>
                                    <td style={{whiteSpace: 'normal'}}
                                    >
                                      <Button size='sm' style={{width: '40%'}}
                                              className={selectedDiscount.status === 'available' ? 'btn-success'
                                                        : selectedDiscount.status === 'coupon' ? 'btn-info' : 'btn-danger'
                                                          + " btn shadow-2"}
                                      >
                                        {selectedDiscount.status === 'available' ? 'Available' : selectedDiscount.status === 'coupon' ? 'Coupon' : 'Expired'}
                                      </Button>
                                    </td>
                                  </tr>
                                  </tbody>
                              </Table>
                             </h5>

                           </Col>

                          <Col md='8'>
                            <h5 style={{whiteSpace: 'normal'}}>

                             <b>COURSE</b>
                             <Table responsive style={{tableLayout: 'fixed', borderBottom: 'none', color: 'black'}}>
                                 <tbody>
                                 <tr>
                                   <td style={{width: '20%', whiteSpace: 'normal'}}
                                   >
                                     <b>Image: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >
                                     <img  alt="Avatar"
                                           src={selectedDiscount.course.imageURL}
                                           style={{width: '100px', height: '100px', borderRadius: '50%'}}/>
                                   </td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '20%', whiteSpace: 'normal'}}
                                   >
                                     <b>Name: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{selectedDiscount.course.name}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '20%', whiteSpace: 'normal'}}
                                   >
                                     <b>Duration: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{selectedDiscount.course.duration}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '20%', whiteSpace: 'normal'}}
                                   >
                                     <b>Accessible Days: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{selectedDiscount.course.accessibleDays}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '20%', whiteSpace: 'normal'}}
                                   >
                                     <b>Price: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{'$' + selectedDiscount.course.price}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '20%', whiteSpace: 'normal'}}
                                   >
                                     <b>Description: </b>
                                   </td>
                                   <td style={{whiteSpace: 'normal'}}
                                   >{selectedDiscount.course.description}</td>
                                 </tr>
                                 <tr>
                                   <td style={{width: '20%', whiteSpace: 'normal'}}
                                   >
                                     <b>Status: </b>
                                   </td>
                                   <td>
                                     <Button size='sm' style={{width: '20%'}}
                                             className={selectedDiscount.course.status === 'approved' ? 'btn-success'
                                                       : selectedDiscount.course.status === 'denied' ? 'btn-danger' : 'btn-warning'}
                                     >
                                       {selectedDiscount.course.status === 'approved' ? 'Approved' : selectedDiscount.course.status === 'denied' ? 'Denied' : 'Pending'}
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
                               Note: Update coupon status action is unavailable at the moment.
                             </p>
                             <Button className='btn shadow-2' variant="secondary" onClick={() => this.hideModal()}>Close</Button>
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
                                  <Dropdown.Item eventKey="success" onClick={() => this.handleStatusFilter('available')}>
                                    Available
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="canceled" onClick={() => this.handleStatusFilter('coupon')}>
                                    Coupon
                                  </Dropdown.Item>
                                  <Dropdown.Item eventKey="reported" onClick={() => this.handleStatusFilter('expired')}>
                                    Expired
                                  </Dropdown.Item>
                              </DropdownButton>

                              <Button className="btn btn-danger" onClick={() => this.handleResetFilter()}>Reset Filters</Button>



                              <Table hover responsive style={{tableLayout: 'fixed'}}>
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
                                        <tr key={index.toString()}
                                            onClick={() => this.showModal(index)}
                                        >
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
