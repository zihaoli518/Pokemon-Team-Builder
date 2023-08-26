/**
 * ************************************
 *
 * @module AllSavedTeams
 * @author zi 
 * @date
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


const mapStateToProps = (state) => {
  return {
    savedTeams: state.userFunctions.savedTeams,
    username: state.userFunctions.username,
    saveToDatabase: state.userFunctions.saveToDatabase,
    currentPokemon: state.pokemon.currentPokemon,
    teamLength: state.pokemon.yourTeam.size,
  };
};

const mapDispatchToProps = dispatch => ({
  refreshAndDecodeSavedTeams : (savedTeams) => dispatch(actions.refreshAndDecodeSavedTeams(savedTeams)),

});



const AllSavedTeams= (props) => {
  const [allTeams, setAllTeams] = useState([])

  // caching the last saved team, if it's exactly the same then don't make API call
  const [savedTeamsCache, setSavedTeamsCache] = useState([]);
  // state for if the display is collapsed
  const [collapsed, setCollapsed] = useState(false);
  

  // useEffect responsible for populating allTeams state (containing jsx elements to be displayed) every time anything is updated in any team
  useEffect(() => {
    // console.log('inside AllSavedTeams useEffect')
    populateSavedTeams();
  }, [props.savedTeams])
  
  // useEffect for saving teams to database
  useEffect(() => {
    console.log('inside 2nd useEffect', (JSON.stringify(savedTeamsCache)===JSON.stringify(props.savedTeams)))

    if (JSON.stringify(savedTeamsCache)===JSON.stringify(props.savedTeams)) return; 
    if (props.username && props.savedTeams.team_1) saveTeamsToDatabase(props.savedTeams);
    // set cache 
    setSavedTeamsCache({...props.savedTeams});
  }, [props.currentPokemon.slot.team, props.currentPokemon.slot.mon, props.teamLength] )

  
  const populateSavedTeams = () => {
    console.log('inside populateSavedTeams', props.savedTeams)
    if (!props.savedTeams) return;
    const CopyOfSavedTeams = JSON.parse(JSON.stringify(props.savedTeams));

    const allSavedTeamsToBeDisplayed = [];
    for (let i=1; i<=Object.keys(CopyOfSavedTeams).length; i++) {
      let currentTeamName = 'untitled ' + i, currentTeam = null, currentTeamKey = 'team_' + i;

      if (CopyOfSavedTeams[currentTeamKey]) {
        currentTeamName = CopyOfSavedTeams[currentTeamKey]['name']
        currentTeam = CopyOfSavedTeams[currentTeamKey];
        currentTeam.key = currentTeamKey;
        // decode url for item
        for (let j=1; j<=6; j++) {    
          let mon = 'mon'+j;
          if (currentTeam[mon] && currentTeam[mon].item.url) currentTeam[mon].item.url = decodeURIComponent(currentTeam[mon].item.url)
        }
      }
      console.log('inside populateSavedTeams for loop: ', props.savedTeams, currentTeamKey, props.savedTeams[currentTeamKey])
      // console.log(selectedTeam, selectedMon);
      allSavedTeamsToBeDisplayed.push(
          <SavedTeam
            key={i + currentTeamKey}
            savedTeamName={currentTeamName}
            savedTeam={currentTeam}
            savedTeamKey={currentTeamKey}
          />)
      if (i===Object.keys(props.savedTeams).length) break;
    }
    // console.log('end of populateTeams, ', allSavedTeamsToBeDisplayed)
    setAllTeams(allSavedTeamsToBeDisplayed); 
    // if (props.savedTeams.team_1 && !props.savedTeams.team_1.mon1) props.refreshAndDecodeSavedTeams(CopyOfSavedTeams)
  }


  const saveTeamsToDatabase = (stateOfTeams) => {
    const savedTeams = JSON.parse(JSON.stringify(stateOfTeams))
    // parse ' for json 
    if (savedTeams.team_1.mon1) {
      for (let i=1; i<=Object.keys(savedTeams).length; i++) {
        const teamKey = 'team_' + i; 
        for (let j=1; j<=6; j++) {
          const monKey = 'mon' + j;
          if (!savedTeams[teamKey][monKey]) break;
          // console.log('in savedTeamsToDataBase... ', savedTeams[teamKey][monKey])
          savedTeams[teamKey][monKey].activeAbility.description = savedTeams[teamKey][monKey].activeAbility.description.replace(/[\/\(\)\']/g, "&apos;")
          if (savedTeams[teamKey][monKey].item.item) {
            // savedTeams[teamKey][monKey].item.description = savedTeams[teamKey][monKey].item.description.replace(/[\/\(\)\']/g, "&apos;");
            savedTeams[teamKey][monKey].item.url = encodeURIComponent(savedTeams[teamKey][monKey].item.url);
          }
          if (savedTeams[teamKey][monKey].activeMove.moveObj.name) {
            savedTeams[teamKey][monKey].activeMove.moveObj.typeImageUrl = encodeURIComponent(savedTeams[teamKey][monKey].activeMove.moveObj.typeImageUrl);
            savedTeams[teamKey][monKey].activeMove.moveObj.categoryUrl = encodeURIComponent(savedTeams[teamKey][monKey].activeMove.moveObj.categoryUrl);
          }
          if (savedTeams[teamKey][monKey].moves.move_1.name || savedTeams[teamKey][monKey].moves.move_2.name || savedTeams[teamKey][monKey].moves.move_3.name || savedTeams[teamKey][monKey].moves.move_4.name) {
            for (let i=1; i<=4; i++) {
              if (!savedTeams[teamKey][monKey]['moves']['move_'+i].name) continue;
              savedTeams[teamKey][monKey]['moves']['move_'+i].typeImageUrl = encodeURIComponent(savedTeams[teamKey][monKey]['moves']['move_'+i].typeImageUrl);
              savedTeams[teamKey][monKey]['moves']['move_'+i].categoryImageUrl = encodeURIComponent(savedTeams[teamKey][monKey]['moves']['move_'+i].categoryImageUrl);
              // console.log('inside inner for loop... ', savedTeams[teamKey][monKey]['moves']['move_'+i].typeImageUrl, savedTeams[teamKey][monKey]['moves']['move_'+i].categoryImageUrl)
            }
          } 
          
        }
      }
      // savedTeams.team_1.mon1.activeAbility.description = savedTeams.team_1.mon1.activeAbility.description.replace(/[\/\(\)\']/g, "&apos;")
    }

    // // parse for special characters 
    // .replace(/[\/\(\)\']/g, "&apos;")

    console.log('about to send this thing: ', {username: props.username, team: savedTeams})
    fetch('/api/saveUserTeams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
      },
      body: JSON.stringify({username: props.username, team: savedTeams})
    })
      .then(data => {
        console.log(data);
        console.log('saved teams to database!')
      })
  }


  return (
    <div className='all-saved-teams-container'>
      <h4>Saved Teams</h4>
      {collapsed ?
        <div className='collapsed-all-saved-teams'> 
          
        </div>
        :
        <div className='all-saved-teams'>
          {allTeams}
        </div>
      }
    </div>
  );

}

export default connect(mapStateToProps, mapDispatchToProps)(AllSavedTeams)