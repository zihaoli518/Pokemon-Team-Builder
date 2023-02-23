/**
 * ************************************
 *
 * @module  actions.js
 * @author
 * @date
 * @description Action Creators
 *
 * ************************************
 */

// importing actionType constants to avoid hard-to-find bugs 
import * as types from '../constants/actionTypes.js';

export const addPokemon = pokemon => ({
  type: types.ADD_POKEMON,
  payload: pokemon
})

export const updatePokemonPokeAPI = (pokemon, pokemonData) => ({
  type: types.ADD_POKEMON_POKEAPI,
  payload: {
    pokemon: pokemon,
    pokemonData: pokemonData
  }
})

// export const updatePokemonName = pokemon => ({
//   type: types.UPDATE_CURRENT_POKEMON_NAME,
//   payload: pokemon
// })

export const updateGif = url => ({
  type: types.UPDATE_GIF,
  payload: url
})

export const addPokemonToYourTeam = pokemonObj => ({
  type: types.ADD_POKEMON_TO_YOUR_TEAM,
  payload: pokemonObj
})

export const addPokemonToEnemeyTeam = pokemonObj => ({
  type: types.ADD_POKEMON_TO_YOUR_TEAM,
  payload: pokemonObj
})