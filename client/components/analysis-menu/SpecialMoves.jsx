/**
 * ************************************
 *
 * @module SpecialMoves
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
const calculator = require('pokemon-stat-calculator');

import Data from '../dexData.js';
const allMovesJSON = Data.allMovesJSON;
const specialMovesObj = Data.specialMovesObj;
 


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



const SpecialMoves = props => {
  
  const [friendlySpecialMoves, setFriendlySpecialMoves] = useState([]);
  const [enemySpecialMoves, setEnemySpecialMoves] = useState([]);

  const populateSpecialMoves = (team, teamStr) => {
    console.log('inside populateSpecialMoves');
    const newSpecialMoves = [];
    const specialCategoriesArray = Object.keys(specialMovesObj);
    console.log(specialCategoriesArray);

    // each loop is for a category of special moves 
    for (let i=0; i<specialCategoriesArray.length; i++) {
      const category = specialCategoriesArray[i];
      const arrayOfPokemonJsx = [];

      // check which pokemon in the current team has this type of special moves 
      for (let j=1; j<=6; j++) {
        if (!team['mon'+j]) continue;
        const currentMon = team['mon'+j];
        for (let move in currentMon.movePool) {
          console.log(category, currentMon.pokemon, capitalizeWords(move), specialMovesObj[category][capitalizeWords(move)])
          if (specialMovesObj[category][capitalizeWords(move)]) arrayOfPokemonJsx.push(
            <div className='special-move-row'>
              <PokemonSprite pokemon={currentMon.pokemon} className={'special-moves-sprite'} />
              <h4>{capitalizeWords(move)}</h4>
            </div>
          )
        }
      }


      newSpecialMoves.push(
        <div className='special-move-container'>
          <h4 className='special-category-label'>{category}</h4>
          <div className='special-move-inner'>
            {arrayOfPokemonJsx}
          </div>
          <h5 className={'special-move-category-counter counter-'+teamStr}>{arrayOfPokemonJsx.length}</h5>
        </div>
      )
    }

    if (teamStr === 'friendly') setFriendlySpecialMoves(newSpecialMoves);
    else setEnemySpecialMoves(newSpecialMoves);
  }



  useEffect(() => {
    populateSpecialMoves(props.yourTeam, 'friendly');
    populateSpecialMoves(props.enemyTeam, 'enemy');

  }, [props.yourTeam, props.enemyTeam])


  return (
    <div className='special-moves-container' >
      <div className='friendly-special-moves-container'>
        {friendlySpecialMoves}
      </div>

      <div className='enemy-special-moves-container'>
        {enemySpecialMoves}
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

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, function(match) {
    return match.toUpperCase();
  }).replace(/-/g, ' ');
}




export default connect(mapStateToProps, mapDispatchToProps)(SpecialMoves);