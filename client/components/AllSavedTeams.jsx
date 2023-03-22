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
  };
};


const AllSavedTeams= (props) => {
  const [allTeams, setAllTeams] = useState([])

  
  useEffect(() => {
    console.log('inside AllSavedTeams useEffect')
    populateSavedTeams();
    console.log(allTeams)
  }, [props.savedTeams])

  
  const populateSavedTeams = () => {
    console.log('inside populateSavedTeamds', props.savedTeams)
    const allSavedTeamsToBeDisplayed = [];
    for (let i=1; i<=Object.keys(props.savedTeams).length; i++) {
      let currentTeamName = 'untitled ' + i, currentTeam = null, currentTeamKey = 'team_' + i;

      if (props.savedTeams[currentTeamKey]) {
        currentTeamName = props.savedTeams[currentTeamKey]['name']
        currentTeam = props.savedTeams[currentTeamKey];
      }
      // console.log('inside populateSavedTeams for loop: ', props.savedTeams, currentTeam)
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
    setAllTeams(allSavedTeamsToBeDisplayed)
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