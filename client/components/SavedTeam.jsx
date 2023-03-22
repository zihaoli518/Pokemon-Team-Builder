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
import SavedTeamMember from './SavedTeamMember.jsx';

import * as actions from '../actions/actions';


const mapStateToProps = (state) => {
  return {
    savedTeams: state.userFunctions.savedTeams,
  };
};

const mapDispatchToProps = dispatch => ({
  setYourTeam : (team) => dispatch(actions.setYourTeam(team)),
  editTeam: (key, team) => dispatch(actions.makeSavedTeamActive(key, team)),
  removeTeam: (key) => dispatch(actions.removeSavedTeam(key))
});


const SavedTeam = (props) => {
  
  const [team, setTeam] = useState([]);
  const [activeClassName, setActiveClassName] = useState('team-members need-saved-team-hover-effect');
  
  useEffect(() => {
    if(props.savedTeam) populateTeam();
  }, [props.savedTeam])

  let firstAdd = true;

  const populateTeam = () => {
    {console.log('inside populateTeam (saved team), ', props.savedTeam)}
    const newTeamToBeDisplayed = [];
    for (let i=1; i<=6; i++) {
      let selectedMon = 'mon' + i.toString();
      console.log(selectedMon)
      if (props.savedTeam && props.savedTeam[selectedMon]) {
        newTeamToBeDisplayed.push(
            <SavedTeamMember
            key={i+props.savedTeam[selectedMon]['pokemon']}

            selectedMon={selectedMon}
            pokemonData={props.savedTeam[selectedMon]}
            pokemonName={props.savedTeam[selectedMon]['pokemon']}
            />)
      } else if (props.savedTeam && !props.savedTeam[selectedMon] && firstAdd) {
        newTeamToBeDisplayed.push(
          <div className='saved-team-member-container'>
            {/* <img className='first-add-button' src="https://static.thenounproject.com/png/1649999-200.png" alt="" /> */}
          </div>
        )
        firstAdd = false;
      } else {
        newTeamToBeDisplayed.push(
          <div className='saved-team-member-container'>

          </div>)
      }
    }
    setTeam(newTeamToBeDisplayed);
  }

  const addActiveClass = () => {
    const previousActive = document.getElementsByClassName('active-saved-team');
    console.log('inside addActiveClass', previousActive)
    if (previousActive.length===0) {
      console.log('!previousActive')
      let activeTeam = document.getElementById(props.savedTeamKey)
      console.log(activeTeam)
      activeTeam.classList.add('active-saved-team')
    } else {
      console.log('else')
      console.log(previousActive[0].id, props.savedTeamKey)

      if(previousActive[0].id !==props.savedTeamKey) {
        previousActive[0].classList.remove('active-saved-team');
        let activeTeam = document.getElementById(props.savedTeamKey)
        activeTeam.classList.add('active-saved-team')
      }
    }

  }


  return (
    <div className='saved-team' onClick={() => {props.setYourTeam(props.savedTeam)}}>
      <h5>{props.savedTeamName}</h5>
      <div className='team-members need-saved-team-hover-effect' id={props.savedTeamKey} onClick={()=> {addActiveClass()}}>
        {team}
      </div>
      <img className='edit-team-button' src='https://cdn-icons-png.flaticon.com/512/6065/6065488.png' onClick={() => {props.editTeam(props.savedTeamKey ,props.savedTeam)}} />
      <img className='remove-team-button' src='https://www.pngplay.com/wp-content/uploads/7/Delete-Logo-PNG-HD-Quality.png' onClick={() => {props.removeTeam(props.savedTeamKey)}} />

    </div>
  );

}

export default connect(mapStateToProps, mapDispatchToProps)(SavedTeam)