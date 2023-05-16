/**
 * ************************************
 *
 * @module CalcMovesResults
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
import CalcResultRow from './CalcResultRow.jsx';

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

const CalcMovesResults = props => {

  const [allMovesOptions, setAllMovesOptions] = useState();
  // const [modalOptions, setModalOptions] = useState({move_1: [], move_2: [], move_3: [], move_4: []});

  const [popUpDisplay, setPopUpDisplay] = useState({move_1: false, move_2: false, move_3: false, move_4: false});


  // takes two pokemon objects and a move string as input for example: 'Focus Blast' and returns a range of damage '40% - 43%'
  const calculateDamage = (attacker, defender, move) => {

  }


  // update an array of jsx for every move, for every move container in calc, update state
  const populateModal = (moveId, searchStr) => {
    
  }

  // called during every useEffect, map onclick functions to move inputs 
  const populateMoves = () => {

  }

  // function for searching moves 
  const searchAndDisplayMoves = (elementId, moveId) => {

  }



  useEffect(() => {
  }, [props.pokemonCalcDataFriendly, props.pokemonCalcDataEnemy, popUpDisplay])


  return (
    <div className='calc-results-container' >
      <div className='calc-results-summary'>
        <h4>you got OHKO'd</h4>
      </div>

      <div className='calc-results-labels'>
        <h4 className='calc-label-move'>move</h4>
        <h4 className='calc-label-basepower'>base power</h4>
        <h4 className='calc-label-damage'>damage</h4>
      </div>

      <CalcResultRow moveId={'move_1'} team={props.team} popUpDisplay={popUpDisplay} setPopUpDisplay={setPopUpDisplay} />
      <CalcResultRow moveId={'move_2'} team={props.team} popUpDisplay={popUpDisplay} setPopUpDisplay={setPopUpDisplay} />
      <CalcResultRow moveId={'move_3'} team={props.team} popUpDisplay={popUpDisplay} setPopUpDisplay={setPopUpDisplay} />
      <CalcResultRow moveId={'move_4'} team={props.team} popUpDisplay={popUpDisplay} setPopUpDisplay={setPopUpDisplay} />
 
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


export default connect(mapStateToProps, mapDispatchToProps)(CalcMovesResults);