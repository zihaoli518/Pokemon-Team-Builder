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

// global constant for maximum number of the spectrum 
const maxStat = 140; 

const mapStateToProps = state => {
  return {
    currentPokemon : state.pokemon.currentPokemon
  }
 }

 // helper function for generating color based on value 
 function stat2color(perc, maxStat) {
   perc = perc/(maxStat/100)
   var r,g,b = 0;
   if (perc < 50) {
     r = 255;
     g = Math.round(5.1 * perc);
   } else {
     g = 255;
     r = Math.round(510 - 5.1 * perc);
   }
   var h = r * 0x10000 + g * 0x100 + b * 0x1;
   return "#" + ("000000" + h.toString(16)).slice(-6);
 }

// configurations for chart.js  
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

// main React component 
const StatChart = props => {

  const [startChart, setStartChart] = useState(false);
  const [currentPokemon, setCurrentPokemon] = useState({})

  const populateData = () => {
    const newStats = [];
    for (let key in props.currentPokemon.stats) {
      newStats.push(props.currentPokemon.stats[key]);
    }
    data.datasets[0].data = newStats;
    // generating color for each stat 
    const newColors = [];
    for (let i=0; i<newStats.length; i++) {
      newColors.push(stat2color(newStats[i], maxStat));
    }
    console.log('newColors ', newColors)
    data.datasets[0].backgroundColor = newColors;
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

  return (
    <div className='stat-chart' id={'stat-chart-' + props.name}>
      <canvas id='myChart'>

      </canvas>
    </div>
  )
 }

 export default connect(mapStateToProps, null)(StatChart)