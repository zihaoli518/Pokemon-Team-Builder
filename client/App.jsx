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



class App extends Component {
  constructor(props) {
    super(props);


  }


  render() {
    return (
      <div className='app-container'>
        <TopNavBar />
        <div className={this.props.mainDivClassName} id={"main-div"}>
          <div className='title-container'>
            <h1>electabuzzed.gg</h1>
            <img src="https://cdn.discordapp.com/emojis/933421274091360346.webp?size=96&quality=lossless" alt="" />
          </div>
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
          <div className="matchup-chart-container">
            {this.props.showTypingChart ? <MatchupChart /> : null}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(App)