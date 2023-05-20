/**
 * ************************************
 *
 * @module AnalysisMenu
 * @author zi 
 * @date
 * @description button to show typing charts
 *
 * ************************************
 */

// importing dependencies 
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions/actions';
import CalcPokemonDetails from './analysis-menu/CalcPokemonDetails.jsx';
import CalcMovesResults from './analysis-menu/CalcMovesResults.jsx'

import {calculate, Generations, Pokemon, Move} from '@ajhyndman/smogon-calc';
 


const mapStateToProps = state => {
  return {
    pokemonCalcDataFriendly: state.damageCalc.pokemonCalcDataFriendly,
    pokemonCalcDataEnemy: state.damageCalc.pokemonCalcDataEnemy,
  }
}

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  showTypingChart : () => dispatch(actions.showTypingChart()),
});



const DamageCalculator = props => {
  
  const [showContent, setShowContent] = useState({matchupChart: false, damageCalculator: false, exportCurrentTeam: false, importTeam: false})
  
  // const gen = Generations.get(8); // alternatively: const gen = 5;
  // const result = calculate(
  //   gen,
  //   new Pokemon(gen, 'Chien Pao', {
  //     item: 'Choice Specs',
  //     nature: 'Timid',
  //     evs: {spa: 252},
  //     boosts: {spa: 1},
  //   }),
  //   new Pokemon(gen, 'Snorlax', {
  //     item: 'Eviolite',
  //     nature: 'Calm',
  //     evs: {hp: 252, spd: 252},
  //   }),
  //   new Move(gen, 'Focus Blast')
  //   );

  //   console.log('inside DamageCalculator', result);

  const handleClick = (button) => {

  }

  return (
    <div className='damage-calculator-container' >

      <CalcPokemonDetails 
        key={props.pokemonCalcDataFriendly.name+'f'} 
        team={'friendly'} 
        className={'calc-pokemon-display-container calc-pokemon-display-container-friendly'}
      />

      <div className='calc-results friendly-calc-results'>
        <CalcMovesResults team={'friendly'}/>
      </div>

      <div className='calc-results enemy-calc-results'>
        <CalcMovesResults team={'enemy'}/>
      </div>

      <CalcPokemonDetails 
        key={props.pokemonCalcDataEnemy.name+'e'} 
        team={'enemy'}
        className={'calc-pokemon-display-container calc-pokemon-display-container-enemy'}
      />

    </div>
  );
} 







export default connect(mapStateToProps, mapDispatchToProps)(DamageCalculator);