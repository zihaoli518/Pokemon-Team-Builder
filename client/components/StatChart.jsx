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
const maxStat = 150; 

const mapStateToProps = state => {
  return {
    currentPokemon : state.pokemon.currentPokemon
  }
 }

 // helper function for generating color based on value 
 function stat2color(perc, maxStat) {
   if (perc>maxStat) perc = 100;
   else perc = perc/(maxStat/100);

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
      barThickness: 25
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
        display: true,
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

  const populateData = () => {
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
    // generating color for each stat 
    const newColors = [];
    for (let i=0; i<newStats.length; i++) {
      newColors.push(stat2color(newStats[i], maxStat));
    }
    console.log('newLables ', labels)
    data.datasets[0].backgroundColor = newColors;
    // generating labels 
    for (let i=0; i<labels.length; i++) {
    }
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