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


const mapStateToProps = state => ({
  currentPokemon: state.pokemon.currentPokemon,
  start : state.pokemon.currentPokemon.isActive,
  teamStatus: state.pokemon.teamStatus,
  yourTeam: state.pokemon.yourTeam,
  enemyTeam: state.pokemon.enemyTeam,
  showTypingChart: state.pokemon.showTypingChart,
  mainDivClassName: state.loginFunctions.mainDivClassName
}) 



class App extends Component {
  constructor(props) {
    super(props);


  }


  render() {
    return (
      <div>
        <TopNavBar />
        <div className={this.props.mainDivClassName} id={"main-div"}>
          <div className="top">
            <h1>POKEMON TEAM BUILDER</h1>
            <PokemonSearch />
          </div>
          <div className="current-pokemon-display">
            {this.props.start ? <CurrentPokemonDisplay /> : null}
          </div>
          {/* <div className='current-pokemon-more-info'>
          {this.props.start && Object.keys(this.props.currentPokemon.teammates)[0]!==undefined ?
            <MoreInfo /> : 
            null
          }
        </div> */}
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