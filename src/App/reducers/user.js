import * as types from '../helpers/action-type';

const initialState = {
  isFetching: false,
  user: null,
  didInvalidate: false,
  isLogin: false
};

const userState = (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_LOGIN:
      return { ...state, isFetching: true };
    case types.RECEIVE_LOGIN:
      return { ...state, isFetching: false };

    case types.GET_CURRENT_USER:
      return { ...state, isFetching: false, isLogin: true, user: action.user };

    case types.RECEIVE_LOGOUT:
      return { ...state, isLogin: false };;

    default:
      return state;
  }
};

export default userState;
