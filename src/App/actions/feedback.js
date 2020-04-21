import fetch from 'cross-fetch';
import * as types from '../helpers/action-type';
import { SERVER_URL } from '../helpers/constant';

function requestAllFeedback() {
  return {
    type: types.FETCHING_ALL_FEEDBACK
  };
}

function receiveAllFeedbackSuccess(allFeedback) {
  return {
    type: types.GET_ALL_FEEDBACK_SUCCESS,
    allFeedback
  };
}

function receiveAllFeedbackFailed() {
  return {
    type: types.GET_ALL_FEEDBACK_FAILED
  };
}

// Get All Feedback
export function fetchAllFeedback() {
  return function(dispatch) {
    dispatch(requestAllFeedback());
    return fetch(`${SERVER_URL}/feedback`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          dispatch(receiveAllFeedbackSuccess(data));
        }
        dispatch(receiveAllFeedbackFailed());
      })
      .catch(() => {
        dispatch(receiveAllFeedbackFailed());
      });
  };
}
