/* eslint-disable no-case-declarations */
/**
 * ************************************
 *
 * @module  userFunctionsReducer
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
  username: null,
  savedTeams: {
    team_1: null,
    team_2: null,
    team_3: null, 
    team_4: null,
    team_5: null, 
    team_6: null, 
    team_7: null, 
    team_8: null, 
  }
}

const userFunctionsReducer = (state = initialState, action) => {

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

      // case types.LOAD_SAVED_TEAMS: 
      // console.log('LOAD_SAVED_TEAMS ', action)
      //   const newSavedTeams = ''
      //   return {
      //     ...state,
      //     savedTeams: newSavedTeams
      //   }
      case types.SAVE_CURRENT_TEAM:
        console.log('inside SAVE_CURRENT_TEAM ', action)

        let newSavedTeams = {...state.savedTeams}
        for (let i=1; i<=100; i++) {
          let key = 'team_' + i; 
          if (!newSavedTeams[key]) {
            newSavedTeams[key] = action.payload.team;
            break;
          }
        }
        console.log(newSavedTeams)

        return {
          ...state,
          savedTeams: newSavedTeams
        }


    default: {
      return state
    }
  }
}

export default userFunctionsReducer;