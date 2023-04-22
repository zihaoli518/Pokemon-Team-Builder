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

import * as actions from '../../actions/actions';

import PokemonSprite from '../PokemonSprite.jsx';
import CalcEV from './calcEV.jsx';



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



const CalcPokemonDetails = props => {
  console.log('inside CalcPokemonDetails', props.team);


  const [currentPokemon, setCurrentPokemon] = useState({name: null});
  const [showContent, setShowContent] = useState({matchupChart: false, damageCalculator: false, exportCurrentTeam: false, importTeam: false});
  const [once, setOnce] = useState(true);


  useEffect(() => {
    // determine which data from state to use 
    if (once) {
      if (props.team==='friendly') setCurrentPokemon({...props.pokemonCalcDataFriendly});
      else setCurrentPokemon({...props.pokemonCalcDataEnemy});
      setOnce(false);
    }
  })

  const handleClick = (button) => {

  }

  return (
    <div className={props.className}>
      {currentPokemon.name ?
        <div className='calc-pokemon-display-inner'>
          <h3>{currentPokemon.name}</h3>
          <div className='calc-pokemon-display-inner'>
            <div className='calc-pokemon-display-top-row'>
              <div className='calc-sprite-container'>
                <PokemonSprite pokemon={currentPokemon.name} className={'calc-sprite'}/>
              </div>
              <div className='calc-pokemon-types-container'>
                <h4>{currentPokemon.types[0]}</h4>
                <h4>{currentPokemon.types[1]}</h4>
              </div>
            </div>

            {/* <CalcEV /> */}

            <div className='calc-details-container'>
              <div className='calc-nature-container'>
                <h4>nature:</h4>
                <select name="" id=""></select>
              </div>
              <div className='calc-ability-container'>
                <h4>ability:</h4>
                <select name="" id=""></select>
              </div>
              <div className='calc-item-container'>
                <h4>item:</h4>
                <select name="" id=""></select>
              </div>
              <div className='calc-status-container'>
                <h4>status:</h4>
                <select name="" id=""></select>
              </div>
            </div>
          </div>
        </div> 
        : null
      }
    </div>
  );
}







export default connect(mapStateToProps, mapDispatchToProps)(CalcPokemonDetails);