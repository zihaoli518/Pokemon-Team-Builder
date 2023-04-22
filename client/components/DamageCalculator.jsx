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
import CalcPokemonDisplay from './analysis-menu/CalcPokemonDisplay.jsx';

import {calculate, Generations, Pokemon, Move} from '@smogon/calc';
 


const mapStateToProps = state => {
  return {
    teamStatus: state.pokemon.teamStatus,
    showTypingChart: state.pokemon.showTypingChart,
  }
}

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  showTypingChart : () => dispatch(actions.showTypingChart()),
});



const DamageCalculator = props => {
  console.log('inside DamageCalculator');

  const [showContent, setShowContent] = useState({matchupChart: false, damageCalculator: false, exportCurrentTeam: false, importTeam: false})

  const gen = Generations.get(8); // alternatively: const gen = 5;
  const result = calculate(
    gen,
    new Pokemon(gen, 'Gengar', {
      item: 'Choice Specs',
      nature: 'Timid',
      evs: {spa: 252},
      boosts: {spa: 1},
    }),
    new Pokemon(gen, 'Chansey', {
      item: 'Eviolite',
      nature: 'Calm',
      evs: {hp: 252, spd: 252},
    }),
    new Move(gen, 'Focus Blast')
  );

  console.log(result)

  const handleClick = (button) => {

  }

  return (
    <div className='damage-calculator-container'>

      <CalcPokemonDisplay team='friendly' className={'calc-pokemon-display-container calc-pokemon-display-container-friendly'}/>

      <div className='friendly-calc-results'>

      </div>

      <div className='enemy-calc-results'>

      </div>

      <CalcPokemonDisplay team='enemy' className={'calc-pokemon-display-container calc-pokemon-display-container-enemy'}/>

    </div>
  );
} 







export default connect(mapStateToProps, mapDispatchToProps)(DamageCalculator);