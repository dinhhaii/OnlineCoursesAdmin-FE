import * as types from '../helpers/action-type';

const initialState = {
  isFetching: false,
  allUsers: [],
  allLearners: [],
  allLecturers: [],
  user: null,
  fetchedUser: null,
  isLogin: false,
  isSendingEmail: false,
  isPasswordReset: false
};

const userState = (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_LOGIN:
      return { ...state, isFetching: true };
    case types.RECEIVE_LOGIN:
      return { ...state, isFetching: false };

    case types.GET_CURRENT_USER:
      return { ...state, isFetching: false, isLogin: true, user: action.user };
    case types.GET_USER_BY_ID:
      return { ...state, fetchedUser: action.user };
    case types.GET_ALL_USERS:
      const adminfilter = action.allUsers.filter(user => user.role !== 'admin');
      return { ...state, allUsers: adminfilter };
    case types.GET_ALL_LEARNERS:
      return { ...state, allLearners: action.allLearners };
    case types.GET_ALL_LECTURERS:
      return { ...state, allLecturers: action.allLecturers };

    case types.RECEIVE_LOGOUT:
      return { ...state, isLogin: false, user: null };

    case types.REQUEST_RESET_PASSWORD:
      return { ...state, isSendingEmail: true, isPasswordReset: false };
    case types.RESET_PASSWORD_FAILED:
      return { ...state, isSendingEmail: false, isPasswordReset: false };
    case types.RESET_PASSWORD_SUCCESS:
      return { ...state, isSendingEmail: false, isPasswordReset: true};
    case types.CHANGE_USER_PASSWORD_SUCCESS:
      return { ...state, isPasswordReset: true };
    case types.CHANGE_USER_PASSWORD_FAILED:
      return { ...state, isPasswordReset: false };

    case types.CHANGE_USER_STATUS_SUCCESS:
      return state;
    case types.CHANGE_USER_STATUS_FAILED:
      return state;

    default:
      return state;
  }
};

export default userState;
