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
 import PokemonSprite from '../PokemonSprite.jsx';
 
 
 // const example = {
 //   pokemon, 
 // }

const types = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water']
 
const Row = (props) => {

  let row = [];
  let sprite =[];
  const populateRow = (pokemon) => {
    console.log('in populate row ', row, props.pokemon, props.pokemon.pokemon);
    sprite = [<PokemonSprite className='chart-sprite' pokemon={props.pokemon.pokemon}/> ];
    sprite.push()

    for (let i=0; i<types.length; i++) {
      row.push(
        <Box key={i} pokemon={pokemon} column={types[i]} />
      )
    }
    // row = newRow
  };

  let className = 'row-outter'

  if (props.legend) {
    row = types.map((str)=> <div className={'chart-legends'} id={str}>{str}</div>);
    className = 'row-outter-legends'
  }
  else populateRow(props.pokemon);
  
  return (
    <div className={className}>
      <div>
        {sprite}
      </div>
      <div className='row-inner'>
        {row}
      </div>
    </div>
  );
};

 export default Row;