/* eslint-disable no-case-declarations */
/**
 * ************************************
 *
 * @module  StatChartRadar
 * @author zi
 * @date
 * @description render current pokemon stats with chart.js
 *
 * ************************************
 */

 import React, { useState, useEffect } from 'react';
 import { Chart } from 'chart.js/auto';
 import { Radar } from 'react-chartjs-2';
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
 let labels = ['HP', 'Defense', 'Sp. Def', 'Speed', 'Sp. Atk.', 'Atack',];
 const order = ['hp', 'defense', 'specialD', 'speed', 'specialA', 'attack'];


 const data = {
   labels: labels,
   datasets: [
     {
      data: [],
      backgroundColor: [],
      borderColor: [],
      pointRadius: 6,
      pointHitRadius: 10,
      pointHoverRadius: 10,

     }
   ]
 };


 
const options = {
  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    label: {
      color: "black"
    }
  },
  scale: {
    ticks: {
      beginAtZero: true
    }
  },
  scales: {
    r: {
      display: true,
      grid: {
        display: true
      },
      ticks: {
        display: false
      },
      max: 155,
      min: 25,
    }
  }
}
 
 
 
 // main React component 
 const StatChartRadar = props => {
 
   const [startChart, setStartChart] = useState(false);
   const [currentPokemon, setCurrentPokemon] = useState({})
 
   const populateDataBase = () => {
     const newStats = [];
     for (let i=0; i<order.length; i++) {
       newStats.push(props.currentPokemon.stats[order[i]]);
     }
     data.datasets[0].data = newStats;
 
     // generating color for each stat 
     const newColors = [];
     for (let i=0; i<newStats.length; i++) {
       newColors.push(stat2color(newStats[i]));
     }
     // generating labels 
     for (let i=0; i<labels.length; i++) {
     }
     data.datasets[0].backgroundColor = 'rgba(111, 136, 97, 0.404)';
     console.log('newStats:') 
     console.log(newStats)
     data.datasets[0].borderColor = 'rgba(103, 129, 147, 0.757)';
     data.datasets[0].pointBackgroundColor = newColors;
    //  data.datasets[0].pointHoverBackgroundColor = newColors;
   }
 
 
   let myChart; 
   populateDataBase();

   useEffect(() => {

       populateDataBase();
      //  destroyChart();
       // console.log(data.datasets[0].data)
 
      //  myChart = new Chart(document.getElementById(props.id), config);

 
   }, [props.currentPokemon.stats]);
 
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
       <Radar data={data} options={options}/>
     </div>
   )
  }
 
  export default connect(mapStateToProps, null)(StatChartRadar)