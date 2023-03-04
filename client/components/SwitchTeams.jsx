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
    enemyTeam: state.pokemon.enemyTeam
  }
}

const mapDispatchToProps = dispatch => ({
  switchTeams: (yourTeam, EnemyTeam) => dispatch(actions.switchTeams(yourTeam, EnemyTeam))
});

const SwitchTeams = props => {


  return (
    <div className='switch-teams-button-container'>

        <button onClick={()=>{props.switchTeams(props.yourTeam, props.enemyTeam)}}>SwitchTeams</button> 

    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SwitchTeams);