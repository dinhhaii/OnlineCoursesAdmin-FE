import fetch from 'cross-fetch';
import * as types from '../helpers/action-type';
import { SERVER_URL } from '../helpers/constant';

function requestallInvoices() {
  return {
    type: types.FETCHING_ALL_INVOICES
  };
}

function receiveAllInvoicesSuccess(allInvoices) {
  return {
    type: types.GET_ALL_INVOICES_SUCCESS,
    allInvoices
  };
}

function receiveAllInvoicesFailed() {
  return {
    type: types.GET_ALL_INVOICES_FAILED
  };
}


// Get All Invoices
export function fetchallInvoices() {
  return function(dispatch) {
    dispatch(requestallInvoices());
    return fetch(`${SERVER_URL}/invoice`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          dispatch(receiveAllInvoicesSuccess(data));
        }
        dispatch(receiveAllInvoicesFailed());
      })
      .catch(() => {
        dispatch(receiveAllInvoicesFailed());
      });
  };
}
