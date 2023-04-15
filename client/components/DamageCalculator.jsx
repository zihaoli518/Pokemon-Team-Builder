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



const DamageCalculator = props => {

  const [showContent, setShowContent] = useState({matchupChart: false, damageCalculator: false, exportCurrentTeam: false, importTeam: false})


  const handleClick = (button) => {

  }

  return (
    <div className='damage-calculator-container'>
      <div className='friendly-pokemon-calc'>

      </div>
      <div className='friendly-calc-results'>

      </div>
      <div className='enemy-calc-results'>

      </div>
      <div className='enemy-pokemon-calc'>

      </div>
    </div>
  );
}







export default connect(mapStateToProps, mapDispatchToProps)(DamageCalculator);