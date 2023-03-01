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
  const generateText = weakness => {
    switch (props.pokemon.weakness[props.column]) {
      case 0:
        return '0'
    }
  }
  // add class according to weakness 


  return (
    <div className={'box ' + 'weakness-' + props.pokemon.weakness[props.column]}>
      <h3>{props.pokemon.weakness[props.column]}</h3>
    </div>
  )
}

export default Box;