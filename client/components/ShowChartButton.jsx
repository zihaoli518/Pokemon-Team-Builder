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


const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  // showChart : () => dispatch(actions.showChart()),
});

const ShowChartButton = props => {


  return (
    <button onClick={props.showChart}>SHOW CHART</button>
  );
}

export default connect(null, mapDispatchToProps)(ShowChartButton);