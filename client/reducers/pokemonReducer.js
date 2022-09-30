/* eslint-disable no-case-declarations */
/**
 * ************************************
 *
 * @module  pokemonReducer
 * @author
 * @date
 * @description reducer for pokemon data 
 *
 * ************************************
 */

// importing action types
import * as types from '../constants/actionTypes'; 

const initialState = {
  currentPokemon: {isActive: false},
  yourTeam: [],
  enemyTeam: [],
  teamStatus: false,
}

const pokemonReducer = (state = initialState, action) => {

  switch (action.type) {
    // expecting data from smogon fetch
    case types.ADD_POKEMON:
      const newCurrentPokemon = state.currentPokemon;
      newCurrentPokemon.isActive = true;
      for (let key in action.payload) {
        newCurrentPokemon[key] = action.payload[key]
      }
      // check if competitive stats not found 
      if (Object.keys(newCurrentPokemon.moves)[0]===undefined) {
        newCurrentPokemon.competetiveStatus = false;
      } else newCurrentPokemon.competetiveStatus = true;

      // console.log('first reducer ', newCurrentPokemon)
      return {
         // making deep copy of previou state
         ...state,
         // reassigning updated values to states
        currentPokemon: newCurrentPokemon
      }

    // expecting data from pokeAPI fetch
    case types.ADD_POKEMON_POKEAPI: 
      const copy = state.currentPokemon;
      copy.types = [];
      for (let i=0; i<action.payload.types.length; i++) {
        copy.types.push(action.payload.types[i].type.name)
      }
      // organizing stats 
      copy.stats = {};
      copy.stats.hp = action.payload.stats[0].base_stat;
      copy.stats.attack = action.payload.stats[1].base_stat;
      copy.stats.defense = action.payload.stats[2].base_stat;
      copy.stats.specialA = action.payload.stats[3].base_stat;
      copy.stats.specialD = action.payload.stats[4].base_stat;
      copy.stats.speed = action.payload.stats[5].base_stat;
      // console.log('second reducer', copy)
      return {
        ...state, 
        currentPokemon: copy
      }

    case types.UPDATE_GIF:
      const updatedCurrentPokemon = state.currentPokemon;
      updatedCurrentPokemon.gif = action.payload;
      return {
        ... state,
        currentPokemon: updatedCurrentPokemon
      }

    // add pokemon to your team 
    case types.ADD_POKEMON_TO_YOUR_TEAM :
      const yourNewTeam = state.yourTeam;
      const currentNameY = state.currentPokemon.pokemon;
      let newObjY = {};
      newObjY[currentNameY] = state.currentPokemon
      yourNewTeam.push(newObjY)
      return {
        ... state,
        yourTeam: yourNewTeam,
        teamStatus: true
      }
      // add pokemon to enemy team 
      case types.ADD_POKEMON_TO_YOUR_TEAM :
        const enemyNewTeam = state.enemyTeam;
        const currentNameE = state.currentPokemon.pokemon;
        let newObjE = {};
        newObjE[currentNameE] = state.currentPokemon
        enemyNewTeam.push(newObjE)
        return {
          ... state,
          enemyTeam: enemyNewTeam,
          teamStatus: true
        }
        
      // remove pokemon from your team 

      // remove pokemon from enemy team 


    default: {
      return state
    }
  }
}

export default pokemonReducer;