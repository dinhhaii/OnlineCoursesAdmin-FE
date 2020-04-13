import { combineReducers } from 'redux';
import * as userState from './user';
import * as reducer from './reducer';

const allReducers = Object.assign(userState, reducer);

const myReducer = combineReducers(allReducers);

export default myReducer;
