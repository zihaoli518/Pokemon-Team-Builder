/**
 * ************************************
 *
 * @module CalcResultRow
 * @author zi 
 * @date
 * @description CalcEV
 *
 * ************************************
 */

// importing dependencies 
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'

import { connect } from 'react-redux';

import * as actions from '../../actions/actions';
import MoveSearchModal from './MoveSearchModal.jsx';

const calculator = require('pokemon-stat-calculator')
import {calculate, Generations, Pokemon, Move} from '@ajhyndman/smogon-calc';

// importing json files containing data from smogon 
import Data from '../dexData.js';
const allItemsJSON = Data.allItemsJSON;
const allMovesJSON = Data.allMovesJSON;
const natureArray = Data.natureArray;
const statusArray = Data.statusArray;




const mapStateToProps = (state, ownProps) => {
  const pokemonCalcDataFriendly = state.damageCalc.pokemonCalcDataFriendly
  const pokemonCalcDataEnemy = state.damageCalc.pokemonCalcDataEnemy;

  const currentPokemon = (ownProps.team==='friendly') ? pokemonCalcDataFriendly : pokemonCalcDataEnemy;

  return {
    currentPokemon: currentPokemon,
    pokemonCalcDataFriendly: pokemonCalcDataFriendly,
    pokemonCalcDataEnemy: pokemonCalcDataEnemy,
  }
}


const mapDispatchToProps = dispatch => ({
  updateCalculatedStatsCalc : (team, evs, results) => dispatch(actions.updateCalculatedStatsCalc(team, evs, results)),
  chooseMoveForCalc: (team, moveId, move, type, basepower) => dispatch(actions.chooseMoveForCalc(team, moveId, move, type, basepower)),
});

const statOrder = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
// for reformat according to smogon/damage-calc interface
const statusMap = {healthy: '', poisoned: 'psn', 'badly poisoned': 'tox', burned: 'brn', paralyzed: 'par', asleep: 'slp', frozen: 'frz'}



const CalcResultRow = props => {

  const [calcDisplay, setCalcDisplay] = useState('');
  const moveId = props.moveId;



  // takes two pokemon objects and a move string as input for example: 'Focus Blast' and returns a range of damage '40% - 43%'
  const calculateDamage = (attacker, defender, move) => {
    console.log('inside calculateDamage', attacker, defender, move)
    // find the newest gen that allows both inputed pokemon 
    let gen = 9; 
    while (gen > 0) {
      try {
        const attackerName = capitalizeFirstLetter(attacker.name);
        const defenderName = capitalizeFirstLetter(defender.name);
        const result = calculate(
          gen,
          new Pokemon(gen, attackerName, {
            ability: capitalizeFirstLetter(attacker.activeAbility),
            abilityOn: true,
            item: (attacker.item==='(none)') ? '' : attacker.item,
            nature: attacker.nature,
            evs: attacker.evs,
            status: statusMap[attacker.status.toLowerCase()],
          }),
          new Pokemon(gen, defenderName, {
            ability: capitalizeFirstLetter(defender.activeAbility),
            abilityOn: true,
            item: (defender.item==='(none)') ? '' : defender.item,
            nature: defender.nature,
            evs: defender.evs,
            status: statusMap[defender.status.toLowerCase()],          }),
          new Move(gen, move)
        );
        console.log("inside calculateDamage", gen, result);
        const minDamage = result.damage[0];
        const maxDamge = result.damage[result.damage.length-1];

        if (!minDamage) {
          return ('0%')
        }

        const hp = result.defender.stats.hp;
        
        const minPercentage = ((minDamage/hp) * 100).toFixed(1) + '%';
        const maxPercentage = ((maxDamge/hp) * 100).toFixed(1) + '%';
        
        console.log(minDamage, maxDamge, minPercentage, maxPercentage)
        return (minPercentage + '-' + maxPercentage);
      } catch (error) {
        gen--;
      }
    }
  }


  // // update an array of jsx for every move, for every move container in calc, update state
  // const populateModal = (moveId, searchStr) => {
  //   console.log('inside populateModal, ', moveId, searchStr)
  //   const arrayOfMoves = [];
  //   // helper function for choose move onclick 
  //   function chooseMove(team, moveId, move, type, basepower) {
  //     props.chooseMoveForCalc(team, moveId, move, type, basepower);
  //     // close the modal
  //     const newPopUpState = {...props.popUpDisplay};
  //     newPopUpState[moveId] = false;
  //     props.setPopUpDisplay(newPopUpState);
  //   }

  //   for (let move in allMovesJSON) {
  //     const capitalizedName = allMovesJSON[move].name;
  //     const type = allMovesJSON[move].type;
  //     const basepower = allMovesJSON[move].basePower;

  //     let highlightedStr = '';
  //     let restOfStr = capitalizedName; 

  //     // check if row should be pushed to array, if !searchStr then default push everything,  or if searchStr matches the start of item name
  //     if (searchStr) {
  //       highlightedStr = capitalizedName.slice(0, searchStr.length);
  //       restOfStr = capitalizedName.slice(searchStr.length, capitalizedName.length);
  //       searchStr = capitalizeWords(searchStr)
  //     }

  //     console.log('searchStr: ', searchStr, 'highlightedStr: ',  highlightedStr, 'restOfStr: ',restOfStr)

  //     if (!searchStr || highlightedStr===searchStr) {
  //       if (searchStr)  highlightedStr = searchStr;
  //       arrayOfMoves.push(
  //         <div className='calc-modal-option' onClick={()=>{chooseMove(props.team, moveId, capitalizedName, type, basepower)}}>
  //             <h4><span>{highlightedStr}</span>{restOfStr}</h4>
  //         </div>
  //       )
  //     }

  //   }
  //   // update state
  //   // let newState = {...modalOptions};
  //   // newState[moveId] = arrayOfMoves;
  //   // console.log(newState)

  //   setModalOptions(prevState => ({
  //     ...prevState,
  //     [moveId]: arrayOfMoves
  //   }));
  // }

  // called during every useEffect, map onclick functions to move inputs 
  const populateRow = () => {
      console.log('about to call populateModal() ', moveId)
      // calc 
      let calcDispay = '';
      // update calc if both pokemon are present 
      let attacker, defender;
      if (props.pokemonCalcDataFriendly.name && props. pokemonCalcDataEnemy.name && props.currentPokemon.moves[moveId].name) {
        if (props.team==='friendly') {
          attacker = props.pokemonCalcDataFriendly;
          defender = props.pokemonCalcDataEnemy;
        } else {
          attacker = props.pokemonCalcDataEnemy;
          defender = props.pokemonCalcDataFriendly;
        }
        let move = props.currentPokemon.moves[moveId].name;
        console.log('about to calculate: ', attacker, defender, move)
        const calcResult = calculateDamage(attacker, defender, move);
        setCalcDisplay(calcResult)
      }

  }

  // function for searching moves 

  const searchAndDisplayMoves = (elementId, moveId) => {
    console.log('inside searchAndDisplayMoves', elementId, moveId)
    const searchStr = document.getElementById(elementId).value;
    populateModal(moveId, searchStr);
  }



  useEffect(() => {
    populateRow();
  }, [props.pokemonCalcDataFriendly, props.pokemonCalcDataEnemy, props.popUpDisplay])


  return (
    <div className={`calc-result-row-container`}>
      <MoveSearchModal moveId={moveId} team={props.team} popUpDisplay={props.popUpDisplay} setPopUpDisplay={props.setPopUpDisplay} />
      <div className={`calc-move-container type-${props.currentPokemon.moves[moveId].type ? props.currentPokemon.moves[moveId].type.toLowerCase() : null}`} onClick={()=>{console.log('calc-move-container onclick!'); props.setPopUpDisplay({...props.PopUpState, [moveId]:!props.popUpDisplay[moveId]})}}>
        <h4>{props.currentPokemon.moves[moveId].name}</h4>
      </div>
      <h4 className='calc-move-basepower'> {props.currentPokemon.moves[moveId].basepower}</h4>
      <h4 key={calcDisplay} className='calc-result'>{calcDisplay}</h4>
    </div>
  );
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


export default connect(mapStateToProps, mapDispatchToProps)(CalcResultRow);