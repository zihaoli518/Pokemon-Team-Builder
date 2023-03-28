/**
 * ************************************
 *
 * @module PokemonSprite
 * @author zi 
 * @date
 * @description displays pokemon gif 
 *
 * ************************************
 */

// importing dependencies 
import React, {useState} from 'react';
import { connect } from 'react-redux';

import PokemonSprite from './PokemonSprite.jsx';
import * as actions from '../actions/actions';


const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  removeTeamMember : (team, pokemon) => dispatch(actions.removeTeamMember(team, pokemon)),
  selectTeamMember : (pokemon) => dispatch(actions.selectTeamMember(pokemon)),
});

const TeamMember = props => {
  // console.log('inside <TeamMember/>', props.pokemonData)

  const id = props.selectedTeamName + '_' + props.selectedMon;
  const ClassNamePassed = 'pokemon-sprite-class-small';

  const giveSelfActiveClass = () => {
    const previousActive = document.getElementsByClassName('need-active-team-member-hover-effect');
    console.log(previousActive)
    if (previousActive && previousActive.length!==0) {
      if (previousActive[0].id !== id) {
        previousActive[0].classList.remove('need-active-team-member-hover-effect');
      }
    }
    let activeMon = document.getElementById(id);
    activeMon.classList.add('need-active-team-member-hover-effect')
  }


  return (
    <div className="team-member-container">
      <div className='team-member'>
        <PokemonSprite
          pokemon={props.pokemonName}
          className={ClassNamePassed}
          id={props.selectedTeamName + '_' + props.selectedMon}
          onClick={()=>{
            giveSelfActiveClass();
            props.selectTeamMember(props.pokemonData);
          }}
        />
      <img className="remove-button" onClick={()=>props.removeTeamMember(props.selectedTeamName, props.selectedMon)} src='https://cdn-icons-png.flaticon.com/512/66/66847.png' ></img>
      </div>
      <div className='types-colors'>
        <div className='types-colors-inner' id={props.pokemonData.types[0]}></div>
        {(props.pokemonData.types[1]) ? 
          <div className='types-colors-inner' id={props.pokemonData.types[1]}></div> 
          : null}
      </div>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(TeamMember);