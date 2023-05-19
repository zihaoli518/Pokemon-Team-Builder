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
import React, {useEffect, useState, lazy, Suspense} from 'react';
import {useNavigate} from 'react-router-dom'

import { connect } from 'react-redux';

import * as actions from '../../actions/actions';
// import MoveSearchModal from './MoveSearchModal.jsx';
const MoveSearchModal = lazy(() => import('./MoveSearchModal.jsx'));

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
  const opposingPokemon = (ownProps.team==='friendly') ? pokemonCalcDataEnemy : pokemonCalcDataFriendly;
  return {
    currentPokemon: currentPokemon,
    opposingPokemon: opposingPokemon,
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
  const [categoryUrl, setCategoryUrl] = useState('');
  const [superEffective, setSuperEffective] = useState({str: '', value: ''});

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
        
        // console.log(minDamage, maxDamge, minPercentage, maxPercentage)
        return (minPercentage + '-' + maxPercentage);
      } catch (error) {
        gen--;
      }
    }
  }


  // called during every useEffect, map onclick functions to move inputs 
  const populateRow = () => {
      // console.log('about to call populateModal() ', moveId)
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
        const calcResult = calculateDamage(attacker, defender, move);
        let superEffectiveStr = ''; 
        console.log('checking for super effective! ')
        const weaknessValue = props.opposingPokemon.weakness[props.currentPokemon.moves[moveId].type.toLowerCase()];
        if (weaknessValue===0) superEffectiveStr = 'it does not effect ' + props.opposingPokemon.name + '...';
        else if (weaknessValue===0.5) superEffectiveStr = `it's not very effective against ` + props.opposingPokemon.name + '...';
        else if (weaknessValue===0.25) superEffectiveStr = `it's not very effective (x0.25) against ` + props.opposingPokemon.name + '...';
        else if (weaknessValue===2) superEffectiveStr = `it's super effective against ` + props.opposingPokemon.name + '!';
        else if (weaknessValue===4) superEffectiveStr = `it's super effective (x4) against ` + props.opposingPokemon.name + '!';

        setSuperEffective({str: superEffectiveStr, value: weaknessValue.toString()})

        setCalcDisplay(calcResult);
      }
  }

  // clear the category image when re-renders 
  const clearCategoryImage = () => {
    setCalcDisplay('');
  }



  useEffect(() => {
    clearCategoryImage();
    populateRow();
  }, [props.pokemonCalcDataFriendly, props.pokemonCalcDataEnemy, props.popUpDisplay])


  return (
    <div className={`calc-result-row-container`}>
      {/* {props.popUpDisplay[moveId] ? 
        <MoveSearchModal moveId={moveId} team={props.team} popUpDisplay={props.popUpDisplay} setPopUpDisplay={props.setPopUpDisplay} />
        : null
      } */}
      <Suspense fallback={<div className={'calc-fallback-'+ props.team}>loading...</div>}>
        <MoveSearchModal moveId={moveId} team={props.team} popUpDisplay={props.popUpDisplay} setPopUpDisplay={props.setPopUpDisplay} setCategoryUrl={setCategoryUrl} />
      </Suspense>

      <div className={`calc-move-container calc-move-container-${props.currentPokemon.moves[moveId].type ? props.currentPokemon.moves[moveId].type.toLowerCase() : null}`} onClick={()=>{props.setPopUpDisplay({...props.PopUpState, [moveId]:!props.popUpDisplay[moveId]})}}>
        <h4>{props.currentPokemon.moves[moveId].name}</h4>
      </div>
      {props.currentPokemon.moves[moveId].categoryUrl ? 
        <img className='category-icon-small' src={props.currentPokemon.moves[moveId].categoryUrl} alt="" />
        : null
      }
      {props.opposingPokemon.name && props.currentPokemon.moves[moveId].name ?
        <h4 className={`calc-super-effective calc-super-effective-${superEffective.value.replace('.', '')}`}>{superEffective.str}</h4>
        : 
        <div className='calc-super-effective'></div>
      }
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