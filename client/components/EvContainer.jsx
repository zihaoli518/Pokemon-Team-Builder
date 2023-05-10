/**
 * ************************************
 *
 * @module EvContainer
 * @author zi 
 * @date
 * @description EvContainer
 *
 * ************************************
 */

// importing dependencies 
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'

import { connect } from 'react-redux';

import * as actions from '../actions/actions';

const calculator = require('pokemon-stat-calculator')



const mapStateToProps = state => {
  return {
    currentPokemon: state.pokemon.currentPokemon,
    yourTeam: state.pokemon.yourTeam,
  }
}


const mapDispatchToProps = dispatch => ({
  toggleMainDivState : (str) => dispatch(actions.toggleMainDivState(str)),
  updateCalculatedStats : (evs, ivs, remainingEv, calcs) => dispatch(actions.updateCalculatedStats(evs, ivs, remainingEv, calcs)),
  updateSavedTeam: (team) => dispatch(actions.updateSavedTeam(team)),

});


const EvContainer = props => {
  console.log('inside EvContainer, ', props.currentPokemon)



  // const handleEvChange = (statStr) => {
  //   console.log('inside handleEvChange')
  //   const Evinput = Number(document.getElementById(statStr).value);
  //   if (!Evinput) return;
  //   if (statStr==="ev-input-hp") 
  //   props.setValuesOfEv({...props.valuesOfEV, hp: props.valuesOfEV.hp+Number(input)})
  // }

  const mapOnFocusOutFunctios = () => {
    console.log('inside mapOnFocusOutFunctions')
    let arrayOfInputs = document.getElementsByClassName("ev-input");
    if (!arrayOfInputs.length) return; 
    for (let i=0; i<arrayOfInputs.length; i++) {
      arrayOfInputs[i].addEventListener('change', () => {
        console.log('FOCUS OUT FUNCTION ACTIVATED!')
        console.log(arrayOfInputs[i])
        let EvInputElement = arrayOfInputs[i];
        let EvInputValue = EvInputElement.value;
        if (!EvInputValue) return;
        // run calcs and update state 
        // grab all current evs 
        let EVs = []
        for (let j=0; j<arrayOfInputs.length; j++) {
          let currentValue = arrayOfInputs[j].value;
          if (currentValue==="") currentValue = 0;
          if (currentValue>252) currentValue = 252;
          EVs.push(currentValue);
        }
        let totalEvUsed = EVs.reduce(function(a, b){
          return Number(a) + Number(b);
        });
        let remainingEv = 508 - totalEvUsed;

        let baseStats = statObjToArray(props.currentPokemon.stats)
        let IVs = [31, 31, 31, 31, 31, 31]
        let nature = calculator.getNatureValue(props.currentPokemon.nature);
        // console.log(baseStats, EVs, IVs, totalEvUsed, remainingEv, nature)
        const results = calculator.calAllStats(IVs, baseStats, EVs, props.currentPokemon.level, nature)
        // prevent unnecessaery re-renders 
        // if (props.currentPokemon.evs.array !== EVs || props.currentPokemon.ivs.array !== IVs || props.currentPokemon. calculatedStats !==)
        props.updateCalculatedStats(EVs, IVs, remainingEv, results);
        props.updateSavedTeam(props.yourTeam);

        // give style to remaining ev if below 0
        const remainingEvDisplay = document.getElementById('remaining-Ev-value'); 
        if (Number(remainingEvDisplay.innerHTML<0)) remainingEvDisplay.style.color = "red";
        else remainingEvDisplay.style.color = "black";
      })
    }
  }

  const calculateInitialStats = () => {
    const IVs = props.currentPokemon.ivs.array;
    const EVs = props.currentPokemon.evs.array;
    const baseStats = statObjToArray(props.currentPokemon.stats); 
    const nature = calculator.getNatureValue(props.currentPokemon.nature);
    console.log('after nature')
    console.log(baseStats, EVs, IVs, nature)
    const results = calculator.calAllStats(IVs, baseStats, EVs, props.currentPokemon.level, nature);
    console.log(results)
    props.updateCalculatedStats(EVs, IVs, 508, results)  
  }

  const calculateHp = (base, ev, iv, level) => {
    const hp = Math.floor(0.01 * (2*base + iv + floor(0.25*ev)) * level + level + 10);
    return hp;
  }

  const cleanUpEvs = () => {
    const evArray = document.getElementsByClassName("ev-input");
    for (let i=0; i<evArray.length; i++) {
      evArray[i].value = props.currentPokemon.evs.array[i];
    }
  }

  // trying other onchange 
  const handleEvChange = (event, index) => {
    const IVs = props.currentPokemon.ivs.array;
    // format and trim ev input
    let newEV = Number(event.target.value);
    if (newEV === NaN) return;
    if (newEV>252) newEV = 252;
    let oldEVs = props.currentPokemon.evs.array;
    let EVs = [...oldEVs];
    EVs[index] = newEV;

    const baseStats = statObjToArray(props.currentPokemon.stats); 
    const nature = calculator.getNatureValue(props.currentPokemon.nature);
    console.log(baseStats, EVs, IVs, nature)
    const results = calculator.calAllStats(IVs, baseStats, EVs, props.currentPokemon.level, nature);
    console.log(results)

    let totalEvUsed = EVs.reduce(function(a, b){
      return Number(a) + Number(b);
    });
    let remainingEv = 508 - totalEvUsed;

    const remainingEvDisplay = document.getElementById('remaining-Ev-value'); 
    if (remainingEv<0) {
      remainingEvDisplay.style.color = "red";
      // props.updateCalculatedStats(oldEVs, IVs, remainingEv, results);
      // props.updateSavedTeam(props.yourTeam);
      // return;
    }
    else remainingEvDisplay.style.color = "black";

    // update state with new values 
    props.updateCalculatedStats(EVs, IVs, remainingEv, results);
    props.updateSavedTeam(props.yourTeam);
  };


  useEffect(() => {
    console.log('inside 5/8 bug useEffect')
    // mapOnFocusOutFunctios();
    cleanUpEvs();
    if (!props.currentPokemon.calculatedStats.length) calculateInitialStats();
  }, [])


  return (
    <div className='evs-container' onClick={()=> {props.makeDivActive('evs-container', 'active-pokemon-detail-container', 'evs-container')}}>
        <h3>EVs</h3>
        <div className='ev-table-labels'>
          <h4 className='base-table-label'>base</h4>
          <h4 className='ev-table-label'>EVs</h4>
          <h4 className='iv-table-label'>IVs</h4>
        </div>
        <div className='evs-display-container'>
          <div className='hp-ev-container ev-container'>
            <h4 className='base-stat-label'>HP: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.hp}</h4>
            <input className='ev-input' id='ev-input-hp' type="text" value={props.currentPokemon.evs.array[0]} onChange={(e)=>{handleEvChange(e, 0)}}/>
            <input className='iv-input' type="text" value={31} />
            <h4 className='result-stat'>{props.currentPokemon.calculatedStats[0]}</h4>
          </div>
          <div className='attack-ev-container ev-container'>
            <h4 className='base-stat-label'>Attack: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.attack}</h4>
            <input className='ev-input' type="text" value={props.currentPokemon.evs.array[1]} onChange={(e)=>{handleEvChange(e, 1)}}/>
            <input className='iv-input' type="text" value={31} />
            <h4 className='result-stat'>{props.currentPokemon.calculatedStats[1]}</h4>
          </div>
          <div className='defense-ev-container ev-container'>
            <h4 className='base-stat-label'>Defense: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.defense}</h4>
            <input className='ev-input' type="text" value={props.currentPokemon.evs.array[2]} onChange={(e)=>{handleEvChange(e, 2)}}/>
            <input className='iv-input' type="text" value={31} />
            <h4 className='result-stat'>{props.currentPokemon.calculatedStats[2]}</h4>
          </div>
          <div className='spatk-ev-container ev-container'>
            <h4 className='base-stat-label'>Sp. Atk.: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.specialA}</h4>
            <input className='ev-input' type="text" value={props.currentPokemon.evs.array[3]} onChange={(e)=>{handleEvChange(e, 3)}}/>
            <input className='iv-input' type="text" value={31} />
            <h4 className='result-stat'>{props.currentPokemon.calculatedStats[3]}</h4>
          </div>
          <div className='spdef-ev-container ev-container'>
            <h4 className='base-stat-label'>Sp. Def.: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.specialD}</h4>
            <input className='ev-input' type="text" value={props.currentPokemon.evs.array[4]} onChange={(e)=>{handleEvChange(e, 4)}}/>
            <input className='iv-input' type="text" value={31} />
            <h4 className='result-stat'>{props.currentPokemon.calculatedStats[4]}</h4>
          </div>
          <div className='speed-ev-container ev-container'>
            <h4 className='base-stat-label'>Speed: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.speed}</h4>
            <input className='ev-input' type="text" value={props.currentPokemon.evs.array[5]} onChange={(e)=>{handleEvChange(e, 5)}}/>
            <input className='iv-input' type="text" value={31} />
            <h4 className='result-stat'>{props.currentPokemon.calculatedStats[5]}</h4>
          </div>
        </div>
    </div>
  );
}


const statObjToArray = (statObj) => {
  let array = [];
  const order = ['hp', 'attack', 'defense', 'specialA', 'specialD', 'speed']
  order.forEach(stat => {
    array.push(statObj[stat])
  })
  console.log('END OF STAT->OBJ EvContainer ', array);
  return array
}


export default connect(mapStateToProps, mapDispatchToProps)(EvContainer);