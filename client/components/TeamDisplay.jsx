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
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';

import PokemonSprite from './PokemonSprite.jsx';
import TeamMember from './TeamMember.jsx';

import * as actions from '../actions/actions';
import saveIcon from '../../assets/save-icon.png';
import PlusButton from './small-components/PlusButton.jsx';

import isEqualState from 'lodash.isequal';
import { Typography, Tooltip } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

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
  updateSavedTeam: (team, triggeredBy) => dispatch(actions.updateSavedTeam(team, triggeredBy)),
  clearTeam: (teamStr) => dispatch(actions.clearTeam(teamStr)),
});


const TeamDisplay= (props) => {

  if (!props.yourTeam) return null;

const [teamState, setTeamState] = useState({
  color: props.team,
  selectedTeam: props.team === 'green' ? props.yourTeam : props.enemyTeam,
  selectedTeamName: props.team === 'green' ? 'yourTeam' : 'enemyTeam',
  title: props.team === 'green' ? props.yourTeam.name : 'opponent',
  teamToBeDisplayed: []
});  

  const prevYourTeam = useRef(props.yourTeam);
  const prevEnemyTeam = useRef(props.enemyTeam);

  useEffect(() => {
    if (!isEqualState(prevYourTeam.current, props.yourTeam) || !isEqualState(prevEnemyTeam.current, props.enemyTeam)) {
      console.log('yourTeam changed:', prevYourTeam.current, props.yourTeam);
      console.log('enemyTeam changed:', prevEnemyTeam.current, props.enemyTeam);
      prevYourTeam.current = props.yourTeam;
      prevEnemyTeam.current = props.enemyTeam;
      populateTeam(teamState.color);

      props.updateSavedTeam(props.yourTeam, 'TeamDisplay - useEffect');
    }
  }, [props.yourTeam, props.enemyTeam, teamState.color]);


  const populateTeam = team => {
    console.log('inside populateTeam')
    
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
      teamState.title = 'opponent';
      teamState['previousTeamKey'] = props.previousTeamKeyE;
    }

    // // seeting team name
    // if (!props.title) {
    //   setTeamState({...teamState, title: 'untitled'})
    // }
    
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
              pokemonName={teamState.selectedTeam[selectedMon].pokemon}
              pokedexId={teamState.selectedTeam[selectedMon].pokedexId}
              whichSide= {teamState.color}
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
  const saveTeamAsNew = (e, teamName) => {
    e.preventDefault();
    // get edited team name from DOM
    let prevInput = teamName
    let newInput = prevInput;
    if (prevInput===undefined || prevInput==='your team') newInput = 'untitled';

    // sending payload to dispatch functions
    let payload = {name: newInput, team: {...teamState.selectedTeam}};
    payload.team.name = newInput;
    props.saveCurrentTeamAsNew(payload);
    // saving the new state to database 
    // saveTeamsToDatabase(props.savedTeams)

  }

  const saveTeam = (e, TeamName) => {
    console.log('inside saveTeam')
    // let input = document.querySelector("#main-div > div.teams > div.green > h4").innerHTML;
    let input = TeamName
    console.log('in saveTeam, ', input)
    if (input===undefined) input = 'untitled'
    let copy = {...teamState.selectedTeam}
    copy.name = input
    if (teamState.color==='green') props.updateSavedTeam(copy, 'TeamDisplay.saveTeam')
    // saveTeamsToDatabase(props.savedTeams)
  }

  return (
    <Paper
      className={props.team}
      elevation={3}
      sx={{ height: "90%", display: "flex", flexDirection: "column" }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "3%",
          zIndex: 100,
          height: "20%",
          alignItems: "center",
          borderRadius: "0.6rem",
        }}
      >
        <Typography
          className='team-name-text-input'
          contentEditable="true"
          onInput={(e) => saveTeam(e, e.target.innerText)}
          sx={{ marginLeft: "3%" }}
        >
          {teamState.title}
        </Typography>
        {teamState.color === "green" && (
          <>
            <Tooltip
              title={
                <Typography sx={{ fontSize: "160%" }}>save team</Typography>
              }
              arrow
            >
              <SaveRoundedIcon onClick={(e) => saveTeam(e, teamState.title)} />
            </Tooltip>
            <Tooltip
              title={
                <Typography sx={{ fontSize: "160%" }}>copy team</Typography>
              }
              arrow
            >
              <ContentCopyRoundedIcon
                onClick={(e) => saveTeamAsNew(e, teamState.title)}
              />
            </Tooltip>
          </>
        )}
        <Tooltip
          title={<Typography sx={{ fontSize: "160%" }}>delete team</Typography>}
          arrow
        >
          <DeleteForeverRoundedIcon
            sx={{ marginLeft: "auto", marginRight: "2%" }}
            onClick={(e) => {
              props.clearTeam(
                teamState.color === "green" ? "yourTeam" : "enemyTeam"
              );
            }}
          />
        </Tooltip>
      </Paper>

      <div className="team-members" style={{ flexGrow: 1 }}>
        {teamState.teamToBeDisplayed}
      </div>
    </Paper>
  );

}

export default connect(mapStateToProps, mapDispatchToProps)(TeamDisplay)


