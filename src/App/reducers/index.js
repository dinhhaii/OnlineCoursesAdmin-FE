import { combineReducers } from 'redux';
import userState from './user';
import courseState from './course';
import reducer from './reducer';

// const allReducers = Object.assign(userState, reducer);

const myReducer = combineReducers({
  userState,
  courseState,
  reducer
})

export default myReducer;
