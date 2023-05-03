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
    nature: '',
    abilities: [{ ability: { name: "", url: "", description: "" }, is_hidden: false, slot: 0 }],
    item: '',
    status: 'healthy',
    evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spd: 0},
    boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spd: 0},
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
    nature: '',
    abilities: [{ ability: { name: "", url: "", description: "" }, is_hidden: false, slot: 0 }],
    item: '',
    status: 'healthy',
    evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spd: 0},
    boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spd: 0},
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
        item: '',
        status: 'healthy',
        evs: {hp: inputPokemon.evs.obj.hp, atk: inputPokemon.evs.obj.attack, def: inputPokemon.evs.obj.defense, spa: inputPokemon.evs.obj.specialA, spd: inputPokemon.evs.obj.specialD, spe: inputPokemon.evs.obj.speed},
        boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spd: 0},
        moves: {},
    }
      // check for moves 
      for (let i=1; i<=4; i++) {
        console.log(inputPokemon.moves['move_'+i])
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

    default: {
      return state
    }
  }
}

export default damageCalcReducer;