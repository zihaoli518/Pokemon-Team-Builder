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
  pokemonCalcDataFriendly: {
    name: null,
    types: [],
    nature: 'serious',
    abilities: [{ ability: { name: "", url: "", description: "" }, is_hidden: false, slot: 0 }],
    activeAbility: '',
    item: '',
    status: 'healthy',
    stats: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
    calculatedStats: [0, 0, 0, 0, 0, 0],
    evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
    boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
    moves: {
      move_1: null,
      move_2: null,
      move_3: null,
      move_4: null,
    },
  },
  pokemonCalcDataEnemy: {
    name: null,
    types: [],
    nature: 'serious',
    abilities: [{ ability: { name: "", url: "", description: "" }, is_hidden: false, slot: 0 }],
    activeAbility: '',
    item: '',
    status: 'healthy',
    stats: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
    calculatedStats: [0, 0, 0, 0, 0, 0],
    evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
    boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
    moves: {
      move_1: null,
      move_2: null,
      move_3: null,
      move_4: null,
    },
  },

}

const damageCalcReducer = (state = initialState, action) => {
  // console.log('inside user reducer, action: ', action)

  switch (action.type) {

    case types.ADD_MON_TO_CALC:
      console.log('inside ADD_MON_TO_CALC ', action)

      const inputPokemon = action.payload.pokemonObj;
      // reformatting object to fit format of calc 
      const newPokemonCalcObj = {
        name: inputPokemon.pokemon,
        types: inputPokemon.types,
        nature: inputPokemon.nature,
        abilities: inputPokemon.abilities,
        activeAbility: inputPokemon.activeAbility.name,
        item: '',
        status: 'healthy',
        stats: {hp: inputPokemon.stats.hp, atk: inputPokemon.stats.attack, def: inputPokemon.stats.defense, spa: inputPokemon.stats.specialA, spd: inputPokemon.stats.specialD, spe: inputPokemon.stats.speed},
        calculatedStats: inputPokemon.calculatedStats,
        evs: {hp: inputPokemon.evs.array[0], atk: inputPokemon.evs.array[1], def: inputPokemon.evs.array[2], spa: inputPokemon.evs.array[3], spd: inputPokemon.evs.array[4], spe: inputPokemon.evs.array[5]},
        boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spd: 0},
        moves: {},
    }
      // check for moves 
      for (let i=1; i<=4; i++) {
        // console.log(inputPokemon.moves['move_'+i])
        if (inputPokemon.moves['move_'+i].name) {
          newPokemonCalcObj.moves['move_'+i] = inputPokemon.moves['move_'+i].name.charAt(0).toUpperCase() + inputPokemon.moves.move_1.name.slice(1)
        }
      }

      if (action.payload.team==='friendly') {
        return ({
          ...state,
          pokemonCalcDataFriendly: newPokemonCalcObj
        })
      } else {
        return ({
          ...state,
          pokemonCalcDataEnemy: newPokemonCalcObj
        })
      }

    case types.CHANGE_CALC_ATTRIBUTE:
      console.log('inside CHANGE_CALC_ATTRIBUTE ', action.payload);
      let copyOfState = {};
      // determine which team to update 
      if (action.payload.team==='friendly') copyOfState = {...state.pokemonCalcDataFriendly}
      else copyOfState = {...state.pokemonCalcDataEnemy}
      // determine which attribute to change 
      switch (action.payload.attributeName) {
        case 'nature':
          copyOfState.nature = action.payload.attribute;
          break;
        case 'ability':
          copyOfState.activeAbility = action.payload.attribute;
          break;
        case 'item':
          copyOfState.item = action.payload.attribute;
          break;
        case 'status':
          copyOfState.status = action.payload.attribute;
          break;
        default:
          console.log('default case')
      }

      if (action.payload.team==='friendly') return {...state, pokemonCalcDataFriendly :copyOfState}
      else return {...state, pokemonCalcDataEnemy :copyOfState}
    
    case types.UPDATE_CALCULATED_STATS_CALC: 
      console.log('inside UPDATE_CALCULATED_STATS_CALC ', action.payload);
      let copyOfStateC = {};
      // determine which team to update 
      if (action.payload.team==='friendly') copyOfStateC = {...state.pokemonCalcDataFriendly}
      else copyOfStateC = {...state.pokemonCalcDataEnemy}
      const newEvInputs = action.payload.evs
      copyOfStateC.evs = {hp: newEvInputs[0], atk: newEvInputs[1], def: newEvInputs[2], spa: newEvInputs[3], spd: newEvInputs[4], spe: newEvInputs[5]}
      copyOfStateC.calculatedStats = action.payload.results

      if (action.payload.team==='friendly') return {...state, pokemonCalcDataFriendly : copyOfStateC}
      else return {...state, pokemonCalcDataEnemy : copyOfStateC}
    

    default: {
      return state
    }
  }
}

export default damageCalcReducer;