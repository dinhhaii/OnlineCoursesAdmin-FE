import * as types from '../helpers/action-type';

const initialState = {
  isFetching: false,
  allCourses: [],
  pendingCourses: []
};

const courseState = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCHING_ALL_COURSES:
      return { ...state, isFetching: true }
    case types.GET_ALL_COURSES_FAILED:
      return { ...state, isFetching: false }
    case types.GET_ALL_COURSES_SUCCESS:
      return { ...state, isFetching: false, allCourses: action.allCourses }

    case types.GET_PENDING_COURSES_FAILED:
      return { ...state, isFetching: false }
    case types.GET_PENDING_COURSES_SUCCESS:
      return { ...state, isFetching: false, pendingCourses: action.pendingCourses }

    case types.CHANGE_COURSE_STATUS_SUCCESS:
      return state;
    case types.CHANGE_COURSE_STATUS_FAILED:
      return state;


    default:
      return state;
  }
};

export default courseState;
