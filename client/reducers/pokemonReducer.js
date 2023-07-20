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
const calculator = require('pokemon-stat-calculator');

const initialState = {
  currentPokemon: {
    pokemon: null,
    pokedexId: 0,
    level: 100,
    types: [],
    abilities: [{ ability: { name: "", url: "", description: "" }, is_hidden: false, slot: 0 }],
    activeAbility: {name: null, description: null},
    item: {item: "", description: "", url: ""},
    moves: {
      move_1: {name: null, type: ""},
      move_2: {name: null, type: ""},
      move_3: {name: null, type: ""},
      move_4: {name: null, type: ""},
    },
    activeMove: {
      moveId: "",
      moveObj: {name: null}
    },
    evs:{obj: {hp: 0, attack: 0, defense: 0, specialA: 0, specialD: 0, speed: 0}, array: [0,0,0,0,0,0]},
    ivs:{obj: {hp: 31, attack: 31, defense: 31, specialA: 31, specialD: 31, speed: 31}, array: [0,0,0,0,0,0]},
    remainingEv: 508,
    nature: 'serious',
    calculatedStats: [0, 0, 0, 0, 0, 0],
    movePool: {},
    stats: {},
    weakness: {},
    isActive: false, 
    slot: {team: null, mon: null}
  },
  yourTeam: {
    size: 0,
    name: "your team",
    key: "team_1",
    mon1: null,
    mon2: null,
    mon3: null,
    mon4: null,
    mon5: null,
    mon6: null,
    activeMon: null,
  },
  enemyTeam: {
    size: 0,
    key: "team_1_e",
    name: "enemy team",
    mon1: null,
    mon2: null,
    mon3: null,
    mon4: null,
    mon5: null,
    mon6: null,
    activeMon: null,
  },
  historyCache: [],
  previousTeamKeyF: 'team_1',
  previousTeamKeyE: 'team_1',
  teamStatus: false,
  showChartOption: false,
  showTypingChart: false,
};

const pokemonReducer = (state = initialState, action) => {

  // console.log('inside pokemon reducer, action: ', action)


  switch (action.type) {
    // // expecting data from smogon fetch
    // case types.ADD_POKEMON:
    //   const newCurrentPokemon = state.currentPokemon;
    //   newCurrentPokemon.isActive = true;
    //   for (let key in action.payload) {
    //     newCurrentPokemon[key] = action.payload[key]
    //   }
    //   // check if competitive stats not found 
    //   if (Object.keys(newCurrentPokemon.moves)[0]===undefined) {
    //     newCurrentPokemon.competetiveStatus = false;
    //   } else newCurrentPokemon.competetiveStatus = true;

    //   // console.log('first reducer ', newCurrentPokemon)
    //   return {
    //      // making deep copy of previou state
    //      ...state,
    //      // reassigning updated values to states
    //     currentPokemon: newCurrentPokemon
    //   }

    // expecting data from pokeAPI fetch
    case types.ADD_POKEMON_POKEAPI: 
      console.log('inside ADD_POKEMON_POKEAPI', action.payload);

      // check if pokemon data received is in cached format 
      if (action.payload.mode==='cached') {
        return {
          ...state,
          currentPokemon: action.payload.pokemonData
        }
      }

      // console.log(action.payload)
      const copy = {...state.currentPokemon};
      copy['pokemon'] = action.payload.pokemon;
      const pokemonData = action.payload.pokemonData
      // initiate re-render by changing state
      copy.isActive = true;
      // fill in types 
      copy.types = [];
      for (let i=0; i<pokemonData.types.length; i++) {
        copy.types.push(pokemonData.types[i].type.name)
      }
      copy.pokedexId = pokemonData.id;
      
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

      // reformatting abilities
      copy.abilities = pokemonData.abilities;
      for (let i=0; i<copy.abilities.length; i++) {
        copy.abilities[i].ability.url = encodeURIComponent(copy.abilities[i].ability.url)
      }

      // reformatting move pool of pokemon 
      let newMovePool = {};
      for (let i=0; i<pokemonData.moves.length; i++) {
        // // keeping move pool up to date with gen 9 only 
        // let gen9 = false;
        // for (let i=0; i<pokemonData.moves[i].version_group_details.length; i++) {
        //   if (pokemonData.moves[i].version_group_details[i].version_group.name === 'scarlet-violet') gen9=true;
        // }
        // if (gen9) newMovePool[pokemonData.moves[i].move.name.replace("-", " ")] = true;
        newMovePool[pokemonData.moves[i].move.name.replace("-", " ")] = true;

      }
      // for some reason corviknight is missing defog from api 
      if (copy.pokemon==='corviknight') newMovePool['defog'] = true;
      copy.movePool = newMovePool;

      // add evolution chain 
      copy.evolution_chain = pokemonData.evolution_chain;

      
      // need to reset slot to avoid unwantingly changing active team 
      copy.slot = {team: null, mon: null};
      // reset selected item
      copy.item = {};
      // reset moves
      copy.moves = {
        move_1: {name: null, type: ""},
        move_2: {name: null, type: ""},
        move_3: {name: null, type: ""},
        move_4: {name: null, type: ""},
      };
      // reset evs and evs 
      copy.evs = {obj: {hp: 0, attack: 0, defense: 0, specialA: 0, specialD: 0, Speed: 0}, array: [0,0,0,0,0,0]};
      copy.ivs = {obj: {hp: 31, attack: 31, defense: 31, specialA: 31, specialD: 31, Speed: 31}, array: [31,31,31,31,31,31]};
      copy.nature = 'serious';
      copy.remainingEv = 508;
      const statsArray = helpers.statObjToArray(copy.stats);
      const natureArray = calculator.getNatureValue(copy.nature)
      copy.calculatedStats = calculator.calAllStats(copy.ivs.array, statsArray, copy.evs.array, copy.level, natureArray)
      

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
      console.log('inside ADD_POKEMON_TO_YOUR_TEAM', action.payload)
      const yourNewTeam = JSON.parse(JSON.stringify(state.yourTeam));
      const currentPokemonY = JSON.parse(JSON.stringify(state.currentPokemon));
      
      if (yourNewTeam.size>=6) return;

      yourNewTeam.size++;

      yourNewTeam['mon'+yourNewTeam.size] = {...currentPokemonY};
      yourNewTeam['mon'+yourNewTeam.size].slot.mon = 'mon'+yourNewTeam.size;

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
      console.log('inside SELECT_TEAM_MEMBER', action.payload);

      const copyOfPokemonData = {...action.payload.pokemonData};
      copyOfPokemonData.slot.team = action.payload.team;
      copyOfPokemonData.slot.mon = action.payload.mon;
      
      return {
        ... state,
        currentPokemon: copyOfPokemonData
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
      const toggleTypingChart = !state.showTypingChart;
      return {
        ...state,
        showTypingChart: toggleTypingChart
      }

    case types.SWITCH_TEAMS:
      console.log('inside SWITCH_TEAMS', action.payload)

      const newYourTeam = {
        ...action.payload.enemeyTeam,
        key: state.yourTeam.key
      }


      return {
        ...state,
        yourTeam: newYourTeam,
        enemyTeam: action.payload.yourTeam,
        previousTeamKeyF: state.previousTeamKeyE,
        previousTeamKeyE: state.previousTeamKeyF,
      }
    
    case types.SET_YOUR_TEAM: 
      let previousTeamKey = state.previousTeamKeyE;

      return {
        ...state,
        yourTeam: action.payload.team,
        teamStatus: true,
        previousTeamKeyE: previousTeamKey,
      }
      
    case types.MAKE_SAVED_TEAM_ACTIVE:
      console.log('inside MAKE_SAVED_TEAM_ACTIVE', action.payload)
      const newActiveTeam = action.payload.team;
      newActiveTeam['key'] = action.payload.key;

      return {
        ...state,
        yourTeam: newActiveTeam,
        teamStatus: true,

      }

    // save selected ability to currentPokemon.activeAbility and saving that to the team 
    case types.SELECT_ABILITY: 
      console.log('inside SELECT_ABILITY', action.payload)

      const beforeSelectAbility = {...state.currentPokemon}
      beforeSelectAbility.activeAbility = action.payload.ability;
      const monChangingAbility = beforeSelectAbility.slot.mon;
      const yourTeamWithNewAbility = {...state.yourTeam}; 
      if (beforeSelectAbility.slot.mon!==null ) {
        yourTeamWithNewAbility[monChangingAbility] = beforeSelectAbility;
      }
      
      console.log(beforeSelectAbility.slot, monChangingAbility)
      console.log(yourTeamWithNewAbility)
      return {
        ...state,
        currentPokemon: beforeSelectAbility,
        yourTeam: yourTeamWithNewAbility
      }
    
    case types.SAVE_ITEM_TO_MON: 
      console.log('inside SAVE_ITEM_TO_MON')
      console.log(action.payload)
      const copyOfPrevItemMon = {...state.currentPokemon};
      copyOfPrevItemMon.item['item'] = action.payload.item;
      copyOfPrevItemMon.item['description'] = action.payload.description;
      copyOfPrevItemMon.item['url'] = action.payload.url;

      return {
        ...state,
        currentPokemon: copyOfPrevItemMon
      }

    case types.UPDATE_ACTIVE_MOVE: 
      console.log('inside UPDATE_ACTIVE_MOVE', action.payload)

      const copyOfPrevActiveMove = {...state.currentPokemon};
      let makeActiveMoveObj = action.payload.moveObj;
      if (!makeActiveMoveObj) makeActiveMoveObj = {name: null}
      copyOfPrevActiveMove.activeMove = {moveId: action.payload.moveId, moveObj: makeActiveMoveObj}

      return {
        ...state,
        currentPokemon: copyOfPrevActiveMove
      }
    
    case types.SELECT_MOVE_FROM_LIST: 
      console.log('inside SELECT_MOVE_FROM_LIST', action.payload)

      const copyOfPrevMoveSet = {...state.currentPokemon};
      copyOfPrevMoveSet.moves[action.payload.moveId] = action.payload.moveObj
      copyOfPrevMoveSet.activeMove = {moveId: action.payload.moveId, moveObj: action.payload.moveObj}
      console.log(copyOfPrevMoveSet)
      return {
        ...state,
        currentPokemon: copyOfPrevMoveSet
      }

    case types.UPDATE_PREVIOUS_TEAM_KEY: 
    console.log('inside UPDATE_PREVIOUS_TEAM_KEY', state.yourTeam.key)

      return {
        ...state,
        previousTeamKeyE: state.yourTeam.key
      }
    
    case types.CLEAR_TEAM:
      const emptyTeam ={
        size: 0,
        key: state.yourTeam.key,
        mon1: null,
        mon2: null,
        mon3: null,
        mon4: null,
        mon5: null,
        mon6: null,
      }
      if (action.payload==='yourTeam') {
        emptyTeam.name = 'your team';
        return {
          ...state,
          yourTeam: emptyTeam
        }
      }
      emptyTeam.name = 'enemy team';
      return {
        ...state,
        enemyTeam: emptyTeam
      }

    case types.UPDATE_NATURE: 
      console.log('inside UPDATE_NATURE', action.payload);

      return {
        ...state,
        currentPokemon: {...state.currentPokemon,
          nature: action.payload
        }
      }
    
    case types.UPDATE_CALCULATED_STATS: 
      console.log('inside UPDATE_CALCULATED_STATS', action.payload);
      const currentPokemonBeforeEvs = {
        ...state.currentPokemon,
        evs: {array: action.payload.evs},
        ivs: {array: action.payload.ivs},
        remainingEv: action.payload.remainingEv,
        calculatedStats: action.payload.calcs
      };
      
      let yourTeamWithUpdatedStats = {...state.yourTeam};
      if (currentPokemonBeforeEvs.slot.mon) {
        yourTeamWithUpdatedStats[currentPokemonBeforeEvs.slot.mon] = currentPokemonBeforeEvs
      }

      return {
        ...state,
        currentPokemon: currentPokemonBeforeEvs,
        yourTeam: yourTeamWithUpdatedStats
      }
    
      case types.UPDATE_YOUR_TEAM_KEY: 
        return {
          ...state,
          yourTeam: {...state.yourTeam, key: action.payload}
        }

      case types.UPDATE_HISTORY_CACHE: 
        console.log('inside UPDATE_HISTORY_CACHE', action.payload);

        const copyOFHistoryCache = [...state.historyCache];

      

        if (action.payload.type==='add') {
          //quickly check if pokemon already exists in cache
          for (let i = 0; i < copyOFHistoryCache.length; i++) {
            const pokemonObj = copyOFHistoryCache[i];
            if (pokemonObj.pokemon === action.payload.pokemonObj.pokemon) {
              copyOFHistoryCache.splice(i, 1);
              copyOFHistoryCache.push(pokemonObj);
              return {...state, historyCache: copyOFHistoryCache}
            }
          }
          if (copyOFHistoryCache.length>=10) copyOFHistoryCache.shift();
          copyOFHistoryCache.push(action.payload.pokemonObj);
          return {
            ...state,
            historyCache: copyOFHistoryCache
          }
        } else if (action.payload.type==='sync') {
          return {
            ...state,
            historyCache: action.payload.array
          }
        }

        
         
    default: {
      return state
    }
  }
}

export default pokemonReducer;