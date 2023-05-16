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
import CalcEV from './CalcEV.jsx';

// importing json files containing data from smogon 
import Data from '../dexData.js';
const allItemsJSON = Data.allItemsJSON;
const allMovesJSON = Data.allMovesJSON;
const natureArray = Data.natureArray;
const statusArray = Data.statusArray;


const mapStateToProps = state => {
  return {
    pokemonCalcDataFriendly: state.damageCalc.pokemonCalcDataFriendly,
    pokemonCalcDataEnemy: state.damageCalc.pokemonCalcDataEnemy,
  }
}

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  changeCalcAttribute : (team, attributeName, attribute) => dispatch(actions.changeCalcAttribute(team, attributeName, attribute)),
});



const CalcPokemonDetails = props => {
  console.log('inside CalcPokemonDetails', props.team, props.pokemonCalcDataFriendly, props.pokemonCalcDataEnemy);


  const [currentPokemon, setCurrentPokemon] = useState({name: null, abilities: [{ ability: { name: "", url: "", description: "" }, is_hidden: false, slot: 0 }],});
  const [showContent, setShowContent] = useState({matchupChart: false, damageCalculator: false, exportCurrentTeam: false, importTeam: false});
  const [once, setOnce] = useState({team: true, mon: true});

  // states keeping options 
  const [natureOptions, setNatureOptions] = useState([]);
  const [abilityOptions, setAbilityOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);


  const statOrder = ['Atk', 'Def', 'SpA', 'SpD', 'Spe']




  useEffect(() => {
    // console.log('inside testing useEffect')
    // console.log(currentPokemon)
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
  }, [currentPokemon.name ])

  const populateOptions = () => {
    // populate natures 
    const populateNature = () => {
      let newNatureOptions = [];
      const natureArray = calculator.getNatureNames;
      for (let i=0; i<natureArray.length; i++) {
        const name = capitalizeFirstLetter(natureArray[i]);
        // remove duplicate because of default value 
        if (name===capitalizeFirstLetter(currentPokemon.nature)) continue;
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
        )
      }

      setNatureOptions(newNatureOptions);
      }
    
    const populateItems = () => {
      let newItemOptions = [];
      for (let name in allItemsJSON) {
        if (allItemsJSON[name].name===currentPokemon.item) continue;
        newItemOptions.push(
          <option value={allItemsJSON[name].name}>{allItemsJSON[name].name}</option>
        )
      }
      setItemOptions(newItemOptions)
    }

    const populateAbilities = () => {
      let newAbilitiesOptions = [];
      for (let i=0; i<currentPokemon.abilities.length; i++) {
        const abilityName = capitalizeWords(currentPokemon.abilities[i].ability.name);
        if (abilityName===capitalizeWords(currentPokemon.activeAbility)) continue;
        newAbilitiesOptions.push(
          <option value={abilityName}>{abilityName}</option>
        )
      }
      setAbilityOptions(newAbilitiesOptions)
    }

    const populateStatuses = () => {
      const newStatusOptions = [];
      statusArray.forEach(status => {
        newStatusOptions.push(
          <option value={capitalizeFirstLetter(status)}>{capitalizeFirstLetter(status)}</option>
        )
      });
      setStatusOptions(newStatusOptions)
    }

    // invoke all 4 functions 
    populateNature();
    populateItems();
    populateAbilities();
    populateStatuses();
  }

  const handleFocus = () => {
    const searchBar = document.getElementById('pokemon-search-name');
    const searchElement = document.getElementById('search-bar-element');
    searchBar.scrollIntoView({ behavior: 'smooth' });

    let flashing = setInterval(function() {
      searchElement.classList.toggle("search-bar-element-flashing");
    }, 220); // Flash every 250ms
  
    setTimeout(()=>{
      clearInterval(flashing);
      searchElement.classList.remove("search-bar-element-flashing");
      searchBar.focus();
    }, 1200)
  }

  // add event listeners 

  return (
    <div className={props.className} >
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
            <img src={`https://play.pokemonshowdown.com/sprites/types/${capitalizeFirstLetter(currentPokemon.types[0])}.png`} alt="" />
            {currentPokemon.types[1] ?
              <img src={`https://play.pokemonshowdown.com/sprites/types/${capitalizeFirstLetter(currentPokemon.types[1])}.png`} alt="" />
              :
              null
            }
          </div>
        </div>
      ) : (
          <div className="calc-pokemon-display-inner" onClick={() => {handleFocus()}}>
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
      

        <CalcEV team={props.team}/>


      <div className="calc-details-container">
        <div className="calc-nature-container">
          <h4>nature:</h4>
          <select className="calc-nature-container" id="calc-nature-select" onChange={(e) => props.changeCalcAttribute(props.team, 'nature', e.target.value)}>
            <option value={currentPokemon.nature}>{currentPokemon.nature}</option>
            {natureOptions}
          </select>
        </div>
        <div className="calc-ability-container">
          <h4>ability:</h4>
          <select className="calc-ability-container" id="calc-ability-select" onChange={(e) => props.changeCalcAttribute(props.team, 'ability', e.target.value)}>
            {currentPokemon.activeAbility ? 
              <option value={capitalizeWords(currentPokemon.activeAbility)}>{capitalizeWords(currentPokemon.activeAbility)}</option>
              :
              <option value={capitalizeWords(currentPokemon.abilities[0].ability.name)}>{capitalizeWords(currentPokemon.abilities[0].ability.name)}</option>
            }
            {abilityOptions}
          </select>
        </div>
        <div className="calc-item-container">
          <h4>item:</h4>
          <select className="calc-item-container" id="calc-item-select" onChange={(e) => props.changeCalcAttribute(props.team, 'item', e.target.value)}>
            <option value={currentPokemon.item}>{currentPokemon.item}</option>
            {itemOptions}
          </select>
        </div>
        <div className="calc-status-container" onChange={(e) => props.changeCalcAttribute(props.team, 'status', e.target.value)}>
          <h4>status:</h4>
          <select name="" id="">
            {statusOptions}
          </select>
        </div>
      </div>
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



export default connect(mapStateToProps, mapDispatchToProps)(CalcPokemonDetails);