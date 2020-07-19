import fetch from 'cross-fetch';
import * as types from '../helpers/action-type';
import { SERVER_URL } from '../helpers/constant';

function requestAllCourses() {
  return {
    type: types.FETCHING_ALL_COURSES
  };
}

function receiveAllCoursesSuccess(allCourses) {
  return {
    type: types.GET_ALL_COURSES_SUCCESS,
    allCourses
  };
}

function receiveAllCoursesFailed() {
  return {
    type: types.GET_ALL_COURSES_FAILED
  };
}

function receivePendingCoursesSuccess(pendingCourses) {
  return {
    type: types.GET_PENDING_COURSES_SUCCESS,
    pendingCourses
  };
}

function receivePendingCoursesFailed() {
  return {
    type: types.GET_PENDING_COURSES_FAILED
  };
}

function changeStatusSuccess() {
  return {
    type: types.CHANGE_COURSE_STATUS_SUCCESS
  };
}

function changeStatusFailed() {
  return {
    type: types.CHANGE_COURSE_STATUS_FAILED
  };
}


// Get All Courses
export function fetchAllCourses() {
  return function(dispatch) {
    dispatch(requestAllCourses());
    return fetch(`${SERVER_URL}/course`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          dispatch(receiveAllCoursesSuccess(data));
        }
        dispatch(receiveAllCoursesFailed());
      })
      .catch(() => {
        dispatch(receiveAllCoursesFailed());
      });
  };
}

// Get All Courses
export function fetchPendingCourses() {
  return function(dispatch) {
    return fetch(`${SERVER_URL}/course/pending`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          dispatch(receivePendingCoursesSuccess(data));
        }
        dispatch(receivePendingCoursesFailed());
      })
      .catch(() => {
        dispatch(receivePendingCoursesFailed());
      });
  };
}

// Change Status Course
export function changeStatus(_idCourse, status) {
  return function(dispatch) {
    return fetch(`${SERVER_URL}/course/update`, {
      method: 'POST',
      body: JSON.stringify({
        _idCourse: _idCourse,
        status: status
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          dispatch(changeStatusSuccess());
        }
        else {
          dispatch(changeStatusFailed());
        }
      })
      .catch(() => {
        dispatch(changeStatusSuccess());
      });
  }
}
