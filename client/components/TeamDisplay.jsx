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
import saveIcon from '../../assets/save-icon.png'


const mapStateToProps = (state) => {
  return {
    currentPokemon: state.pokemon.currentPokemon,
    yourTeam: state.pokemon.yourTeam,
    enemyTeam: state.pokemon.enemyTeam,
    username: state.userFunctions.name,
    savedTeams: state.userFunctions.savedTeams,
    previousTeamKeyF: state.pokemon.previousTeamKeyF,
    previousTeamKeyE: state.pokemon.previousTeamKeyE,
  };
};

const mapDispatchToProps = dispatch => ({
  saveCurrentTeamAsNew : (teamObj) => dispatch(actions.saveCurrentTeamAsNew(teamObj)),
  updateSavedTeam: (team) => dispatch(actions.updateSavedTeam(team)),
  clearTeam: (teamStr) => dispatch(actions.clearTeam(teamStr)),
});


const TeamDisplay= (props) => {
  
  if (!props.yourTeam) return null;
  const [teamState, setTeamState] = useState({color: props.team, selectedTeam: {}, selectedTeamName: props.yourTeam.name, title: props.yourTeam.name, teamToBeDisplayed:[]})
  
  useEffect(() => {
    populateTeam(teamState.color)
    // console.log('title: ', teamState.title)
    props.updateSavedTeam(props.yourTeam)
  }, [props.yourTeam, props.enemyTeam])

  const populateTeam = team => {
    
    // let selectedTeam;
    // let selectedTeamName;
    // let title;
    
    if (props.team === 'green') {
      teamState.selectedTeam = props.yourTeam;
      teamState.selectedTeamName = 'yourTeam';
      teamState.title = props.yourTeam.name;
      teamState['previousTeamKey'] = props.previousTeamKeyF;
    } else {
      teamState.selectedTeam = props.enemyTeam
      teamState.selectedTeamName = 'enemyTeam';
      teamState.title = 'enemy team';
      teamState['previousTeamKey'] = props.previousTeamKeyE;
    }

    // seeting team name
    if (!props.title) {
      setTeamState({...teamState, title: 'untitled'})
    }
    
    const newTeamToBeDisplayed = [];

    for (let i=1; i<=6; i++) {
      let selectedMon = 'mon' + i.toString();
      // if re-render is needed, add unique key to the child <TeamMember /> component to force re-render 
      let controlRerender = '';
      // console.log('POPULATE TEAM ',  props.previousTeamKeyE, teamState.selectedTeam.key, )
      if (props.previousTeamKeyE!==teamState.selectedTeam.key) controlRerender = Math.random();

      if (teamState.selectedTeam[selectedMon]) {
        newTeamToBeDisplayed.push(
            <TeamMember
              key={props.yourTeam.key+selectedMon+teamState.selectedTeam[selectedMon]['pokemon']}
              selectedTeamName={teamState.selectedTeamName}
              selectedTeam={teamState.selectedTeam}
              selectedMon={selectedMon}
              pokemonData={teamState.selectedTeam[selectedMon]}
              pokemonName={teamState.selectedTeam[selectedMon]['pokemon']}
            />)
      } else {
        newTeamToBeDisplayed.push(
          <div className='team-member-container'></div>
          )
      }
    }
    // updating state
    setTeamState({...teamState, teamToBeDisplayed: [newTeamToBeDisplayed]});
    // console.log('END of populateTeam() ', newTeamToBeDisplayed)
  }

  // copy the current team as save as new team - mapped to onclick of copy 
  const saveTeamAsNew = (e) => {
    e.preventDefault();
    // get edited team name from DOM
    let prevInput = document.querySelector("#main-div > div.teams > div.green > h4").innerHTML;
    let newInput = prevInput;
    if (prevInput===undefined || prevInput==='your team') newInput = 'untitled';

    // sending payload to dispatch functions
    let payload = {name: newInput, team: {...teamState.selectedTeam}};
    payload.team.name = newInput;
    props.saveCurrentTeamAsNew(payload);
    // saving the new state to database 
    // saveTeamsToDatabase(props.savedTeams)

  }

  const saveTeam = (e) => {
    console.log('inside saveTeam')
    // let input = document.querySelector("#main-div > div.teams > div.green > h4").innerHTML;
    let input = e.target.textContent;
    if (!input) input = document.querySelector("#main-div > div.teams > div.green > h4").innerHTML;
    console.log('in saveTeam, ', input)
    if (input===undefined) input = 'untitled'
    let copy = {...teamState.selectedTeam}
    copy.name = input
    if (teamState.color==='green') props.updateSavedTeam(copy)
    // saveTeamsToDatabase(props.savedTeams)
  }


  return (
    <div className={props.team}>
      <h4 className='team-name-text-input' contenteditable="true" onInput={(e) => {saveTeam(e)}}>{teamState.title}</h4>
      <div className='team-members'>
        {teamState.teamToBeDisplayed}
      </div>
      {(teamState.color==='green') ?
        <div className='save-buttons-container'> 
          <img className='save-team-icon' src={saveIcon} alt="" onClick={(e) => {saveTeam(e)}} />
          <img className='copy-team-icon' src="https://cdn-icons-png.flaticon.com/512/1621/1621635.png" alt="" onClick={(e) => {saveTeamAsNew(e)}} />
          <button className='clear-team-button' id='clear-team-button-f' onClick={(e) => {props.clearTeam('yourTeam'); }}>clear</button>
        </div>
        :
        <button className='clear-team-button' id='clear-team-button-e' onClick={(e) => {props.clearTeam('enemyTeam')}}>clear</button>

      }
    </div>
  );

}

export default connect(mapStateToProps, mapDispatchToProps)(TeamDisplay)


