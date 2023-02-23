/**
 * ************************************
 *
 * @module  store.js
 * @author zi
 * @date
 * @description Redux 'single source of truth'
 *
 * ************************************
 */


// importing dependencies 
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

// importing reducers 
import reducers from './reducers/index'

const store = createStore(
  reducers,
  composeWithDevTools()
);

export default store;

