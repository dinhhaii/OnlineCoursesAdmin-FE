import { combineReducers } from 'redux';
import userState from './user';
import courseState from './course';
import lessonState from './lesson';
import invoiceState from './invoice';
import feedbackState from './feedback';
import commentState from './comment';
import discountState from './discount';
import reducer from './reducer';

// const allReducers = Object.assign(userState, reducer);

const myReducer = combineReducers({
  userState,
  courseState,
  lessonState,
  feedbackState,
  commentState,
  discountState,
  invoiceState,
  reducer
})

export default myReducer;
