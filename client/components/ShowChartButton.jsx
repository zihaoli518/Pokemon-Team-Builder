/**
 * ************************************
 *
 * @module PokemonSprite
 * @author zi 
 * @date
 * @description button to show typing charts
 *
 * ************************************
 */

// importing dependencies 
import React from 'react';
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

const ShowChartButton = props => {


  return (
    <div className='show-chart-button-area'>

        <button onClick={props.showTypingChart}>show matchup chart</button> 

    </div>
  );
}

export default connect(null, mapDispatchToProps)(ShowChartButton);