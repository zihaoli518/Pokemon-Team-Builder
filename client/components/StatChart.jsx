/* eslint-disable no-case-declarations */
/**
 * ************************************
 *
 * @module  StatChart
 * @author zi
 * @date
 * @description render current pokemon stats with chart.js
 *
 * ************************************
 */

import React, { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import { connect } from 'react-redux';


const mapStateToProps = state => {
  return {
    currentPokemon : state.pokemon.currentPokemon
  }
 }


let color = 'rgb(162, 0, 0)'

const labels = ['HP', 'Atack', 'Defense', 'Sp. Atk.', 'Sp. Def', 'Speed'];
const data = {
  labels: labels,
  datasets: [
    {
      label: '',
      data: [],
      backgroundColor: [
        color,
        color,
        color,
        color,
        color,
        color
      ]
    }
  ]
};

const config = {
  type: 'bar',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'BASE STATS'
      }
    }
  },
};

const StatChart = props => {

  const [startChart, setStartChart] = useState(false);
  const [currentPokemon, setCurrentPokemon] = useState({})

  const populateData = () => {
    const newStats = [];
    for (let key in props.currentPokemon.stats) {
      newStats.push(props.currentPokemon.stats[key]);
    }
    data.datasets[0].data = newStats
  }


  let myChart; 

  useEffect(() => {
    populateData();
    destroyChart();
    myChart = new Chart(document.getElementById("myChart"), config);
    // props.setPreventChartLooping(false);
  }, [props.currentPokemon]);

  // modularizing destroy chart 
  const destroyChart = () => {
    // remove chart that is currently using canvas 
    if(myChart) myChart.destroy();
    const oldCanvas = document.getElementById('myChart');
    oldCanvas.remove();
    const newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id', 'myChart');
    const parent = document.getElementById('stat-chart-' + props.name);
    parent.append(newCanvas);
  }


  // myChart = new Chart(
  //   document.getElementById("myChart"), 
  //   config
  // );

  return (
    <div className='stat-chart' id={'stat-chart-' + props.name}>
      <canvas id='myChart'>

      </canvas>
    </div>
  )
 }

 export default connect(mapStateToProps, null)(StatChart)