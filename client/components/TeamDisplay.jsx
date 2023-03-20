/**
 * ************************************
 *
 * @module TeamDisplay
 * @author zi 
 * @date
 * @description displays a team
 *
 * ************************************
 */

// importing dependencies 
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PokemonSprite from './PokemonSprite.jsx';
import TeamMember from './TeamMember.jsx';

import * as actions from '../actions/actions';


const mapStateToProps = (state) => {
  return {
    currentPokemon: state.pokemon.currentPokemon,
    yourTeam: state.pokemon.yourTeam,
    enemyTeam: state.pokemon.enemyTeam,
  };
};

const mapDispatchToProps = dispatch => ({
  saveCurrentTeam : (team) => dispatch(actions.saveCurrentTeam(team)),
});


const TeamDisplay= (props) => {

  const [teamState, setTeamState] = useState({color: props.team, selectedTeam: {}, selectedTeamName: '', title: '', teamToBeDisplayed:[]})
  
  useEffect(() => {
    populateTeam(teamState.color)
  }, [props.yourTeam, props.enemyTeam])

  const populateTeam = team => {
    // {console.log('inside populateTeam')}
    
    // let selectedTeam;
    // let selectedTeamName;
    // let title;
    
    if (props.team === 'green') {
      teamState.selectedTeam = props.yourTeam;
      teamState.selectedTeamName = 'yourTeam';
      teamState.title = 'Your Team'
    } else {
      teamState.selectedTeam = props.enemyTeam
      teamState.selectedTeamName = 'enemyTeam';
      teamState.title = 'Enemy Team'
    }
    

    const newTeamToBeDisplayed = [];
    for (let i=1; i<=6; i++) {
      let selectedMon = 'mon' + i.toString();
      // console.log('inside TeamDisplay for loop: ')
      // console.log(selectedTeam, selectedMon);
      if (teamState.selectedTeam[selectedMon]) {
        newTeamToBeDisplayed.push(
            <TeamMember
              key={selectedMon+teamState.selectedTeam[selectedMon]['pokemon']}
              selectedTeamName={teamState.selectedTeamName}
              selectedTeam={teamState.selectedTeam}
              selectedMon={selectedMon}
              pokemonData={teamState.selectedTeam[selectedMon]}
              pokemonName={teamState.selectedTeam[selectedMon]['pokemon']}
            />)
      };
    }
    // updating state
    setTeamState({...teamState, teamToBeDisplayed: [newTeamToBeDisplayed]});
    // console.log('END of populateTeam() ', newTeamToBeDisplayed)
  }

  const saveTeam = (e) => {
    e.preventDefault();
    console.log('inside saveTeam(e)')
    console.log(teamState.selectedTeam, )
    props.saveCurrentTeam(teamState.selectedTeam)
  }


  return (
    <div className={props.team}>
      <h4>{teamState.title}</h4>
      <div className='team-members'>
        {teamState.teamToBeDisplayed}
        <button className='save-team-button' onClick={(e) => {saveTeam(e)}}>save</button>
      </div>
    </div>
  );

}

export default connect(mapStateToProps, mapDispatchToProps)(TeamDisplay)