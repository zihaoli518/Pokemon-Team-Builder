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
  updateNature : (nature) => dispatch(actions.updateNature(nature)),
  updateCalculatedStats : (evs, ivs, remainingEv, calcs) => dispatch(actions.updateCalculatedStats(evs, ivs, remainingEv, calcs)),
});


const EvSliderContainer = props => {

  const [natureOptions, setNatureOptions] = useState([]);
  const [currentNatureStr, setCurrentNatureStr] = useState('serious');

  const statOrder = ['Atk', 'Def', 'SpA', 'SpD', 'Spe'];

  const populateNatures = () => {
    console.log('inside populateNatures')
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
    // console.log(newNatureOptions)
  }

  const selectNature = () => {
    console.log('inside selectNature')
    const select = document.getElementById("nature-select");
    const selectedOption = select.options[select.selectedIndex].value;

    props.updateNature(selectedOption);

    let baseStats = statObjToArray(props.currentPokemon.stats)
    let IVs = props.currentPokemon.ivs.array;
    let EVs = props.currentPokemon.evs.array;
    let nature = calculator.getNatureValue(selectedOption);

    console.log(baseStats, EVs, IVs, nature)
    const results = calculator.calAllStats(IVs, baseStats, EVs, props.currentPokemon.level, nature)
    props.updateCalculatedStats(EVs, IVs, props.currentPokemon.remainingEv ,results);
  }

  const handleSlider = (slider) => {          
    // give style to remaining ev if below 0
    const remainingEvDisplay = document.getElementById('remaining-Ev-value'); 
    if (Number(remainingEvDisplay.innerHTML)<0) remainingEvDisplay.style.color = "red";
    else remainingEvDisplay.style.color = "black";
    
    const currentSlider = document.getElementById(slider);
    const sliderOrder = ['hp-slider', 'attack-slider', 'defense-slider', 'specialA-slider', 'specialD-slider', 'speed-slider'];
    const index = sliderOrder.indexOf(slider);
    if (props.currentPokemon.remainingEv<=0 && currentSlider.value>props.currentPokemon.evs.array[index]) {
      alert('exceeded total EV allowed');
      remainingEvDisplay.style.color = "red";
      return
    }
    const ArrayOfSliders = document.getElementsByClassName("slider");
    const EVs = [];
    for (let i=0; i<ArrayOfSliders.length; i++) {
      const value = ArrayOfSliders[i].value;
      EVs.push(value);
    }

    let baseStats = statObjToArray(props.currentPokemon.stats)
    let IVs = props.currentPokemon.ivs.array;
    let nature = calculator.getNatureValue(props.currentPokemon.nature);
    // calculate remaining EVs
    let totalEvUsed = EVs.reduce(function(a, b){
      return Number(a) + Number(b);
    });
    let remainingEv = 508 - totalEvUsed;

    const results = calculator.calAllStats(IVs, baseStats, EVs, props.currentPokemon.level, nature)
    props.updateCalculatedStats(EVs, IVs, remainingEv, results);
  }

  const updateCurrentNature = () => {
    // get the short description str like (+Atk, -SpA)
    const NatureValues = calculator.getNatureValue(props.currentPokemon.nature);
    let DescStr = props.currentPokemon.nature;
    for (let i=0; i<statOrder.length; i++) {
      if (NatureValues[i] === 1.1) DescStr += ' (+' + statOrder[i] + ', '
    }
    for (let i=0; i<statOrder.length; i++) {
      if (NatureValues[i] === 0.9) DescStr += '-' + statOrder[i] +')'
    }
    setCurrentNatureStr(DescStr);
  }


    useEffect(() => {
      populateNatures();
    }, [props.currentPokemon]);

    // for updating selected nature 
    useEffect(() => {
      updateCurrentNature();
    }, [props.currentPokemon.nature])


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
          <option value={props.currentPokemon.nature}>{currentNatureStr}</option>
          {natureOptions}
        </select>
      </div>

      <div className='remaining-ev-container'>
        <h4>remaining EVs:</h4>
        <h5 id='remaining-Ev-value'>{props.currentPokemon.remainingEv}</h5>
      </div>

      <div className='ev-sliders-container'>
        <div className='ev-slider-container'>
          <h4>HP :</h4>
          <input type="range" step="4" min="0" max="252" value={props.currentPokemon.evs.array[0]} class="slider" id="hp-slider" onChange={()=>{handleSlider("hp-slider" )}}/>
        </div>
        <div className='ev-slider-container'>
          <h4>Attak :</h4>
          <input type="range" step="4" min="0" max="252" value={props.currentPokemon.evs.array[1]} class="slider" id="attack-slider" onChange={()=>{handleSlider("attack-slider")}}/>        
        </div>
        <div className='ev-slider-container'>
          <h4>Defense :</h4>
          <input type="range" step="4" min="0" max="252" value={props.currentPokemon.evs.array[2]} class="slider" id="defense-slider" onChange={()=>{handleSlider("defense-slider")}}/>
        </div>
        <div className='ev-slider-container'>
          <h4>Sp. Atk. :</h4>
          <input type="range" step="4" min="0" max="252" value={props.currentPokemon.evs.array[3]} class="slider" id="specialA-slider" onChange={()=>{handleSlider("specialA-slider")}}/>
        </div>
        <div className='ev-slider-container'>
          <h4>Sp. Def. :</h4>
          <input type="range" step="4" min="0" max="252" value={props.currentPokemon.evs.array[4]} class="slider" id="specialD-slider" onChange={()=>{handleSlider("specialD-slider")}}/>
        </div>
        <div className='ev-slider-container'>
          <h4>Speed :</h4>
          <input type="range" step="4"  min="0" max="252" value={props.currentPokemon.evs.array[5]} class="slider" id="speed-slider" onChange={()=>{handleSlider("speed-slider")}}/>
        </div>
      </div>

      <div className='ev-used-container'>
        <h4 className='ev-used'>{props.currentPokemon.evs.array[0]}</h4>
        <h4 className='ev-used'>{props.currentPokemon.evs.array[1]}</h4>
        <h4 className='ev-used'>{props.currentPokemon.evs.array[2]}</h4>
        <h4 className='ev-used'>{props.currentPokemon.evs.array[3]}</h4>
        <h4 className='ev-used'>{props.currentPokemon.evs.array[4]}</h4>
        <h4 className='ev-used'>{props.currentPokemon.evs.array[5]}</h4>
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

const statObjToArray = (statObj) => {
  let array = [];
  const order = ['hp', 'attack', 'defense', 'specialA', 'specialD', 'speed']
  order.forEach(stat => {
    array.push(statObj[stat])
  })
  console.log('END OF STAT->OBJ ', array);
  return array
}


export default connect(mapStateToProps, mapDispatchToProps)(EvSliderContainer);