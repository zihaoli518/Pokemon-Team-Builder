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

const calculator = require('pokemon-stat-calculator')


import * as actions from '../../actions/actions';

import PokemonSprite from '../PokemonSprite.jsx';
import CalcEV from './calcEV.jsx';

// importing json files containing data from smogon 
import Data from '../dexData.js';
const allItemsJSON = Data.allItemsJSON;
const allMovesJSON = Data.allMovesJSON;
const natureArray = Data.natureArray;


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
  console.log('inside CalcPokemonDetails', props.team, props.pokemonCalcDataFriendly, props.pokemonCalcDataEnemy);


  const [currentPokemon, setCurrentPokemon] = useState({name: null, abilities: [{ ability: { name: "", url: "", description: "" }, is_hidden: false, slot: 0 }],
});
  const [showContent, setShowContent] = useState({matchupChart: false, damageCalculator: false, exportCurrentTeam: false, importTeam: false});
  const [once, setOnce] = useState({team: true, mon: true});

  // states keeping options 
  const [natureOptions, setNatureOptions] = useState([]);
  const [abilityOptions, setAbilityOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);

  const statOrder = ['Atk', 'Def', 'SpA', 'SpD', 'Spe']




  useEffect(() => {
    console.log('inside testing useEffect')
    console.log(currentPokemon)
    // determine which data from state to use 
    if (once.team) {
      if (props.team==='friendly') setCurrentPokemon({...props.pokemonCalcDataFriendly});
      else setCurrentPokemon({...props.pokemonCalcDataEnemy});
      setOnce({...once, team: false});
    }
    if (currentPokemon.name) {
      if (once.mon) {
        populateOptions();
        setOnce({...once, mon: false})
      }
    }
  }, [currentPokemon, ])

  const populateOptions = () => {
    // populate natures 
    const populateNature = () => {
      let newNatureOptions = [];
      const natureArray = calculator.getNatureNames;
      natureArray.forEach(name => {
        // get the short description str like (+Atk, -SpA)
        const NatureValues = calculator.getNatureValue(name);
        let DescStr = '';
        for (let i=0; i<statOrder.length; i++) {
          if (NatureValues[i] === 1.1) DescStr += ' (+' + statOrder[i] + ', '
        }
        for (let i=0; i<statOrder.length; i++) {
          if (NatureValues[i] === 0.9) DescStr += '-' + statOrder[i] +')'
        }

        newNatureOptions.push(
          <option value={name}>{name + DescStr}</option>
        )})
      setNatureOptions(newNatureOptions);
      }
    
    const populateItems = () => {
      let newItemOptions = [];
      for (let name in allItemsJSON) {
        newItemOptions.push(
          <option value={allItemsJSON[name].name}>{allItemsJSON[name].name}</option>
        )
      }
      setItemOptions(newItemOptions)
    }

    const populateAbilities = () => {
      console.log('inside populateAbilities ', currentPokemon)
      let newAbilitiesOptions = [];
      for (let i=0; i<currentPokemon.abilities.length; i++) {
        newAbilitiesOptions.push(
          <option value={currentPokemon.abilities[i].ability.name}>{currentPokemon.abilities[i].ability.name}</option>
        )
      }
      setAbilityOptions(newAbilitiesOptions)
    }

    // invoke all 3 functions 
    populateNature();
    populateItems();
    populateAbilities();
  }

  return (
    <div className={props.className}>
      {currentPokemon.name ? (
        <div className="calc-pokemon-display-inner">
          <h3>{currentPokemon.name}</h3>
          <div className="calc-sprite-container">
            <PokemonSprite
              pokemon={currentPokemon.name}
              className={"calc-sprite"}
            />
          </div>
          <div className="calc-pokemon-types-container">
            <h4>{currentPokemon.types[0]}</h4>
            <h4>{currentPokemon.types[1]}</h4>
          </div>
        </div>
      ) : (
          <div className="calc-pokemon-display-inner">
            <h3>choose a pokemon</h3>
            <div className="calc-sprite-container">
              <img
                className="calc-sprite-placeholder"
                src="https://www.clipartmax.com/png/full/185-1853692_flat-mark-circle-round-question-help-icon-question-mark-in-circle.png"
                alt=""
              />
            </div>
            <div className="calc-pokemon-types-container">
              <h4></h4>
              <h4></h4>
            </div>
          </div>
      )}

      {/* <CalcEV /> */}

      <div className="calc-details-container">
        <div className="calc-nature-container">
          <h4>nature:</h4>
          <select className="calc-nature-container" id="calc-nature-select" onChange={() => selectNature()}>
            <option value={currentPokemon.nature}>{currentPokemon.nature}</option>
            {natureOptions}
          </select>
        </div>
        <div className="calc-ability-container">
          <h4>ability:</h4>
          <select className="calc-ability-container" id="calc-ability-select" onChange={() => selectAbility()}>
            <option value={currentPokemon.abilities[0].ability.name}>{currentPokemon.abilities[0].ability.name}</option>
            {abilityOptions}
          </select>
        </div>
        <div className="calc-item-container">
          <h4>item:</h4>
          <select className="calc-item-container" id="calc-item-select" onChange={() => selectItem()}>
            <option value={currentPokemon.item}>{currentPokemon.item}</option>
            {itemOptions}
          </select>
        </div>
        <div className="calc-status-container">
          <h4>status:</h4>
          <select name="" id=""></select>
        </div>
      </div>
    </div>
  );
}







export default connect(mapStateToProps, mapDispatchToProps)(CalcPokemonDetails);