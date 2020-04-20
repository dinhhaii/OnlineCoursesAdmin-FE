import * as types from '../helpers/action-type';

const initialState = {
  isFetching: false,
  allInvoices: [],
};

const invoiceState = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCHING_ALL_INVOICES:
      return { ...state, isFetching: true }
    case types.GET_ALL_INVOICES_FAILED:
      return { ...state, isFetching: false }
    case types.GET_ALL_INVOICES_SUCCESS:
      return { ...state, isFetching: false, allInvoices: action.allInvoices }


    default:
      return state;
  }
};

export default invoiceState;
