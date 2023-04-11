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
import ShowChartButton from './components/ShowChartButton.jsx';

import '../index.scss';
import MatchupChart from './components/MatchupChart.jsx';
import AllSavedTeams from './components/AllSavedTeams.jsx';



const mapStateToProps = state => ({
  currentPokemon: state.pokemon.currentPokemon,
  teamStatus: state.pokemon.teamStatus,
  yourTeam: state.pokemon.yourTeam,
  enemyTeam: state.pokemon.enemyTeam,
  showTypingChart: state.pokemon.showTypingChart,
  mainDivClassName: state.userFunctions.mainDivClassName
}) 


const themeSong = new Audio('/static/theme.mp3');
const buttonSound = new Audio('/static/button-sound-effect.mp3')

themeSong.addEventListener('loadeddata', () => {
  themeSong.play();
});
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
    // this.addSliderOnChange();
  }


  changeAppVolume = () => {
    console.log('in change volume')

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
    console.log('inside addSliderOnChange, ', slider, this.changeAppVolume)
    slider.addEventListener("change", function() {
      console.log("Slider value changed!");
      this.changeAppVolume(); // call your function here
    });
  }


  render() {
    return (
      <div className='app-container'>
        <TopNavBar />
        <div className={this.props.mainDivClassName} id={"main-div"}>
          <div className='title-container'>
            <h1>electabuzzed.gg</h1>
            <img src="https://cdn.discordapp.com/emojis/933421274091360346.webp?size=96&quality=lossless" alt="" />
              <h4>volume: </h4>
              <input type="range" min="0" max="1" step="0.05" defaultValue={this.state.volume} id='volume-slider' onChange={() => {this.changeAppVolume()}} />
          </div>
          {!this.props.currentPokemon.isActive ?
            <div className='explore-tip'>
              <h4>start exploring/team building by looking up a pokemon!</h4>
            </div>
            : null
          }
          <img className='electabuzzes' src="https://www.models-resource.com/resources/big_icons/24/23144.png?updated=1510574730" alt="" />
          <PokemonSearch />

          <div className='main-row-container'>
            <AllSavedTeams />
            <div className="current-pokemon-display-container">
              {this.props.currentPokemon.isActive ? <CurrentPokemonDisplay /> : null}
            </div>
          </div>
          <div className="teams">
            {this.props.teamStatus
              ? [
                  <TeamDisplay key={"green"} team={"green"} />,
                  <SwitchTeams />,
                  <TeamDisplay key={"red"} team={"red"} />,
                ]
              : null}
          </div>
          <div className="show-chart-button-container">
            {this.props.teamStatus ? <ShowChartButton /> : null}
          </div>
          {/* <div className="matchup-chart-container"> */}
            {this.props.showTypingChart ? <MatchupChart /> : null}
          {/* </div> */}
          <div className='footer-container'>
              <h4>electabuzzed.gg</h4>
              <h5>developed by zihao li, your buddy. source code at: </h5>

              <a href="https://github.com/zihaoli518/Pokemon-Team-Builder">https://github.com/zihaoli518/Pokemon-Team-Builder</a>
          </div>
        </div>
      </div>
    );
  }
}



export default connect(mapStateToProps, null)(App)