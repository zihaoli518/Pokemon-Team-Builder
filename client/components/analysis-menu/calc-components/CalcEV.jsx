/**
 * ************************************
 *
 * @module CalcEV
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

import * as actions from '../../../actions/actions';

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

const CalcEV = props => {
  
  // const [currentPokemon, setCurrentPokemon] = useState({name: null,
  //   types: [],
  //   nature: 'serious',
  //   abilities: [{ ability: { name: "", url: "", description: "" }, is_hidden: false, slot: 0 }],
  //   activeAbility: '',
  //   item: '',
  //   status: 'healthy',
  //   stats: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
  //   calculatedStats: [0, 0, 0, 0, 0, 0],
  //   evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
  //   boosts: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
  //   moves: {
  //     move_1: null,
  //     move_2: null,
  //     move_3: null,
  //     move_4: null,
  //   },});
  const [once, setOnce] = useState({team: true, mon: true});
  console.log('inside CalcEV, ', props.team, props.currentPokemon)
    
  useEffect(() => {
    // console.log('inside testing useEffect')
    // console.log(currentPokemon)
    // // determine which data from state to use 
    // if (once.team) {
    //   if (props.team==='friendly') setCurrentPokemon(props.pokemonCalcDataFriendly);
    //   else setCurrentPokemon(props.pokemonCalcDataEnemy);
    //   setOnce({...once, team: false});
    // }
  }, [])


  const handleEvChange = (event, index) => {
    const evChangeHelper = (event, index) => {
      const IVs = [];
      const EVs = [];
      for (let i=0; i<statOrder.length; i++) {
        IVs.push(31);
        EVs.push(props.currentPokemon.evs[statOrder[i]]);
      }
      // format and trim ev input
      let newEV = Number(event.target.value);
      if (newEV === NaN) return;
      if (newEV>252) newEV = 252;
  
      EVs[index] = newEV;
  
      const baseStats = statObjToArray(props.currentPokemon.stats); 
      const nature = calculator.getNatureValue(props.currentPokemon.nature);
      console.log(baseStats, EVs, IVs, nature)
      const results = calculator.calAllStats(IVs, baseStats, EVs, 100, nature);
      console.log(results)
  
      let remainingEv = ''
  
      // update state with new values 
      props.updateCalculatedStatsCalc(props.team, EVs, results);
    }
    // debounce(evChangeHelper(event, index), 1000)
    evChangeHelper(event, index)
  };




  return (
    <div className='evs-container calc-ev-container' >
        <div className='ev-table-labels'>
          <h4 className='base-table-label'>base</h4>
          <h4 className='ev-table-label'>EVs</h4>
          <h4 className='iv-table-label'>IVs</h4>
        </div>
        <div className='evs-display-container'>
          <div className='hp-ev-container ev-container'>
            <h4 className='base-stat-label'>HP: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.hp}</h4>
            <input className='calc-ev-input' id='ev-input-hp' type="text" value={props.currentPokemon.evs.hp} onChange={(e)=>{handleEvChange(e, 0)}}/>
            <input className='calc-iv-input' type="text" value={31} />
            <h4 className='result-stat' key={props.currentPokemon.calculatedStats[0]} style={{color: stat2color(props.currentPokemon.calculatedStats[0], 500, 50)}}>{props.currentPokemon.calculatedStats[0]}</h4>
          </div>
          <div className='attack-ev-container ev-container'>
            <h4 className='base-stat-label'>Attack: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.atk}</h4>
            <input className='calc-ev-input' type="text" value={props.currentPokemon.evs.atk} onChange={(e)=>{handleEvChange(e, 1)}}/>
            <input className='calc-iv-input' type="text" value={31} />
            <h4 className='result-stat' key={props.currentPokemon.calculatedStats[1]} style={{color: stat2color(props.currentPokemon.calculatedStats[1], 500, 50)}}> {props.currentPokemon.calculatedStats[1]}</h4>
          </div>
          <div className='defense-ev-container ev-container'>
            <h4 className='base-stat-label'>Defense: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.def}</h4>
            <input className='calc-ev-input' type="text" value={props.currentPokemon.evs.def} onChange={(e)=>{handleEvChange(e, 2)}}/>
            <input className='calc-iv-input' type="text" value={31} />
            <h4 className='result-stat' key={props.currentPokemon.calculatedStats[2]} style={{color: stat2color(props.currentPokemon.calculatedStats[2], 500, 50)}}> {props.currentPokemon.calculatedStats[2]}</h4>
          </div>
          <div className='spatk-ev-container ev-container'>
            <h4 className='base-stat-label'>Sp. Atk.: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.spa}</h4>
            <input className='calc-ev-input' type="text" value={props.currentPokemon.evs.spa} onChange={(e)=>{handleEvChange(e, 3)}}/>
            <input className='calc-iv-input' type="text" value={31} />
            <h4 className='result-stat' key={props.currentPokemon.calculatedStats[3]} style={{color: stat2color(props.currentPokemon.calculatedStats[3], 500, 50)}}>{props.currentPokemon.calculatedStats[3]}</h4>
          </div>
          <div className='spdef-ev-container ev-container'>
            <h4 className='base-stat-label'>Sp. Def.: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.spd}</h4>
            <input className='calc-ev-input' type="text" value={props.currentPokemon.evs.spd} onChange={(e)=>{handleEvChange(e, 4)}}/>
            <input className='calc-iv-input' type="text" value={31} />
            <h4 className='result-stat' key={props.currentPokemon.calculatedStats[4]} style={{color: stat2color(props.currentPokemon.calculatedStats[4], 500, 50)}}>{props.currentPokemon.calculatedStats[4]}</h4>
          </div>
          <div className='speed-ev-container ev-container'>
            <h4 className='base-stat-label'>Speed: </h4>
            <h4 className='base-stat'>{props.currentPokemon.stats.spe}</h4>
            <input className='calc-ev-input' type="text" value={props.currentPokemon.evs.spe} onChange={(e)=>{handleEvChange(e, 5)}}/>
            <input className='calc-iv-input' type="text" value={31} />
            <h4 className='result-stat' key={props.currentPokemon.calculatedStats[5]} style={{color: stat2color(props.currentPokemon.calculatedStats[5], 500, 50)}}>{props.currentPokemon.calculatedStats[5]}</h4>
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

const statObjToArray = (statObj) => {
  let array = [];
  const order = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']
  order.forEach(stat => {
    array.push(statObj[stat])
  })
  console.log('END OF STAT->OBJ CalcEV', array);
  return array
}



function debounce(func, delay) {
  let timeoutId;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CalcEV);