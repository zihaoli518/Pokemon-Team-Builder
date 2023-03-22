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

import helpers from './helpers.js'
import { getTypeWeaknesses } from 'poke-types';

const initialState = {
  currentPokemon: {
    isActive: false,
    pokemon: null,
    types: [],
    stats: {},
    weakness: {},
  },
  yourTeam: {
    size: 0,
    name: 'your team',
    key: 'team_1',
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
  showChartOption: false,
  showTypingChart: false,
}

const pokemonReducer = (state = initialState, action) => {

  console.log('inside pokemon reducer, action: ', action)


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
      // console.log('ADD_POKEMON_POKEAPI ', copy)

      // populating weakness object
      if (copy.types.length===1) copy.weakness = getTypeWeaknesses(copy.types[0]);
      else copy.weakness = getTypeWeaknesses(copy.types[0], copy.types[1]);

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
      const currentPokemonY = action.payload;

      if (yourNewTeam.size>=6) return;

      yourNewTeam.size++;
      // adding new pokemon to the first available spot 
      for (let i=1; i<=6; i++) {
        let currentMonString = 'mon' + i.toString();
        if (!(yourNewTeam[currentMonString])) {
          yourNewTeam[currentMonString] = currentPokemonY;
          break;
        }
      }

      return {
        ... state,
        yourTeam: yourNewTeam,
        teamStatus: true
      }

      // add pokemon to enemy team 
      case types.ADD_POKEMON_TO_ENEMY_TEAM :

        const enemyNewTeam = {...state.enemyTeam};
        const currentPokemonE = action.payload;

        if (enemyNewTeam.size>=6) return;
        
        enemyNewTeam.size++;
        // adding new pokemon to the first available spot 
        for (let i=1; i<=6; i++) {
          let currentMonString = 'mon' + i.toString();
            if (!(enemyNewTeam[currentMonString])) {
              enemyNewTeam[currentMonString] = currentPokemonE;
              break;
          }
        }

        return {
          ... state,
          enemyTeam: enemyNewTeam,
          teamStatus: true
        }
        
      // select pokemon -> and make it the current display pokemon 
      case types.SELECT_TEAM_MEMBER : 
        const copyOfCurrentPokemon = {...state.currentPokemon};
        return {
          ... state,
          currentPokemon: action.payload
        }

      // remove pokemon from team 
      case types.REMOVE_TEAM_MEMBER : 

        const team = action.payload.team;
        const mon = action.payload.mon; 
        const CopyOfTeam = {...state[team]}
        console.log('inside REMOVE_TEAM_MEMBER, ', CopyOfTeam)

        CopyOfTeam[mon] = null;
        CopyOfTeam.size--;

        const shuffledTeam = helpers.reOrderTeam(CopyOfTeam);

        const returnState = {...state};
        returnState[team] = shuffledTeam;
        shuffledTeam['name'] = 'untitled'

        return returnState;


      case types.SHOW_TYPING_CHART:
        return {
          ...state,
          showTypingChart: true
        }

      case types.SWITCH_TEAMS:
        

        return {
          ...state,
          yourTeam: action.payload.enemeyTeam,
          enemyTeam: action.payload.yourTeam
        }
      
      case types.SET_YOUR_TEAM: 

        return {
          ...state,
          yourTeam: action.payload.team,
        }
        
      case types.MAKE_SAVED_TEAM_ACTIVE:
        console.log('inside MAKE_SAVED_TEAM_ACTIVE', action.payload.team)
        const newActiveTeam = action.payload.team;
        newActiveTeam.key = action.payload.key;

        return {
          ...state,
          yourTeam: action.payload.team,
        }

    default: {
      return state
    }
  }
}

export default pokemonReducer;