/* eslint-disable no-case-declarations */
/**
 * ************************************
 *
 * @module  Row
 * @author zi
 * @date
 * @description individual row
 *
 * ************************************
 */

 import React, { useState, useEffect } from 'react';
 import { connect } from 'react-redux';
 import Box from './Box.jsx';
 
 
 // const example = {
 //   pokemon, 
 // }

const types = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'noraml', 'poison', 'psychic', 'rock', 'steel', 'water']
 
const Row = (props) => {
  const row = [];
  const populateRow = (pokemon) => {
    for (let i=0; i<types.length; i++) {
      row.push(
        <Box key={i} pokemon={pokemon} column={types[i]} />
      )
    }
  };
  // add class according to weakness

  return (
    <div className='row'>
      {row}
    </div>
  );
};

 export default Row;