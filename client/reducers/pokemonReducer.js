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
    pokemon: null,
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
  },
  enemyTeam: {
    size: 0,
    key: "team_1",
    mon1: null,
    mon2: null,
    mon3: null,
    mon4: null,
    mon5: null,
    mon6: null,
  },
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

      // reformatting abilities
      copy.abilities = pokemonData.abilities;
      for (let i=0; i<copy.abilities.length; i++) {
        copy.abilities[i].ability.url = encodeURIComponent(copy.abilities[i].ability.url)
      }


      // reformatting move pool of pokemon 
      for (let i=0; i<pokemonData.moves.length; i++) {
        copy.movePool[pokemonData.moves[i].move.name.replace("-", " ")] = true;
      }

      
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
        console.log('inside SELECT_TEAM_MEMBER', action.payload)

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
        return {
          ...state,
          showTypingChart: true
        }

      case types.SWITCH_TEAMS:
        

        return {
          ...state,
          yourTeam: action.payload.enemeyTeam,
          enemyTeam: action.payload.yourTeam,
          previousTeamKeyF: state.previousTeamKeyE,
          previousTeamKeyE: state.previousTeamKeyF,
        }
      
      case types.SET_YOUR_TEAM: 
        let previousTeamKey = state.previousTeamKey;

        return {
          ...state,
          yourTeam: action.payload.team,
          teamStatus: true,
          previousTeamKey: previousTeamKey,
        }
        
      case types.MAKE_SAVED_TEAM_ACTIVE:
        console.log('inside MAKE_SAVED_TEAM_ACTIVE', action.payload.team)
        const newActiveTeam = action.payload.team;
        newActiveTeam.key = action.payload.key;

        return {
          ...state,
          yourTeam: action.payload.team,
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

          console.log('end of SAVE_ITEM_TO_MON', )

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
    default: {
      return state
    }
  }
}

export default pokemonReducer;