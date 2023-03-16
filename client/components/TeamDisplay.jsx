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

const mapStateToProps = (state) => {
  return {
    currentPokemon: state.pokemon.currentPokemon,
    yourTeam: state.pokemon.yourTeam,
    enemyTeam: state.pokemon.enemyTeam,
  };
};


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


  return (
    <div className={props.team}>
      <h4>{teamState.title}</h4>
      <div className='team-members'>
        {teamState.teamToBeDisplayed}
      </div>
    </div>
  );

}

export default connect(mapStateToProps, null)(TeamDisplay)