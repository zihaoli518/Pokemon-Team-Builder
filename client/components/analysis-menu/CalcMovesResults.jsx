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

const calculator = require('pokemon-stat-calculator')



const mapStateToProps = (state, ownProps) => {
  const pokemonCalcDataFriendly = state.damageCalc.pokemonCalcDataFriendly
  const pokemonCalcDataEnemy = state.damageCalc.pokemonCalcDataEnemy;

  const currentPokemon = (ownProps.team==='friendly') ? pokemonCalcDataFriendly : pokemonCalcDataEnemy;

  return {
    currentPokemon: currentPokemon
  }
}


const mapDispatchToProps = dispatch => ({
  updateCalculatedStatsCalc : (team, evs, results) => dispatch(actions.updateCalculatedStatsCalc(team, evs, results)),
  updateSavedTeam: (team) => dispatch(actions.updateSavedTeam(team)),
});

const statOrder = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']

const CalcMovesResults = props => {



  return (
    <div className='evs-container calc-ev-container' >

    </div>
  );
}


const statObjToArray = (statObj) => {
  let array = [];
  const order = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']
  order.forEach(stat => {
    array.push(statObj[stat])
  })
  console.log('END OF STAT->OBJ CalcEV', array);
  return array
}



export default connect(mapStateToProps, mapDispatchToProps)(CalcMovesResults);