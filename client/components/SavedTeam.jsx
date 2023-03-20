/**
 * ************************************
 *
 * @module SavedTeam
 * @author zi 
 * @date
 * @description SavedTeam
 *
 * ************************************
 */

// importing dependencies 
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PokemonSprite from './PokemonSprite.jsx';
import SavedTeamMember from './TeamMember.jsx';

const mapStateToProps = (state) => {
  return {
    savedTeams: state.userFunctions.savedTeams
  };
};


const SavedTeam= (props) => {
  
  const [team, setTeam] = useState([]);
  
  useEffect(() => {
    populateTeam()
  }, [props.savedTeam])

  const populateTeam = () => {
    {console.log('inside populateTeam (saved team), ', props.savedTeam)}
    const newTeamToBeDisplayed = [];
    for (let i=1; i<=6; i++) {
      let selectedMon = 'mon' + i.toString();
      if (props.savedTeam && props.savedTeam[selectedMon]) {
        newTeamToBeDisplayed.push(
            <SavedTeamMember
            key={props.savedTeam[selectedMon]['pokemon']}

            selectedMon={selectedMon}
            pokemonData={props.savedTeam[selectedMon]}
            pokemonName={props.savedTeam[selectedMon]['pokemon']}
            />)
      };
    }
    setTeam(newTeamToBeDisplayed);
  }


  return (
    <div className='saved-team'>
      <h4>team name</h4>
      <div className='team-members'>
        {team}
      </div>
    </div>
  );

}

export default connect(mapStateToProps, null)(SavedTeam)