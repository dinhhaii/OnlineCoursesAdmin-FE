import * as types from '../helpers/action-type';

const initialState = {
  isFetching: false,
  allSurveys: [],
};

const surveyState = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCHING_ALL_SURVEYS:
      return { ...state, isFetching: true }
    case types.GET_ALL_SURVEYS_FAILED:
      return { ...state, isFetching: false }
    case types.GET_ALL_SURVEYS_SUCCESS:
      return { ...state, isFetching: false, allSurveys: action.allSurveys }


    default:
      return state;
  }
};

export default surveyState;
