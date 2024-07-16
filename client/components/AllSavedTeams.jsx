/**
 * ************************************
 *
 * @module AllSavedTeams
 * @description AllSavedTeams
 *
 * ************************************
 */

// importing dependencies 
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import PokemonSprite from './PokemonSprite.jsx';
import SavedTeam from './SavedTeam.jsx';

import * as actions from '../actions/actions';

import '../styles/AllSavedTeams.scss';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';

const mapStateToProps = (state) => ({
  savedTeams: state.userFunctions.savedTeams,
  username: state.userFunctions.username,
  saveToDatabase: state.userFunctions.saveToDatabase,
  currentPokemon: state.pokemon.currentPokemon,
  teamLength: state.pokemon.yourTeam.size,
});

const mapDispatchToProps = dispatch => ({
  refreshAndDecodeSavedTeams: (savedTeams) => dispatch(actions.refreshAndDecodeSavedTeams(savedTeams)),
});

const AllSavedTeams = (props) => {
  console.log('inside AllSavedTeams, ', props)
  const theme = useTheme();

  const [allTeams, setAllTeams] = useState([]);
  const [savedTeamsCache, setSavedTeamsCache] = useState([]);

  useEffect(() => {
    console.log('inside useEffect 1, ')
    populateSavedTeams();
  }, [props.savedTeams]);

  useEffect(() => {
    console.log('inside useEffect 2,', JSON.stringify(savedTeamsCache) === JSON.stringify(props.savedTeams))

    if (JSON.stringify(savedTeamsCache) === JSON.stringify(props.savedTeams)) return;
    console.log('test 1')
    if (props.username && props.savedTeams.team_1) saveTeamsToDatabase(props.savedTeams);
    console.log('test 2')

    setSavedTeamsCache({ ...props.savedTeams });
    console.log('end of useEffect 2, ')

  }, [props.username]);

  const populateSavedTeams = () => {
    if (!props.savedTeams) return;
    const CopyOfSavedTeams = JSON.parse(JSON.stringify(props.savedTeams));

    const allSavedTeamsToBeDisplayed = [];
    for (let i = 1; i <= Object.keys(CopyOfSavedTeams).length; i++) {
      let currentTeamName = 'untitled ' + i, currentTeam = null, currentTeamKey = 'team_' + i;

      if (CopyOfSavedTeams[currentTeamKey]) {
        currentTeamName = CopyOfSavedTeams[currentTeamKey]['name']
        currentTeam = CopyOfSavedTeams[currentTeamKey];
        currentTeam.key = currentTeamKey;
        for (let j = 1; j <= 6; j++) {
          let mon = 'mon' + j;
          if (currentTeam[mon] && currentTeam[mon].item.url) {
            currentTeam[mon].item.url = decodeURIComponent(currentTeam[mon].item.url);
          }
        }
      }
      allSavedTeamsToBeDisplayed.push(
        <SavedTeam
          key={i + currentTeamKey}
          savedTeamName={currentTeamName}
          savedTeam={currentTeam}
          savedTeamKey={currentTeamKey}
        />
      );
      if (i === Object.keys(props.savedTeams).length) break;
    }
    setAllTeams(allSavedTeamsToBeDisplayed);
  }

  const saveTeamsToDatabase = (stateOfTeams) => {
    const savedTeams = JSON.parse(JSON.stringify(stateOfTeams));
    if (savedTeams.team_1.mon1) {
      for (let i = 1; i <= Object.keys(savedTeams).length; i++) {
        const teamKey = 'team_' + i;
        for (let j = 1; j <= 6; j++) {
          const monKey = 'mon' + j;
          if (!savedTeams[teamKey][monKey]) break;
          savedTeams[teamKey][monKey].activeAbility.description = savedTeams[teamKey][monKey].activeAbility.description.replace(/[\/\(\)\']/g, "&apos;");
          if (savedTeams[teamKey][monKey].item.item) {
            savedTeams[teamKey][monKey].item.url = encodeURIComponent(savedTeams[teamKey][monKey].item.url);
          }
          if (savedTeams[teamKey][monKey].activeMove.moveObj.name) {
            savedTeams[teamKey][monKey].activeMove.moveObj.typeImageUrl = encodeURIComponent(savedTeams[teamKey][monKey].activeMove.moveObj.typeImageUrl);
            savedTeams[teamKey][monKey].activeMove.moveObj.categoryUrl = encodeURIComponent(savedTeams[teamKey][monKey].activeMove.moveObj.categoryUrl);
          }
          if (savedTeams[teamKey][monKey].moves.move_1.name || savedTeams[teamKey][monKey].moves.move_2.name || savedTeams[teamKey][monKey].moves.move_3.name || savedTeams[teamKey][monKey].moves.move_4.name) {
            for (let k = 1; k <= 4; k++) {
              if (!savedTeams[teamKey][monKey]['moves']['move_' + k].name) continue;
              savedTeams[teamKey][monKey]['moves']['move_' + k].typeImageUrl = encodeURIComponent(savedTeams[teamKey][monKey]['moves']['move_' + k].typeImageUrl);
              savedTeams[teamKey][monKey]['moves']['move_' + k].categoryImageUrl = encodeURIComponent(savedTeams[teamKey][monKey]['moves']['move_' + k].categoryImageUrl);
            }
          }
        }
      }
    }

    fetch('/api/saveUserTeams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
      },
      body: JSON.stringify({ username: props.username, team: savedTeams })
    })
      .then(data => {
        console.log(data);
        console.log('saved teams to database!');
      });
  }

  return (
    <Box sx={{ display: "flex", height: '100%', width: '30%', justifyContent: 'center' }}>
      <Grow in={props.savedTeamsDisplay}>
        <Box sx={{ height: '100%', width: '100%' }}>
          <Paper elevation={2} className="all-saved-teams-container" sx={{ backgroundColor: theme.palette.primary.main }}>
            <Typography variant="h4" gutterBottom>
              my saved teams
            </Typography>
            <div className="all-saved-teams">{allTeams}</div>
          </Paper>
        </Box>
      </Grow>
    </Box>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AllSavedTeams);
