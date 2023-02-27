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
import reOrder from './reorder.js'

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
  showChartOption: false,
  showChart: false,
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
      const currentPokemonY = {...state.currentPokemon};

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
        console.log('REDUCER:     ADD_POKEMON_TO_ENEMY_TEAM')
        const enemyNewTeam = {...state.enemyTeam};
        const currentPokemonE = {...state.currentPokemon};

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
        console.log(enemyNewTeam)
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
        console.log('inside remove team member ')
        const team = action.payload.team;
        const mon = action.payload.mon; 
        const CopyOfTeam = {...state[team]}
        console.log(team, mon)
        console.log(CopyOfTeam)
        CopyOfTeam[mon] = null;
        CopyOfTeam.size--;

        const shuffledTeam = reOrder(CopyOfTeam);

        const returnState = {...state};
        returnState[team] = shuffledTeam;
        console.log(returnState)
        return returnState;

    default: {
      return state
    }
  }
}

export default pokemonReducer;