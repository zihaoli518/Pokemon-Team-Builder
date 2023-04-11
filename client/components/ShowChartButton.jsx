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

  const handleClick = () => {
    let chart = document.getElementById("matchup-chart")
    if (chart) removeFadeOut(chart, 1000);
    props.showTypingChart();
  }

  return (
    <div className='show-chart-button-area'>

        <button onClick={()=>{handleClick()}}>show matchup chart</button> 

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

export default connect(null, mapDispatchToProps)(ShowChartButton);