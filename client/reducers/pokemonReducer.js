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
  yourTeam: {
    size: 0,
    mon1: null,
    mon2: null,
    mon3: null,
    mon4: null,
    mon5: null,
    mon6: null
  },
  enemyTeam: {
    size: 0,
    mon1: null,
    mon2: null,
    mon3: null,
    mon4: null,
    mon5: null,
    mon6: null
  },
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
      // console.log('inside reducer! ')
      // console.log(action.payload)
      const copy = {...state.currentPokemon};
      copy['pokemon'] = action.payload.pokemon
      const pokemonData = action.payload.pokemonData
      // initiate re-render by changing state
      copy.isActive = true;
      // fill in types 
      copy.types = [];
      for (let i=0; i<pokemonData.types.length; i++) {
        copy.types.push(pokemonData.types[i].type.name)
      }
      // organizing stats 
      copy.stats = {};
      copy.stats.hp = pokemonData.stats[0].base_stat;
      copy.stats.attack = pokemonData.stats[1].base_stat;
      copy.stats.defense = pokemonData.stats[2].base_stat;
      copy.stats.specialA = pokemonData.stats[3].base_stat;
      copy.stats.specialD = pokemonData.stats[4].base_stat;
      copy.stats.speed = pokemonData.stats[5].base_stat;
      console.log('ADD_POKEMON_POKEAPI ', copy)
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
      const yourNewTeam = {...state.yourTeam};
      const currentPokemonY = {...state.currentPokemon}

      yourNewTeam.size++;
      yourNewTeam['mon' + yourNewTeam.size.toString()] = currentPokemonY;

      return {
        ... state,
        yourTeam: yourNewTeam,
        teamStatus: true
      }
      // add pokemon to enemy team 
      case types.ADD_POKEMON_TO_ENEMY_TEAM :
        const enemyNewTeam = {...state.yourTeam};
        const currentPokemonE = {...state.currentPokemon}
        
        enemyNewTeam.size++;
        enemyNewTeam['mon' + enemyNewTeam.size.toString()] = currentPokemonE;
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