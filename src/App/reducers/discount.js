import * as types from '../helpers/action-type';

const initialState = {
  isFetching: false,
  allDiscount: [],
};

const discountState = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCHING_ALL_DISCOUNT:
      return { ...state, isFetching: true }
    case types.GET_ALL_DISCOUNT_FAILED:
      return { ...state, isFetching: false }
    case types.GET_ALL_DISCOUNT_SUCCESS:
      return { ...state, isFetching: false, allDiscount: action.allDiscount }


    default:
      return state;
  }
};

export default discountState;
