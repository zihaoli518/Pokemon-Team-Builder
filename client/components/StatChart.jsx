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

import { getTypeWeaknesses } from 'poke-types';

// global constant for maximum/minimum number as parameters for the color scale function  
let maxStat = 165; 
let minStat = 40;

const mapStateToProps = state => {
  return {
    currentPokemon : state.pokemon.currentPokemon
  }
 }

 // helper function for generating color based on value 
function stat2color(stat, max = maxStat, min = minStat) {
  // perc ranges from 0-100 and is responsible for the color scale 
  let perc;
  if (stat > max) perc = 100;
  else if (stat < min) perc = 0;
  else perc = (stat / (max / 100));

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
let labels = ['HP', 'Atack', 'Defense', 'Sp. Atk.', 'Sp. Def', 'Speed'];
const data = {
  labels: labels,
  datasets: [
    {
      data: [],
      backgroundColor: [],
      barPercentage: 1,
      categoryPercentage: 0.6
    }
  ]
};

const config = {
  type: "bar",
  data: data,
  options: {
    indexAxis: "y",
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: "BASE STATS",
        color: "black",
        font: {
          size: 18
        }
      },
      legend: {
        display: false,
      },
      label: {
        color: "black"
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        max: maxStat,
        ticks: {
          display: false,
        },
        display: false,
      },
      y: {
        grid: {
          display: false,
        },
        scaleLabel: {
          display: false,
        },

      },
    },
  },
};

// main React component 
const StatChart = props => {

  const [startChart, setStartChart] = useState(false);
  const [currentPokemon, setCurrentPokemon] = useState({})

  const populateDataBase = () => {
    const newStats = [];
    const newLabels = [];
    let labelsCounter = 0;
    for (let key in props.currentPokemon.stats) {
      newStats.push(props.currentPokemon.stats[key]);
      newLabels.push(labels[labelsCounter] + ' ' + props.currentPokemon.stats[key].toString());
      labelsCounter++;
    }
    data.datasets[0].data = newStats;
    data.labels = newLabels;
    config.options.scales.x.max = maxStat;

    // generating color for each stat 
    const newColors = [];
    for (let i=0; i<newStats.length; i++) {
      newColors.push(stat2color(newStats[i]));
    }
    data.datasets[0].backgroundColor = newColors;
    // generating labels 
    for (let i=0; i<labels.length; i++) {
    }
  }

  const populateDataEv = () => {
    const newStats = [];
    const newLabels = [];
    let labelsCounter = 0;
    for (let key in props.currentPokemon.stats) {
      newStats.push(props.currentPokemon.calculatedStats[labelsCounter]);
      newLabels.push(labels[labelsCounter] + ' ');
      labelsCounter++;
    }
    data.datasets[0].data = newStats;
    data.labels = newLabels;
    config.options.scales.x.max = 500;
    // generating color for each stat 
    const newColors = [];
    for (let i=0; i<newStats.length; i++) {
      newColors.push(stat2color(newStats[i], 500, 50));
    }
    data.datasets[0].backgroundColor = newColors;
    // generating labels 
    for (let i=0; i<labels.length; i++) {
    }
  }


  let myChart; 

  useEffect(() => {
    if (props.id==='current-pokemon-chart') {
      populateDataBase();
      destroyChart();
      // console.log(data.datasets[0].data)

      myChart = new Chart(document.getElementById(props.id), config);
    }
    else if (props.id==='calculated-stat-chart') {
      populateDataEv();
      destroyChart();
      // console.log(data.datasets[0].data)
      myChart = new Chart(document.getElementById(props.id), config);
    }

  }, [props.currentPokemon.stats, props.currentPokemon.calculatedStats]);

  // modularizing destroy chart 
  const destroyChart = () => {
    // remove chart that is currently using canvas 
    if(myChart) myChart.destroy();
    const oldCanvas = document.getElementById(props.id);
    oldCanvas.remove();
    const newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id', props.id);
    const parent = document.getElementById('stat-chart-' + props.name + props.id);
    parent.append(newCanvas);
  }

  return (
    <div className={'stat-chart-'+props.id} id={'stat-chart-' + props.name + props.id}>
      <canvas id={props.id}>

      </canvas>
    </div>
  )
 }

 export default connect(mapStateToProps, null)(StatChart)