import fetch from 'cross-fetch';
import * as types from '../helpers/action-type';
import { SERVER_URL } from '../helpers/constant';

function requestLogin() {
  return {
    type: types.REQUEST_LOGIN
  };
}

function receiveLogin() {
  return {
    type: types.RECEIVE_LOGIN
  };
}

function getCurrentUser(user) {
  return {
    type: types.GET_CURRENT_USER,
    user
  };
}

function receiveLogout() {
  return {
    type: types.RECEIVE_LOGOUT
  };
}

function requestResetPassword() {
  return {
    type: types.REQUEST_RESET_PASSWORD
  };
}

function resetPasswordSuccess() {
  return {
    type: types.RESET_PASSWORD_SUCCESS
  };
}

function resetPasswordFailed() {
  return {
    type: types.RESET_PASSWORD_FAILED
  };
}

// Login
export function login(email, password) {
  return function(dispatch) {
    dispatch(requestLogin());
    return fetch(`${SERVER_URL}/user/login`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.user !== false) {
          localStorage.setItem('authToken', data.token);
          dispatch(getCurrentUser(data));
        }
        dispatch(receiveLogin(data));
      })
      .catch(() => {
        dispatch(receiveLogin(null));
      });
  };
}

// Authorization
export function authorizeUser() {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    return function(dispatch) {
      return fetch(`${SERVER_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
        .then(response => response.json() )
        .then(user => {
          dispatch(getCurrentUser(user));
        })
        .catch((error) => {
          dispatch(getCurrentUser(null));
        });
    };
  }
  return function(dispatch) {
    dispatch(getCurrentUser(null));
  };
}

// Forgot Password
export function forgotPassword(email) {
  return function(dispatch) {
    dispatch(requestResetPassword());
    return fetch(`${SERVER_URL}/user/forgotPassword`, {
      method: 'POST',
      body: JSON.stringify({
        email
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message !== null) {
          dispatch(resetPasswordSuccess());
        }
        else {
          dispatch(resetPasswordFailed());
        }
      })
      .catch(() => {
        dispatch(resetPasswordFailed());
      })
  }
}

// Logout
export function logout() {
  localStorage.removeItem('authToken');

  return function(dispatch) {
    dispatch(receiveLogout());
    dispatch(getCurrentUser(null));
  };
}
