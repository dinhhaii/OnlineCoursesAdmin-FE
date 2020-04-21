import * as types from '../helpers/action-type';

const initialState = {
  isFetching: false,
  allComments: [],
};

const commentState = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCHING_ALL_COMMENTS:
      return { ...state, isFetching: true }
    case types.GET_ALL_COMMENTS_FAILED:
      return { ...state, isFetching: false }
    case types.GET_ALL_COMMENTS_SUCCESS:
      return { ...state, isFetching: false, allComments: action.allComments }


    default:
      return state;
  }
};

export default commentState;
