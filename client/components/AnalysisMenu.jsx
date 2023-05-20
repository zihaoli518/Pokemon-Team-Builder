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

import * as actions from '../actions/actions';

import DamageCalculator from './analysis-menu/DamageCalculator.jsx'
import MatchupChart from './analysis-menu/MatchupChart.jsx';
import SpeedTier from './analysis-menu/SpeedTier.jsx';


const mapStateToProps = state => {
  return {
    teamStatus: state.pokemon.teamStatus,
    showTypingChart: state.pokemon.showTypingChart,
    pokemonCalcDataFriendly: state.damageCalc.pokemonCalcDataFriendly,
    pokemonCalcDataEnemy: state.damageCalc.pokemonCalcDataEnemy,
  }
}

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  showTypingChart : () => dispatch(actions.showTypingChart()),
});



const AnalysisMenu = props => {

  const [showContent, setShowContent] = useState({matchupChart: false, damageCalculator: false, speedTier: false, specialMoves: false, exportCurrentTeam: false, importTeam: false})
  const [className, setClassName] = useState({matchupChart: 'menu-button', damageCalculator: 'menu-button', speedTier: 'menu-button', specialMoves: 'menu-button', exportCurrentTeam: 'menu-button', importTeam: 'menu-button'})


  const handleClick = (button) => {
    console.log('inside handleclick', button)
    if (button==='show-matchup-chart-button') {
      // let chart = document.getElementById("matchup-chart")
      // if (chart) removeFadeOut(chart, 300);
      setShowContent(falsifyAllExcept(showContent, 'matchupChart', true, false));
      setClassName(falsifyAllExcept(className, 'matchupChart', 'menu-button menu-button-active', 'menu-button'));
    } else if (button==='show-damage-calculator-button') {
      setShowContent(falsifyAllExcept(showContent, 'damageCalculator', true, false));
      setClassName(falsifyAllExcept(className, 'damageCalculator', 'menu-button menu-button-active', 'menu-button'));
    } else if (button==='show-speed-tier-button') {
      setShowContent(falsifyAllExcept(showContent, 'speedTier', true, false));
      setClassName(falsifyAllExcept(className, 'speedTier', 'menu-button menu-button-active', 'menu-button'));
    } else if (button==='specialMoves') {
      setShowContent(falsifyAllExcept(showContent, 'specialMoves', true, false));
      setClassName(falsifyAllExcept(className, 'specialMoves', 'menu-button menu-button-active', 'menu-button'));
    } else if (button==='import-team-button') {
      
    }
  }

  useEffect(() => {
    if (props.pokemonCalcDataFriendly.name || props.pokemonCalcDataEnemy.name) handleClick('show-damage-calculator-button');
  }, [props.pokemonCalcDataFriendly.name, props.pokemonCalcDataEnemy.name])


  return (
    <div className='analysis-menu-and-content-container'>
      <div className='analysis-menu'>
          <button className={className.matchupChart} id='show-matchup-chart-button' onClick={(e)=>{handleClick(e.target.id)}}>matchup chart</button> 
          <button className={className.damageCalculator} id='show-damage-calculator-button' onClick={(e)=>{handleClick(e.target.id)}}>damage calculator</button> 
          <button className={className.speedTier} id='show-speed-tier-button' onClick={(e)=>{handleClick(e.target.id)}}>speed tiers</button> 
          <button className={className.specialMoves} id='show-damage-special-moves-button' onClick={(e)=>{handleClick(e.target.id)}}>special moves</button> 
          <button className={className.exportCurrentTeam} id='export-current-team-button' onClick={(e)=>{handleClick(e.target.id)}}>export current team</button> 
          <button className={className.importTeam} id='import-team-button' onClick={(e)=>{handleClick(e.target.id)}}>import team</button> 
      </div>
      <div className='analysis-content-container'>
        {showContent.matchupChart ? <MatchupChart /> : null}
        {showContent.damageCalculator ? <DamageCalculator /> : null}
        {showContent.speedTier ? <SpeedTier /> : null}
        {showContent.specialMoves ? null : null}
        {showContent.exportCurrentTeam ? null : null}
        {showContent.matchuimportTeampChart ? null : null}
      </div>
    </div>
  );
}




// helper functions
function falsifyAllExcept(object, arg, singleValue, defaultValue) {
  const obj = {...object}
  for (let key in obj) {
    if (key===arg) obj[key]=singleValue;
    else obj[key]=defaultValue;
  }
  return obj;
}

function removeFadeOut( el, speed ) {
  var seconds = speed/1000;
  el.style.transition = "opacity "+seconds+"s ease";

  el.style.opacity = 0;
  setTimeout(function() {
      el.parentNode.removeChild(el);
  }, speed);
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisMenu);