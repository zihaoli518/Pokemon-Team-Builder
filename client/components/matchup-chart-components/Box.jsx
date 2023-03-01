/* eslint-disable no-case-declarations */
/**
 * ************************************
 *
 * @module  Box
 * @author zi
 * @date
 * @description individual box
 *
 * ************************************
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';


// const example = {
//   pokemon, 
//   column 
// }

const Box = props => {
  // generate text based on weakness
  const generateText = () => {
    switch (props.pokemon.weakness[props.column]) {
      case 1:
        return ' '
      default: 
        return props.pokemon.weakness[props.column]
    }
  }
  // add class according to weakness 
  console.log('in box ', props.pokemon, props.column)

  let value = generateText();

  let className = 'weakness-' + props.pokemon.weakness[props.column].toString().replace('.', '');

  return (
    <div className={'box ' + className}>
      <h3>{value}</h3>
    </div>
  )
}

export default Box;