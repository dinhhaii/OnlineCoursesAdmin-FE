import * as types from '../helpers/action-type';

const initialState = {
  isFetching: false,
  allLessons: [],
};

const lessonState = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCHING_ALL_LESSONS:
      return { ...state, isFetching: true }
    case types.GET_ALL_LESSONS_FAILED:
      return { ...state, isFetching: false }
    case types.GET_ALL_LESSONS_SUCCESS:
      return { ...state, isFetching: false, allLessons: action.allLessons }


    default:
      return state;
  }
};

export default lessonState;
