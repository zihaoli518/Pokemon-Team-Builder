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

export const selectTeamMember = (pokemonData, team, mon) => ({
  type: types.SELECT_TEAM_MEMBER,
  payload: {pokemonData: pokemonData, team: team, mon: mon},
});

export const showTypingChart = () => ({
  type: types.SHOW_TYPING_CHART,
  payload: null,
});

export const switchTeams = (yourTeam, enemeyTeam) => ({
  type: types.SWITCH_TEAMS,
  payload: {yourTeam: yourTeam, enemeyTeam: enemeyTeam},
});

export const toggleMainDivState = (string) => ({
  type: types.TOGGLE_MAIN_DIV_STATE,
  payload: {string: string},
});

export const changeUserState = (username, responseObj) => ({
  type: types.CHANGE_USER_STATE,
  payload: {username: username, responseObj: responseObj},
});

export const saveCurrentTeamAsNew = (team) => ({
  type: types.SAVE_CURRENT_TEAM_AS_NEW,
  payload: {team: team},
});

export const updateSavedTeam = (team) => ({
  type: types.UPDATE_SAVED_TEAM,
  payload: {team: team},
});

export const setYourTeam = (team) => ({
  type: types.SET_YOUR_TEAM,
  payload: {team: team},
});

export const makeSavedTeamActive = (key, teamObj) => ({
  type: types.MAKE_SAVED_TEAM_ACTIVE,
  payload: {key: key, team: teamObj},
});

export const removeSavedTeam = (key) => ({
  type: types.REMOVE_SAVED_TEAM,
  payload: {key: key},
});

export const toggleLoginLoading = () => ({
  type: types.TOGGLE_LOGIN_LOADING, 
  payload: {}
})

export const activateCurrentTeamComponent = () => ({
  type: types.ACTIVATE_CURRENT_TEAM_COMPONENT, 
  payload: {}
})

export const selectAbility = (ability) => ({
  type: types.SELECT_ABILITY, 
  payload: {ability: ability}
})

export const saveItemToMon = (item, description, url) => ({
  type: types.SAVE_ITEM_TO_MON, 
  payload: {item: item, description: description, url: url}
})

export const selectMoveFromList = (moveId, moveObj) => ({
  type: types.SELECT_MOVE_FROM_LIST, 
  payload: {moveId: moveId, moveObj: moveObj}
})

export const updateActiveMove = (moveId, moveObj) => ({
  type: types.UPDATE_ACTIVE_MOVE, 
  payload: {moveId: moveId, moveObj: moveObj}
})


export const refreshAndDecodeSavedTeams = (savedTeams) => ({
  type: types.REFRESH_AND_DECODE_SAVED_TEAMS, 
  payload: {savedTeams: savedTeams}
})