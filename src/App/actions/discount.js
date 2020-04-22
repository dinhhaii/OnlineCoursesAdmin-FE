import fetch from 'cross-fetch';
import * as types from '../helpers/action-type';
import { SERVER_URL } from '../helpers/constant';

function requestAllDiscount() {
  return {
    type: types.FETCHING_ALL_DISCOUNT
  };
}

function receiveAllDiscountSuccess(allDiscount) {
  return {
    type: types.GET_ALL_DISCOUNT_SUCCESS,
    allDiscount
  };
}

function receiveAllDiscountFailed() {
  return {
    type: types.GET_ALL_DISCOUNT_FAILED
  };
}

// Get All Discount
export function fetchAllDiscount() {
  return function(dispatch) {
    dispatch(requestAllDiscount());
    return fetch(`${SERVER_URL}/discount`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          dispatch(receiveAllDiscountSuccess(data));
        }
        dispatch(receiveAllDiscountFailed());
      })
      .catch(() => {
        dispatch(receiveAllDiscountFailed());
      });
  };
}
