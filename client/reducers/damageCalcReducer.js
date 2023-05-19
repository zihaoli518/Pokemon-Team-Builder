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
    nature: 'Serious',
    abilities: [{ ability: { name: "", url: "", description: "" }, is_hidden: false, slot: 0 }],
    activeAbility: '',
    item: '(none)',
    status: 'Healthy',
    stats: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
    calculatedStats: [0, 0, 0, 0, 0, 0],
    evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
    boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
    moves: {
      move_1: {name: null, type: null, basepower: null, categoryUrl: ''},
      move_2: {name: null, type: null, basepower: null, categoryUrl: ''},
      move_3: {name: null, type: null, basepower: null, categoryUrl: ''},
      move_4: {name: null, type: null, basepower: null, categoryUrl: ''},
    },
    categoryUrl: '',
  },
  pokemonCalcDataEnemy: {
    name: null,
    types: [],
    nature: 'Serious',
    abilities: [{ ability: { name: "", url: "", description: "" }, is_hidden: false, slot: 0 }],
    activeAbility: '',
    item: '(none)',
    status: 'Healthy',
    stats: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
    calculatedStats: [0, 0, 0, 0, 0, 0],
    evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
    boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
    moves: {
      move_1: {name: null, type: null, basepower: null, categoryUrl: ''},
      move_2: {name: null, type: null, basepower: null, categoryUrl: ''},
      move_3: {name: null, type: null, basepower: null, categoryUrl: ''},
      move_4: {name: null, type: null, basepower: null, categoryUrl: ''},
    },
  },
  analysisMenuStatus: false

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
        nature: capitalizeFirstLetter(inputPokemon.nature),
        abilities: inputPokemon.abilities,
        activeAbility: capitalizeWords(inputPokemon.activeAbility.name),
        item: inputPokemon.item.item ? capitalizeWords(inputPokemon.item.item) : '(none)',
        status: 'Healthy',
        stats: {hp: inputPokemon.stats.hp, atk: inputPokemon.stats.attack, def: inputPokemon.stats.defense, spa: inputPokemon.stats.specialA, spd: inputPokemon.stats.specialD, spe: inputPokemon.stats.speed},
        calculatedStats: inputPokemon.calculatedStats,
        evs: {hp: inputPokemon.evs.array[0], atk: inputPokemon.evs.array[1], def: inputPokemon.evs.array[2], spa: inputPokemon.evs.array[3], spd: inputPokemon.evs.array[4], spe: inputPokemon.evs.array[5]},
        boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spd: 0},
        weakness: inputPokemon.weakness,
        moves: {
          move_1: {name: null, type: null, basepower: null},
          move_2: {name: null, type: null, basepower: null},
          move_3: {name: null, type: null, basepower: null},
          move_4: {name: null, type: null, basepower: null},
        },
    }
      // check for moves 
      for (let i=1; i<=4; i++) {
        const moveKey = 'move_'+i;
        if (inputPokemon.moves[moveKey].name) {
          newPokemonCalcObj.moves[moveKey] = {name: inputPokemon.moves[moveKey].name, type: inputPokemon.moves[moveKey].type, basepower: inputPokemon.moves[moveKey].basePower}
        }
      }
      // add default item
      // if (inputPokemon.item.item) newPokemonCalcObj.item = inputPokemon.item.item

      if (action.payload.team==='friendly') {
        return {
          ...state,
          pokemonCalcDataFriendly: newPokemonCalcObj,
          analysisMenuStatus: true
        }
      }
      return {
        ...state,
        pokemonCalcDataEnemy: newPokemonCalcObj,
        analysisMenuStatus: true
      };


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

      if (action.payload.team==='friendly') return {...state, pokemonCalcDataFriendly :copyOfState, }
      else return {...state, pokemonCalcDataEnemy :copyOfState, }
    
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
    

    case types.CHOOSE_MOVE_FOR_CALC:
      console.log('inside CHOOSE_MOVE_FOR_CALC ', action.payload);
      let copyOfStateM = {};

      if (action.payload.team==='friendly') copyOfStateM = {...state.pokemonCalcDataFriendly}
      else copyOfStateM = {...state.pokemonCalcDataEnemy};

      const newMoveObj = {};
      newMoveObj.name = action.payload.move;
      newMoveObj.type = action.payload.type;
      newMoveObj.basepower = action.payload.basepower;
      newMoveObj.categoryUrl = action.payload.categoryUrl;

      copyOfStateM.moves[action.payload.moveId] = newMoveObj;

      if (action.payload.team==='friendly') return {...state, pokemonCalcDataFriendly : copyOfStateM}
      else return {...state, pokemonCalcDataEnemy : copyOfStateM}

    default: {
      return state
    }
  }
}

// helper functions 
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, function(match) {
    return match.toUpperCase();
  }).replace(/-/g, ' ');
}



export default damageCalcReducer;