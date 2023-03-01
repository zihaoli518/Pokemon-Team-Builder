/* eslint-disable no-case-declarations */
/**
 * ************************************
 *
 * @module  MatchupChart
 * @author zi
 * @date
 * @description matchup chart 
 *
 * ************************************
 */

 import React, { useState, useEffect } from 'react';
 import { connect } from 'react-redux';
 import Row from './matchup-chart-components/Row.jsx';
 
 

const types = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'noraml', 'poison', 'psychic', 'rock', 'steel', 'water']
 
const MatchupChart = (props) => {
  const allRows = [];
  const populateRow = (pokemon) => {
    for (let i=0; i<types.length; i++) {
      row.push(
        <Box key={i} pokemon={pokemon} column={types[i]} />
      )
    }
  };
  // add class according to weakness

  return (
    <div className='matchup-chart'>
      {allRows}
    </div>
  );
};

 export default MatchupChart;