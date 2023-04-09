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

  }
}


const mapDispatchToProps = dispatch => ({
  toggleMainDivState : (str) => dispatch(actions.toggleMainDivState(str)),
  updateCalculatedStats : (evs, ivs, calcs) => dispatch(actions.updateCalculatedStats(evs, ivs, calcs)),
});


const EvContainer = props => {
  console.log('inside EvContainer, ', props.currentPokemon)



  const handleEvChange = (statStr) => {
    console.log('inside handleEvChange')
    const Evinput = Number(document.getElementById(statStr).value);
    if (!Evinput) return;
    if (statStr==="ev-input-hp") 
    props.setValuesOfEv({...props.valuesOfEV, hp: props.valuesOfEV.hp+Number(input)})
  }

  const mapOnFocusOutFunctios = () => {
    let arrayOfInputs = document.getElementsByClassName("ev-input");
    if (!arrayOfInputs.length) return; 
    for (let i=0; i<arrayOfInputs.length; i++) {
      arrayOfInputs[i].addEventListener('focusout', () => {
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

        let baseStats = statObjToArray(props.currentPokemon.stats)
        let IVs = [31, 31, 31, 31, 31, 31]
        let nature = calculator.getNatureValue(props.currentPokemon.nature);

        console.log(baseStats, EVs, IVs, nature)
        const results = calculator.calAllStats(IVs, baseStats, EVs, props.currentPokemon.level, nature)
        console.log(results)
        props.updateCalculatedStats(EVs, IVs, results)
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
    props.updateCalculatedStats(EVs, IVs, results)  
  }

  const calculateHp = (base, ev, iv, level) => {
    const hp = Math.floor(0.01 * (2*base + iv + floor(0.25*ev)) * level + level + 10);
    return hp;
  }

  const calculateStat = (base, ev, iv, level) => {
    const stat = Math.floor(0.01 * (2*base + iv + floor(0.25*ev)) * level + level + 10);
    return stat;
  }

  const calculateStats = () => {

  }

  useEffect(() => {
    mapOnFocusOutFunctios();
    if (!props.currentPokemon.calculatedStats.length) calculateInitialStats();
  }, [props.currentPokemon])


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
            <input className='ev-input' id='ev-input-hp' type="text" defaultValue={props.currentPokemon.evs.array[0] }/>
            <input className='iv-input' type="text" value={31} />
            <h4 className='result-stat'>{props.currentPokemon.calculatedStats[0]}</h4>
          </div>
          <div className='attack-ev-container ev-container'>
            <h4 className='base-stat-label'>Attack: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.attack}</h4>
            <input className='ev-input' type="text" defaultValue={props.currentPokemon.evs.array[1]}/>
            <input className='iv-input' type="text" value={31} />
            <h4 className='result-stat'>{props.currentPokemon.calculatedStats[1]}</h4>
          </div>
          <div className='defense-ev-container ev-container'>
            <h4 className='base-stat-label'>Defense: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.defense}</h4>
            <input className='ev-input' type="text" defaultValue={props.currentPokemon.evs.array[2]}/>
            <input className='iv-input' type="text" value={31} />
            <h4 className='result-stat'>{props.currentPokemon.calculatedStats[2]}</h4>
          </div>
          <div className='spatk-ev-container ev-container'>
            <h4 className='base-stat-label'>Sp. Atk.: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.specialA}</h4>
            <input className='ev-input' type="text" defaultValue={props.currentPokemon.evs.array[3]} />
            <input className='iv-input' type="text" value={31} />
            <h4 className='result-stat'>{props.currentPokemon.calculatedStats[3]}</h4>
          </div>
          <div className='spdef-ev-container ev-container'>
            <h4 className='base-stat-label'>Sp. Def.: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.specialD}</h4>
            <input className='ev-input' type="text" defaultValue={props.currentPokemon.evs.array[4]}/>
            <input className='iv-input' type="text" value={31} />
            <h4 className='result-stat'>{props.currentPokemon.calculatedStats[4]}</h4>
          </div>
          <div className='speed-ev-container ev-container'>
            <h4 className='base-stat-label'>Speed: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.speed}</h4>
            <input className='ev-input' type="text" defaultValue={props.currentPokemon.evs.array[5]}/>
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
  console.log('END OF STAT->OBJ ', array);
  return array
}


export default connect(mapStateToProps, mapDispatchToProps)(EvContainer);