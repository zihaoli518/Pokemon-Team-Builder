/**
 * ************************************
 *
 * @module EvSliderContainer
 * @author zi 
 * @date
 * @description EvSliderContainer
 *
 * ************************************
 */

// importing dependencies 
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions/actions';

import StatChart from './StatChart.jsx';

const calculator = require('pokemon-stat-calculator')


const mapStateToProps = state => {
  return {
    currentPokemon: state.pokemon.currentPokemon,
  }
}

const mapDispatchToProps = dispatch => ({
  toggleLoginLoading : () => dispatch(actions.toggleLoginLoading()),
});


const EvSliderContainer = props => {

  const [natureOptions, setNatureOptions] = useState([])


  const populateNatures = () => {
    console.log('inside populateNatures')
    let newNatureOptions = [];
    const natureArray = calculator.getNatureNames;
    natureArray.forEach(name => {
      newNatureOptions.push(
      <option value={name}>{name}</option>
    )})
    setNatureOptions(newNatureOptions);
    console.log(newNatureOptions)
  }

  const selectNature = () => {
    const select = document.getElementById("nature-select");
    const selectedOption = select.options[select.selectedIndex].value;
    
  }


    useEffect(() => {
      populateNatures();
    }, [props.currentPokemon])


  return (
    <div className='ev-browser-area'>
      <div className='dynamic-chart-container'>
        <StatChart name={props.currentPokemon.pokemon} currentPokemon={props.currentPokemon} id={'calculated-stat-chart'}/>
        <div className='calculated-stat-chart-labels'>
          <h4 style={{color: stat2color(props.currentPokemon.calculatedStats[0], 500, 50)}}>{props.currentPokemon.calculatedStats[0]}</h4>
          <h4 style={{color: stat2color(props.currentPokemon.calculatedStats[1], 500, 50)}}>{props.currentPokemon.calculatedStats[1]}</h4>
          <h4 style={{color: stat2color(props.currentPokemon.calculatedStats[2], 500, 50)}}>{props.currentPokemon.calculatedStats[2]}</h4>
          <h4 style={{color: stat2color(props.currentPokemon.calculatedStats[3], 500, 50)}}>{props.currentPokemon.calculatedStats[3]}</h4>
          <h4 style={{color: stat2color(props.currentPokemon.calculatedStats[4], 500, 50)}}>{props.currentPokemon.calculatedStats[4]}</h4>
          <h4 style={{color: stat2color(props.currentPokemon.calculatedStats[5], 500, 50)}}>{props.currentPokemon.calculatedStats[5]}</h4>
        </div>
      </div>

      <div className='nature-container'>
        <h4>nature: </h4>
        <select name="" id="nature-select" onChange={() => selectNature()}>
          <option value={props.currentPokemon.nature}>{props.currentPokemon.nature}</option>
          {natureOptions}
        </select>
      </div>

      <div className='ev-sliders-container'>
        <div className='ev-slider-container'>
          <h4>HP :</h4>
          <input type="range" min="0" max="252" value={props.valuesOfEV.hp} class="slider" id="myRange" />
        </div>
        <div className='ev-slider-container'>
          <h4>Attak :</h4>
          <input type="range" min="0" max="252" value={props.valuesOfEV.attack} class="slider" id="myRange" />
        </div>
        <div className='ev-slider-container'>
          <h4>Defense :</h4>
          <input type="range" min="0" max="252" value={props.valuesOfEV.defense} class="slider" id="myRange" />
        </div>
        <div className='ev-slider-container'>
          <h4>Sp. Atk. :</h4>
          <input type="range" min="0" max="252" value={props.valuesOfEV.specialA} class="slider" id="myRange" />
        </div>
        <div className='ev-slider-container'>
          <h4>Sp. Def. :</h4>
          <input type="range" min="0" max="252" value={props.valuesOfEV.specialD} class="slider" id="myRange" />
        </div>
        <div className='ev-slider-container'>
          <h4>Speed :</h4>
          <input type="range" min="0" max="252" value={props.valuesOfEV.speed} class="slider" id="myRange" />
        </div>
      </div>
    </div>
  );
}

 // helper function for generating color based on value 
 function stat2color(stat, max = maxStat, min = minStat) {
  // perc ranges from 0-100 and is responsible for the color scale 
  let perc;
  if (stat > max) perc = 100;
  else if (stat < min) perc = 0;
  else perc = (stat / (max / 100));

  var r,g,b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  } else {
    g = 255;
    r = Math.round(510 - 5.1 * perc);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  return "#" + ("000000" + h.toString(16)).slice(-6);
}


export default connect(mapStateToProps, mapDispatchToProps)(EvSliderContainer);