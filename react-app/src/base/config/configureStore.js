import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { default as thunk } from "redux-thunk";
import logger from 'redux-logger';
import rootReducer from './appReducer'
import initialState from './initialState';


const middleware =(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'buildprod' ) ? 
[ thunk ] : [ thunk,logger];

const enhancersDevToolExt = compose(
 window.devToolsExtension ? window.devToolsExtension(): f => f
);

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(...middleware),
  // Required! Enable Redux DevTools with the monitors you chose
  enhancersDevToolExt
  // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
  //persistState(getDebugSessionKey())
)

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    enhancer
  );
}