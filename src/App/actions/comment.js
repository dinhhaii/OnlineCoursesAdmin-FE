import fetch from 'cross-fetch';
import * as types from '../helpers/action-type';
import { SERVER_URL } from '../helpers/constant';

function requestAllComments() {
  return {
    type: types.FETCHING_ALL_COMMENTS
  };
}

function receiveAllCommentsSuccess(allComments) {
  return {
    type: types.GET_ALL_COMMENTS_SUCCESS,
    allComments
  };
}

function receiveAllCommentsFailed() {
  return {
    type: types.GET_ALL_COMMENTS_FAILED
  };
}

// Get All Comments
export function fetchAllComments() {
  return function(dispatch) {
    dispatch(requestAllComments());
    return fetch(`${SERVER_URL}/comment`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          dispatch(receiveAllCommentsSuccess(data));
        }
        dispatch(receiveAllCommentsFailed());
      })
      .catch(() => {
        dispatch(receiveAllCommentsFailed());
      });
  };
}
