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
    pokemonData: pokemonData,
  },
});

// export const updatePokemonName = pokemon => ({
//   type: types.UPDATE_CURRENT_POKEMON_NAME,
//   payload: pokemon
// })

export const updateGif = (url) => ({
  type: types.UPDATE_GIF,
  payload: url,
});

export const addPokemonToYourTeam = (pokemonObj) => ({
  type: types.ADD_POKEMON_TO_YOUR_TEAM,
  payload: pokemonObj,
});

export const addPokemonToEnemyTeam = (pokemonObj) => ({
  type: types.ADD_POKEMON_TO_ENEMY_TEAM,
  payload: pokemonObj,
});

export const removeTeamMember = (team, mon) => ({
  type: types.REMOVE_TEAM_MEMBER,
  payload: { team: team, mon: mon },
});

export const selectTeamMember = (pokemonObj) => ({
  type: types.SELECT_TEAM_MEMBER,
  payload: pokemonObj,
});

export const showTypingChart = () => ({
  type: types.SHOW_TYPING_CHART,
  payload: null,
});