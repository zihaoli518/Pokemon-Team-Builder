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

import helpers from './helpers.js'



const initialState = {
  mainDivClassName: 'main',
  isLoggedIn: false,
  loginLoading: false,
  username: null,
  savedTeams: {
    team_1: null,
  },
  saveToDatabase: false,
}

const userFunctionsReducer = (state = initialState, action) => {
  // console.log('inside user reducer, action: ', action)

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
      let SavedTeamFromDatabase = {
        team_1: null,
      }
      if (action.payload.responseObj) SavedTeamFromDatabase = action.payload.responseObj;
      console.log(SavedTeamFromDatabase)
      return {
        ...state,
        isLoggedIn: true,
        username: action.payload.username,
        savedTeams: SavedTeamFromDatabase
      }

      // case types.LOAD_SAVED_TEAMS: 
      // console.log('LOAD_SAVED_TEAMS ', action)
      //   const newSavedTeams = ''
      //   return {
      //     ...state,
      //     savedTeams: newSavedTeams
      //   }
      case types.SAVE_CURRENT_TEAM_AS_NEW:
        console.log('inside SAVE_CURRENT_TEAM ', action.payload)
        let newSavedTeams = {...state.savedTeams}
        console.log('saved teams before: ', newSavedTeams)
        if (newSavedTeams.team_1) console.log(newSavedTeams.team_1.name)

        // for adding first team 
        if (state.savedTeams.team_1===null) {
          newSavedTeams.team_1 = action.payload.team.team;
          newSavedTeams.team_1['name'] = action.payload.team.name;
          newSavedTeams.team_1['key'] = 'team_1';
          return {
            ...state,
            savedTeams: newSavedTeams
          }
        }
        let duplicate = false; 
        let duplicateName = '';

        for (let i=1; i<=Object.keys(state.savedTeams).length+1; i++) {
          let key = 'team_' + i; 
          console.log(key, newSavedTeams[key], action.payload.team.name, )
          if (newSavedTeams[key]) newSavedTeams[key]['key'] = key;
          if (newSavedTeams[key] && newSavedTeams[key].name === action.payload.team.name && typeof(action.payload.team.name[action.payload.team.name.length-1]) !== 'number') {
            console.log('duplicate 1')
            duplicate = true;
            duplicateName = action.payload.team.name + '-2';
          }
          if (newSavedTeams[key] && Number(newSavedTeams[key].name[newSavedTeams[key].name.length-1])>1 && action.payload.team.name === newSavedTeams[key].name.slice(0, newSavedTeams[key].name.length-2)){
            console.log('duplicate 2')
            duplicate = true;
            let prevNum = Number(newSavedTeams[key].name[newSavedTeams[key].name.length-1]);
            prevNum++;
            duplicateName = newSavedTeams[key].name.slice(0, newSavedTeams[key].name.length-1) + prevNum;
          }
          if (!newSavedTeams.hasOwnProperty(key)) {
            newSavedTeams[key] = action.payload.team.team;
            newSavedTeams[key].key = key
          }
          if (duplicate && i===Object.keys(state.savedTeams).length+1) newSavedTeams[key].name = duplicateName;

          if (state.savedTeams.team_1===null) break;
        }

        return {
          ...state,
          savedTeams: newSavedTeams
        }
      
      case types.REMOVE_SAVED_TEAM: 
        console.log('inside REMOVE_SAVED_TEAM ')
        let beforeRemovingTeam = {...state.savedTeams};
        delete beforeRemovingTeam[action.payload.key];
        console.log(beforeRemovingTeam)
        beforeRemovingTeam = helpers.reOrderSavedTeams(beforeRemovingTeam)
        console.log(beforeRemovingTeam)
        return {
          ...state,
          savedTeams: beforeRemovingTeam
        }

      case types.UPDATE_SAVED_TEAM:
        console.log('inside UPDATE_SAVED_TEAM ', action.payload.team.key)
        
        let beforeMakingTeamActive = {...state.savedTeams};
        console.log(beforeMakingTeamActive)
        beforeMakingTeamActive[action.payload.team.key] = action.payload.team;
        console.log(beforeMakingTeamActive)
      
        return {
          ...state,
          savedTeams: beforeMakingTeamActive
        }

      case types.TOGGLE_LOGIN_LOADING:
        console.log('inside TOGGLE_LOGIN_LOADING ',)

        const newLoginLoading = !state.loginLoading;
        // console.log({loginLoading: newLoginLoading})
        return {
          ...state, 
          loginLoading: newLoginLoading
        }

      case types.REFRESH_AND_DECODE_SAVED_TEAMS: 
        console.log('inside REFRESH_AND_DECODE_SAVED_TEAMS ',)
        // console.log({loginLoading: newLoginLoading})
        return {
          ...state, 
          savedTeams: action.payload.savedTeams
        }

    default: {
      return state
    }
  }
}

export default userFunctionsReducer;