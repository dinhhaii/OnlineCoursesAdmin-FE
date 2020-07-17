import fetch from 'cross-fetch';
import * as types from '../helpers/action-type';
import { SERVER_URL } from '../helpers/constant';

function requestAllSurveys() {
  return {
    type: types.FETCHING_ALL_SURVEYS
  };
}

function receiveAllSurveysSuccess(allSurveys) {
  return {
    type: types.GET_ALL_SURVEYS_SUCCESS,
    allSurveys
  };
}

function receiveAllSurveysFailed() {
  return {
    type: types.GET_ALL_SURVEYS_FAILED
  };
}

// Get All Discount
export function fetchAllSurveys() {
  return function(dispatch) {
    dispatch(requestAllSurveys());
    return fetch(`${SERVER_URL}/survey`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          dispatch(receiveAllSurveysSuccess(data));
        }
        dispatch(receiveAllSurveysFailed());
      })
      .catch(() => {
        dispatch(receiveAllSurveysFailed());
      });
  };
}
