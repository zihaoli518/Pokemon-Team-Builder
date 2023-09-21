/**
 * ************************************
 *
 * @module  App.jsx
 * @author zi
 * @date
 * @description main app  
 *
 * ************************************
 */

// importing dependencies
import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Router, Route, Link, browserHistory, IndexRedirect } from 'react-router'

import { connect } from 'react-redux';

// importing components 
import TopNavBar from './components/TopNavBar.jsx';
import PokemonSearch from './components/PokemonSearch.jsx'
import CurrentPokemonDisplay from './components/CurrentPokemonDisplay.jsx'
import TeamDisplay from './components/TeamDisplay.jsx';
import SwitchTeams  from './components/SwitchTeams.jsx';
import MoreInfo from './components/MoreInfo.jsx';
import AnalysisMenu from './components/AnalysisMenu.jsx';

import '../index.scss';
import MatchupChart from './components/analysis-menu/MatchupChart.jsx';
import AllSavedTeams from './components/AllSavedTeams.jsx';
import BrowsingHistory from './components/BrowsingHistory.jsx'

import themeSongFile from '../assets/theme.mp3';
import buttonSoundFile from '../assets/button-sound-effect.mp3';
import electabuzzGIF from '../assets/electabuzz.gif';

import favicon from '../assets/favicon.ico';

const themeSong = new Audio(themeSongFile);
const buttonSound = new Audio(buttonSoundFile);




// themeSong.addEventListener('loadeddata', () => {
//   themeSong.play();
// });
window.addEventListener('click', () => {
  addSoundEffectToButtons();
  themeSong.play();
});

const addSoundEffectToButtons = () => {
  const playSound = () => {
    buttonSound.play();
  }
  const buttons =document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', playSound)
  })
}

const mapStateToProps = state => ({
  currentPokemon: state.pokemon.currentPokemon,
  teamStatus: state.pokemon.teamStatus,
  analysisMenuStatus: state.damageCalc.analysisMenuStatus,
  yourTeam: state.pokemon.yourTeam,
  enemyTeam: state.pokemon.enemyTeam,
  showTypingChart: state.pokemon.showTypingChart,
  mainDivClassName: state.userFunctions.mainDivClassName
}) 


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {volume: 0.5}
  }
  
  componentWillMount = () => {
    addSoundEffectToButtons();
  }
  
  componentDidUpdate = () => {
    addSoundEffectToButtons();
  }
  
  
  changeAppVolume = () => {
    // Get the current volume level from the volume control element
    var volumeControl = document.getElementById('volume-slider');
    var newAppVolume = volumeControl.value;
    
    // Update the app volume variable
    console.log('new app volume:' , newAppVolume)
    this.setState({volume: newAppVolume})
    
    // Update the volume of all audio elements
    themeSong.volume = newAppVolume;
    buttonSound.volume = newAppVolume;
  }
  
  addSliderOnChange() {
    var slider = document.getElementById("volume-slider");
    console.log('inside addSliderOnChange, ', slider, this.changeAppVolume);
    slider.addEventListener("change", function() {
      console.log("Slider value changed!");
      this.changeAppVolume(); // call your function here
    });
  }
  
  
  render() {
    return (
      <div className="app-container">
        <TopNavBar />
        <div className={this.props.mainDivClassName} id={"main-div"}>
          <div className="title-container">
            <h1>electabuzzed.xyz</h1>
            {/* <img src="https://cdn.discordapp.com/emojis/933421274091360346.webp?size=96&quality=lossless" alt="" /> */}
            <img src={electabuzzGIF} alt="" />
            <h4>volume: </h4>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              defaultValue={this.state.volume}
              id="volume-slider"
              onChange={() => {
                this.changeAppVolume();
              }}
            />
          </div>
          {!this.props.currentPokemon.isActive ? (
            <div className="explore-tip">
              <h4>start exploring/team building by looking up a pokemon!</h4>
            </div>
          ) : null}
          {/* <img className='electabuzzes' src="https://www.models-resource.com/resources/big_icons/24/23144.png?updated=1510574730" alt="" /> */}
          <PokemonSearch />
          <BrowsingHistory />

          <div className="main-row-container">
            <AllSavedTeams />
            <div className="current-pokemon-display-container">
              {this.props.currentPokemon.isActive ? (
                <CurrentPokemonDisplay />
              ) : null}
            </div>
          </div>
          <div className="teams">
            <TeamDisplay key={"green"} team={"green"} />
            <SwitchTeams />
            <TeamDisplay key={"red"} team={"red"} />,
          </div>
          {this.props.teamStatus || this.props.analysisMenuStatus ? (
            <AnalysisMenu />
          ) : null}

          <div className="footer-container">
            <h4>electabuzzed.gg</h4>
            <h5>source code at: </h5>

            <a href="https://github.com/zihaoli518/Pokemon-Team-Builder">
              https://github.com/zihaoli518/Pokemon-Team-Builder
            </a>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(mapStateToProps, null)(App);


function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}