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
 
 

const types = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'];


const mapStateToProps = state => {
  return {
    yourTeam : state.pokemon.yourTeam,
    enemyTeam: state.pokemon.enemyTeam
  }
}



const MatchupChart = (props) => {
  let chart = [];

  const populateChart = () => {
    // clearing out old rows 
    chart = [];
    for (let i=0; i<props.yourTeam.size; i++) {
      let currentMon = props.yourTeam['mon'+(i+1)];
      console.log('inside populateChart ', currentMon)
      if (!currentMon) break;
      chart.push(
        <Row id={'row' + i} pokemon={currentMon} />
      )
    }
  };

  useEffect(() => {
    console.log('inside matchup chart useEffect')
    populateChart();
    console.log(chart)
  }, [props.yourTeam])

  populateChart();
  console.log(chart)


  return (
    <div className='matchup-chart'>
      <Row legend={true}/>
      {chart}
    </div>
  );
};

 export default connect(mapStateToProps, null) (MatchupChart);