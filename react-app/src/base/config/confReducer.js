import * as types from '../constants/ActionTypes';
import initialState from './initialState';

export default function confReducer(state = initialState.appconf,action) {
  switch(action.type) {
    case types.LOAD_APPCONF_SUCCESS:
    return Object.assign({}, ...state, action.appconf)  
    default: 
      return state;
  }
}