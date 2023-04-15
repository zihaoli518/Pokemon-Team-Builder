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

import DamageCalculator from './DamageCalculator.jsx'
import MatchupChart from './MatchupChart.jsx';


const mapStateToProps = state => {
  return {
    teamStatus: state.pokemon.teamStatus,
    showTypingChart: state.pokemon.showTypingChart,
  }
}

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  showTypingChart : () => dispatch(actions.showTypingChart()),
});



const AnalysisMenu = props => {

  const [showContent, setShowContent] = useState({matchupChart: false, damageCalculator: false, exportCurrentTeam: false, importTeam: false})
  const [className, setClassName] = useState({matchupChart: 'menu-button', damageCalculator: 'menu-button', exportCurrentTeam: 'menu-button', importTeam: 'menu-button'})


  const handleClick = (button) => {
    console.log('inside handleclick', button)
    if (button==='show-matchup-chart-button') {
      // let chart = document.getElementById("matchup-chart")
      // if (chart) removeFadeOut(chart, 300);
      setShowContent({matchupChart: true, damageCalculator: false, exportCurrentTeam: false, importTeam: false});
      setClassName({matchupChart: 'menu-button menu-button-active', damageCalculator: 'menu-button', exportCurrentTeam: 'menu-button', importTeam: 'menu-button'})
    } else if (button==='show-damage-calculator-button') {
      setShowContent({matchupChart: false, damageCalculator: true, exportCurrentTeam: false, importTeam: false})
      setClassName({matchupChart: 'menu-button', damageCalculator: 'menu-button menu-button-active', exportCurrentTeam: 'menu-button', importTeam: 'menu-button'})

    } else if (button==='export-current-team-button') {
      
    } else if (button==='import-team-button') {
      
    }
  }


  return (
    <div className='analysis-menu-and-content-container'>
      <div className='analysis-menu'>
          <button className={className.matchupChart} id='show-matchup-chart-button' onClick={(e)=>{handleClick(e.target.id)}}>show matchup chart</button> 
          <button className={className.damageCalculator} id='show-damage-calculator-button' onClick={(e)=>{handleClick(e.target.id)}}>show damage calculator</button> 
          <button className={className.exportCurrentTeam} id='export-current-team-button' onClick={(e)=>{handleClick(e.target.id)}}>export current team</button> 
          <button className={className.importTeam} id='import-team-button' onClick={(e)=>{handleClick(e.target.id)}}>import team</button> 
      </div>
      <div className='analysis-content-container'>
        {showContent.matchupChart ? <MatchupChart /> : null}
        {showContent.damageCalculator ? <DamageCalculator /> : null}
        {showContent.exportCurrentTeam ? null : null}
        {showContent.matchuimportTeampChart ? null : null}
      </div>
    </div>
  );
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