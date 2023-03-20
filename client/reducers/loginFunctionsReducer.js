/* eslint-disable no-case-declarations */
/**
 * ************************************
 *
 * @module  loginFunctionsReducer
 * @author
 * @date
 * @description reducer for pokemon data 
 *
 * ************************************
 */

// importing action types
import * as types from '../constants/actionTypes'; 


const initialState = {
  mainDivClassName: 'main',
  isLoggedIn: false, 
  username: null
}

const loginFunctionsReducer = (state = initialState, action) => {

  switch (action.type) {
   
    case types.TOGGLE_MAIN_DIV_STATE:
      console.log('inside toggle_main_div_state reducer ', action)
      let newmainDivClassName; 
      if (action.payload.string==='main') newmainDivClassName = 'main inactive';
      else newmainDivClassName = 'main';

      return {
         ...state,
        mainDivClassName: newmainDivClassName
      }

      case types.CHANGE_USER_STATE: 
      console.log('inside CHANGE_USER_STATE ', action)

        return {
          ...state,
          isLoggedIn: true,
          username: action.payload.username
        }

    default: {
      return state
    }
  }
}

export default loginFunctionsReducer;