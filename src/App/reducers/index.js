import { combineReducers } from 'redux';
import userState from './user';
import reducer from './reducer';

// const allReducers = Object.assign(userState, reducer);

const myReducer = combineReducers({
  userState,
  reducer
})

export default myReducer;
