import * as types from '../helpers/action-type';

const initialState = {
  isFetching: false,
  allFeedback: [],
};

const feedbackState = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCHING_ALL_FEEDBACK:
      return { ...state, isFetching: true }
    case types.GET_ALL_FEEDBACK_FAILED:
      return { ...state, isFetching: false }
    case types.GET_ALL_FEEDBACK_SUCCESS:
      return { ...state, isFetching: false, allFeedback: action.allFeedback }


    default:
      return state;
  }
};

export default feedbackState;
