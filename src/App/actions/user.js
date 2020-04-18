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

function getUserById(user) {
  return {
    type: types.GET_USER_BY_ID,
    user
  }
}

function getAllUsers(allUsers) {
  return {
    type: types.GET_ALL_USERS,
    allUsers
  }
}

function getAllLearners(allLearners) {
  return {
    type: types.GET_ALL_LEARNERS,
    allLearners
  }
}

function getAllLecturers(allLecturers) {
  return {
    type: types.GET_ALL_LECTURERS,
    allLecturers
  }
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

function resetPasswordSuccess(resetPasswordToken) {
  return {
    type: types.RESET_PASSWORD_SUCCESS,
    resetPasswordToken
  };
}

function resetPasswordFailed() {
  return {
    type: types.RESET_PASSWORD_FAILED
  };
}

function changePasswordSuccess() {
  return {
    type: types.CHANGE_USER_PASSWORD_SUCCESS
  };
}

function changePasswordFailed() {
  return {
    type: types.CHANGE_USER_PASSWORD_SUCCESS
  };
}

function changeStatusSuccess() {
  return {
    type: types.CHANGE_USER_STATUS_SUCCESS
  };
}

function changeStatusFailed() {
  return {
    type: types.CHANGE_USER_STATUS_FAILED
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
    return fetch(`${SERVER_URL}/user/forgot-password`, {
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
          dispatch(resetPasswordSuccess(data.token));
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

// Get User By Id
// Get All Users
export function fetchUserById(_idUser) {
  return function(dispatch) {
    return fetch(`${SERVER_URL}/user/${_idUser}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data !== null) {
          dispatch(getUserById(data));
        }
        else {
          dispatch(getUserById(null));
        }
      })
      .catch(() => {
        dispatch(getUserById(null));
      })
  }
}


// Get All Users
export function fetchAllUsers() {
  return function(dispatch) {
    return fetch(`${SERVER_URL}/user`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data !== null) {
          dispatch(getAllUsers(data));
        }
        else {
          dispatch(getAllUsers(null));
        }
      })
      .catch(() => {
        dispatch(getAllUsers(null));
      })
  }
}

// Get All Learners
export function fetchAllLearners() {
  return function(dispatch) {
    return fetch(`${SERVER_URL}/user/all-learners`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data !== null) {
          dispatch(getAllLearners(data));
        }
        else {
          dispatch(getAllLearners(null));
        }
      })
      .catch(() => {
        dispatch(getAllLearners(null));
      })
  }
}

// Get All Users
export function fetchAllLecturers() {
  return function(dispatch) {
    return fetch(`${SERVER_URL}/user/all-lecturers`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data !== null) {
          dispatch(getAllLecturers(data));
        }
        else {
          dispatch(getAllLecturers(null));
        }
      })
      .catch(() => {
        dispatch(getAllLecturers(null));
      })
  }
}

// Change Password
export function changePassword(_idUser, password) {
  return function(dispatch) {
    return fetch(`${SERVER_URL}/user/update`, {
      method: 'POST',
      body: JSON.stringify({
        _idUser: _idUser,
        password: password,
        type: 'local'
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          dispatch(changePasswordSuccess());
        }
        else {
          dispatch(changePasswordFailed());
        }
      })
      .catch(() => {
        dispatch(changePasswordFailed());
      });
  }
}

// Change Status
export function changeStatus(_idUser, status) {
  return function(dispatch) {
    return fetch(`${SERVER_URL}/user/update`, {
      method: 'POST',
      body: JSON.stringify({
        _idUser: _idUser,
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


// Logout
export function logout() {
  if (localStorage.getItem('authToken')) {
    localStorage.removeItem('authToken');
  }

  return function(dispatch) {
    dispatch(receiveLogout());
  };
}
