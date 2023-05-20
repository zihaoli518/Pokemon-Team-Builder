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


import {calculate, Generations, Pokemon, Move} from '@ajhyndman/smogon-calc';
 


const mapStateToProps = state => {
  return {
    pokemonCalcDataFriendly: state.damageCalc.pokemonCalcDataFriendly,
    pokemonCalcDataEnemy: state.damageCalc.pokemonCalcDataEnemy,
  }
}

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  showTypingChart : () => dispatch(actions.showTypingChart()),
});



const SpeedTier = props => {
  
  const [showContent, setShowContent] = useState({matchupChart: false, damageCalculator: false, exportCurrentTeam: false, importTeam: false})
  
  const handleClick = (button) => {

  }

  return (
    <div className='speed-tier-container' >
      <div className='speed-order-container'>

      </div>

      <div className='team-speed-container'>
        <div className='friendly-speed-tier'>
          
        </div>
      </div>
    </div>
  );
} 







export default connect(mapStateToProps, mapDispatchToProps)(SpeedTier);