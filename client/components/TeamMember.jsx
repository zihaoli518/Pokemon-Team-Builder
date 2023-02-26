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

  console.log('inside TeamMember component')

  return (
    <div className="team-member" id={props.selectedTeamName + '_' + props.selectedMon}>
        <PokemonSprite
          pokemon={props.pokemonName}
          className={"pokemon-sprite-class-small"}
          onClick={()=>{props.selectTeamMember(props.pokemonData)}}
        />
      <img className="remove-button" onClick={()=>props.removeTeamMember(props.selectedTeamName, props.selectedMon)} src='https://cdn-icons-png.flaticon.com/512/66/66847.png' ></img>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(TeamMember);