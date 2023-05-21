/**
 * ************************************
 *
 * @module SpeedTier
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


import {calculate, Generations, Pokemon, Move} from '@ajhyndman/smogon-calc';
const calculator = require('pokemon-stat-calculator')

import { elements } from 'chart.js';
 


const mapStateToProps = state => {
  return {
    yourTeam: state.pokemon.yourTeam,
    enemyTeam: state.pokemon.enemyTeam
  }
}

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  showTypingChart : () => dispatch(actions.showTypingChart()),
});



const SpeedTier = props => {
  
  const [speedOrderDisplay, setSpeedOrderDisplay] = useState([]);
  const [friendlyMons, setFriendlyMons] = useState([]);
  const [enemyMons, setEnemyMons] =useState([]);



  const populateSpeedOrder = () => {
    const speedOrder = [];

    const determineOrder = () => {
      const arrayOfObj = [];
      appendNoneNullToArray(props.yourTeam, 'yourTeam', arrayOfObj);
      appendNoneNullToArray(props.enemyTeam, 'enemyTeam', arrayOfObj);
      arrayOfObj.sort((a, b) => {
        const speedA = a.baseSpeed;
        const speedB = b.baseSpeed;
        if (speedA > speedB) {
          return -1; 
        } else if (speedB < speedA) {
          return 1; 
        } else {
          return 0; 
        }
      });
      return arrayOfObj;
    }

    const appendNoneNullToArray = (team, teamStr, array) => {
      for (let i=1; i<=6; i++) {
        if (team['mon'+i]) array.push({
          name: team['mon'+i].pokemon,
          baseSpeed: team['mon'+i].stats.speed,
          teamStr: teamStr
        })
      }
    }

    const sortedArray = determineOrder();
    sortedArray.forEach(element => {
      speedOrder.push(
        <div key={Math.random()} className={`speed-order-member`}>
          <PokemonSprite key={element.name} pokemon={element.name} className={`speed-tier-order-sprite speed-order-member-${element.teamStr}`} />
          <h4 style={{color : stat2color(element.baseSpeed, 110, 20)}}>{element.baseSpeed}</h4>
        </div>
      )
    });

    setSpeedOrderDisplay(speedOrder);
  }

  const populateSpeedTier = (team, className) => {
    const newArray = [];
    const defaultIV = [31,31,31,31,31,31]
    if (className==='friendly-speed-tier-row') {
      for (let i=1; i<=6; i++) {
        if (!team['mon'+i]) continue;   
        // determine speed range 
        console.log(i, team['mon'+i])
        const baseStats = statObjToArray(team['mon'+i].stats)
        const lowest = calculator.calAllStats(defaultIV, baseStats, [0,0,0,0,0,0], 100, 'Brave');
        const highest = calculator.calAllStats(defaultIV, baseStats, [0,0,0,0,0, 252], 100, 'Jolly');
        
        const speedRange = `${lowest[5]} - ${highest[5]}`

        newArray.push(
        <div className={'speed-tier-row ' + className}>
          <PokemonSprite key={team['mon'+i].pokemon} pokemon={team['mon'+i].pokemon} className={'speed-tier-range-sprite'} />
          <h4>{speedRange}</h4>
        </div>
      )}
      setFriendlyMons(newArray);
      return;
    } else {
      for (let i=1; i<=6; i++) {
        if (!team['mon'+i]) continue;   
        // determine speed range 
        const baseStats = statObjToArray(team['mon'+i].stats)
        const lowest = calculator.calAllStats(defaultIV, baseStats, [0,0,0,0,0,0], 100, 'Brave');
        const highest = calculator.calAllStats(defaultIV, baseStats, [0,0,0,0,0, 252], 100, 'Jolly');
        
        const speedRange = `${lowest[5]} - ${highest[5]}`

        newArray.push(
        <div className={'speed-tier-row ' + className}>
          <h4>{speedRange}</h4>
          <PokemonSprite key={team['mon'+i].pokemon} pokemon={team['mon'+i].pokemon} className={'speed-tier-range-sprite'} />
        </div>
      )}
      setEnemyMons(newArray);
    }

  }

  useEffect(() => {
    populateSpeedOrder();
    populateSpeedTier(props.yourTeam, 'friendly-speed-tier-row');
    populateSpeedTier(props.enemyTeam, 'enemy-speed-tier-row');

  }, [props.yourTeam, props.enemyTeam])


  return (
    <div className='speed-tier-container' >
      <div className='speed-order-container'>
        <h3 className='speed-tier-order-label'>base speed : </h3>
        {speedOrderDisplay}
      </div>

      <div className='team-speed-container'>
        <div className='friendly-speed-tier'>
          {friendlyMons}
        </div>
        <div className='enemy-speed-tier'>
          {enemyMons}
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
  const order = ['hp', 'attack', 'defense', 'specialA', 'specialD', 'speed']
  order.forEach(stat => {
    array.push(statObj[stat])
  })
  return array
}




export default connect(mapStateToProps, mapDispatchToProps)(SpeedTier);