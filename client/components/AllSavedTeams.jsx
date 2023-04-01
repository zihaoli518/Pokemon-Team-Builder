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

const mapStateToProps = (state) => {
  return {
    savedTeams: state.userFunctions.savedTeams,
    username: state.userFunctions.username
  };
};



const AllSavedTeams= (props) => {
  const [allTeams, setAllTeams] = useState([])

  
  useEffect(() => {
    console.log('inside AllSavedTeams useEffect')
    populateSavedTeams();
    console.log(allTeams);
    if (props.username && props.savedTeams.team_1) saveTeamsToDatabase(props.savedTeams)
  }, [props.savedTeams])

  
  const populateSavedTeams = () => {
    console.log('inside populateSavedTeams', props.savedTeams,)
    if (!props.savedTeams) return;
    const allSavedTeamsToBeDisplayed = [];
    for (let i=1; i<=Object.keys(props.savedTeams).length; i++) {
      let currentTeamName = 'untitled ' + i, currentTeam = null, currentTeamKey = 'team_' + i;

      if (props.savedTeams[currentTeamKey]) {
        currentTeamName = props.savedTeams[currentTeamKey]['name']
        currentTeam = props.savedTeams[currentTeamKey];
        currentTeam.key = currentTeamKey;
        console.log('inside if, ', currentTeamKey, currentTeam)
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
    console.log('end of populateTeams, ', allSavedTeamsToBeDisplayed)
    setAllTeams(allSavedTeamsToBeDisplayed); 
  }


  const saveTeamsToDatabase = (savedTeams) => {
    // parse ' for json 
    if (savedTeams.team_1.mon1) {
      for (let i=1; i<=Object.keys(savedTeams).length; i++) {
        const teamKey = 'team_' + i; 
        for (let j=1; j<=6; j++) {
          const monKey = 'mon' + j;
          if (!savedTeams[teamKey][monKey]) break;
          savedTeams[teamKey][monKey].activeAbility.description = savedTeams[teamKey][monKey].activeAbility.description.replace(/[\/\(\)\']/g, "&apos;")
        }
      }
      // savedTeams.team_1.mon1.activeAbility.description = savedTeams.team_1.mon1.activeAbility.description.replace(/[\/\(\)\']/g, "&apos;")
    }

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
      <div className='all-saved-teams'>
        {allTeams}
      </div>
    </div>
  );

}

export default connect(mapStateToProps, null)(AllSavedTeams)