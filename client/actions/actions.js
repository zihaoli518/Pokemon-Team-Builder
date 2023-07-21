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

export const updatePokemonPokeAPI = (pokemon, pokemonData, mode) => ({
  type: types.ADD_POKEMON_POKEAPI,
  payload: {
    pokemon: pokemon,
    pokemonData: pokemonData,
    mode: mode 
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

export const switchTeams = (yourTeam, enemeyTeam, key) => ({
  type: types.SWITCH_TEAMS,
  payload: {yourTeam: yourTeam, enemeyTeam: enemeyTeam, key: key},
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

export const updatePreviousTeamKey = (letter) => ({
  type: types.UPDATE_PREVIOUS_TEAM_KEY, 
  payload: {letter: letter}
})

export const clearTeam = (teamStr) => ({
  type: types.CLEAR_TEAM, 
  payload: teamStr
})

export const updateCalculatedStats = (evs, ivs, remainingEv, calcs) => ({
  type: types.UPDATE_CALCULATED_STATS, 
  payload: {evs: evs, ivs: ivs, remainingEv: remainingEv, calcs: calcs}
})

export const updateNature = (nature) => ({
  type: types.UPDATE_NATURE, 
  payload: nature
})

export const updateYourTeamKey = (num) => ({
  type: types.UPDATE_YOUR_TEAM_KEY,
  payload: num
})

export const addMonToCalc = (pokemonObj, team) => ({
  type: types.ADD_MON_TO_CALC,
  payload: {pokemonObj: pokemonObj, team: team}
})


export const changeCalcAttribute = (team, attributeName, attribute) => ({
  type: types.CHANGE_CALC_ATTRIBUTE,
  payload: {team: team, attributeName: attributeName, attribute: attribute}
})

export const updateCalculatedStatsCalc = (team, evs, results) => ({
  type: types.UPDATE_CALCULATED_STATS_CALC, 
  payload: {team: team, evs: evs, results: results}
})


export const chooseMoveForCalc = (team, moveId, move, type, basepower, categoryUrl) => ({
  type: types.CHOOSE_MOVE_FOR_CALC, 
  payload: {team: team, moveId: moveId, move: move, type: type, basepower: basepower, categoryUrl: categoryUrl}
})

export const updateHistoryCache = (type, pokemonObj, array) => ({
  type: types.UPDATE_HISTORY_CACHE, 
  payload: {type: type, pokemonObj: pokemonObj, array: array}
})

export const updatePokemonSet = (importedSet) => ({
  type: types.UPDATE_POKEMON_SET, 
  payload: importedSet
})