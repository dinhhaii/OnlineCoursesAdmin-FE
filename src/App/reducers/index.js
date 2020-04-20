import { combineReducers } from 'redux';
import userState from './user';
import courseState from './course';
import invoiceState from './invoice';
import reducer from './reducer';

// const allReducers = Object.assign(userState, reducer);

const myReducer = combineReducers({
  userState,
  courseState,
  invoiceState,
  reducer
})

export default myReducer;
