/**
 * ************************************
 *
 * @module  index.js
 * @author
 * @date
 * @description simply a place to combine reducers
 *
 * ************************************
 */

// importing dependencies
import { combineReducers } from 'redux';

// import all reducers here
import pokemonReducer from './pokemonReducer';


// combine reducers
const reducers = combineReducers({
  // if we had other reducers, they would go here
  pokemon: pokemonReducer,
});

// make the combined reducers available for import
export default reducers;

