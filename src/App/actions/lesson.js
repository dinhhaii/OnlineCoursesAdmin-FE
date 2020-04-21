import fetch from 'cross-fetch';
import * as types from '../helpers/action-type';
import { SERVER_URL } from '../helpers/constant';

function requestAllLessons() {
  return {
    type: types.FETCHING_ALL_LESSONS
  };
}

function receiveAllLessonsSuccess(allLessons) {
  return {
    type: types.GET_ALL_LESSONS_SUCCESS,
    allLessons
  };
}

function receiveAllLessonsFailed() {
  return {
    type: types.GET_ALL_LESSONS_FAILED
  };
}

// Get All Lessons
export function fetchAllLessons() {
  return function(dispatch) {
    dispatch(requestAllLessons());
    return fetch(`${SERVER_URL}/lesson`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          dispatch(receiveAllLessonsSuccess(data));
        }
        dispatch(receiveAllLessonsFailed());
      })
      .catch(() => {
        dispatch(receiveAllLessonsFailed());
      });
  };
}
