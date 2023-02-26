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
      <div onClick={()=>{props.selectTeamMember(props.pokemonData)}}>
        <PokemonSprite
          pokemon={props.pokemonName}
          className="pokemon-class-small" 
        />
      </div>
      <h3 onClick={()=>props.removeTeamMember(props.selectedTeamName, props.selectedMon)}>X</h3>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(TeamMember);