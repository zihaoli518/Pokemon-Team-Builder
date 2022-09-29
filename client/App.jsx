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
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

// importing components 
import PokemonSearch from './components/PokemonSearch.jsx'
import CurrentPokemonDisplay from './components/CurrentPokemonDisplay.jsx'
import TeamDisplay from './components/TeamDisplay.jsx';

import '../index.scss';


const mapStateToProps = state => ({
  start : state.pokemon.currentPokemon.isActive,
  teamStatus: state.pokemon.teamStatus,
}) 


class App extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    // }

  }



  render() {
    return (
      <div className='main'>
        <div className='top'>
          <h1>Prepare Your Next Pokémon Battle!</h1>
          <PokemonSearch />
        </div>
        <div className='current-pokemon-display'>
          {this.props.start ?
            <CurrentPokemonDisplay /> : 
            null
          }
        </div>
        <div className='teams'>
          {this.props.teamStatus ?
            [<TeamDisplay key={'green'} team={'green'}/>, <TeamDisplay key={'red'} team={'red'}/>] : 
            null
          }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, null)(App)