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
import React from 'react';
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
  return (
    <div className="team-member-container" id={props.selectedTeamName + '_' + props.selectedMon}>
      <div className='team-member' id='need-team-member-hover-effect'>
        <PokemonSprite
          pokemon={props.pokemonName}
          className={"pokemon-sprite-class-small"}
          onClick={()=>{props.selectTeamMember(props.pokemonData)}}
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