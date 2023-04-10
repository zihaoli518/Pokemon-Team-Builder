/**
 * ************************************
 *
 * @module SwichTeams
 * @author zi 
 * @date
 * @description button to switch teams
 *
 * ************************************
 */

// importing dependencies 
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions/actions';


const mapStateToProps = state => {
  return {
    yourTeam: state.pokemon.yourTeam,
    enemyTeam: state.pokemon.enemyTeam,
    savedTeams: state.userFunctions.savedTeams,
  }
}

const mapDispatchToProps = dispatch => ({
  switchTeams: (yourTeam, EnemyTeam, key) => dispatch(actions.switchTeams(yourTeam, EnemyTeam, key))
});

const SwitchTeams = props => {
  let oldLength = Object.keys(props.savedTeams).length
  let newKey = 'team_'+(oldLength+1);

  return (
    <div className='switch-teams-button-container'>

        <img onClick={()=>{props.switchTeams(props.yourTeam, props.enemyTeam, newKey)}} src='https://cdn-icons-png.flaticon.com/512/258/258488.png' />

    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SwitchTeams);