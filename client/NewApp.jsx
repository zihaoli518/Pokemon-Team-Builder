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
import { Router, Route, Link, browserHistory, IndexRedirect } from 'react-router'

import { connect } from 'react-redux';

// importing components 


import '../index.scss';



const mapStateToProps = state => ({
  currentPokemon: state.pokemon.currentPokemon,
  start : state.pokemon.currentPokemon.isActive,
  teamStatus: state.pokemon.teamStatus,
  yourTeam: state.pokemon.yourTeam,
  enemyTeam: state.pokemon.enemyTeam,
  showTypingChart: state.pokemon.showTypingChart,
  mainDivClassName: state.loginFunctions.mainDivClassName
}) 



class NewApp extends Component {
  constructor(props) {
    super(props);

  }


  render() {
    return (
      <Router history={ browserHistory }>
        <Route path="/" component={App}>
          <IndexRedirect to="/dashboard"/>
          <Route path="dashboard" name="Dashboard" component={App} />
          <Route path="/api/users/:username" name=':username' component={App}/>
        </Route>
      {/* <Route path="*" component={App}>
          <IndexRedirect to="/dashboard" />
      </Route> */}
    </Router>
    );
  }
}

export default connect(mapStateToProps, null)(NewApp)