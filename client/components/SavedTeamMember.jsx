/**
 * ************************************
 *
 * @module SavedTeamMember
 * @author zi 
 * @date
 * @description SavedTeamMember
 *
 * ************************************
 */

// importing dependencies 
import React from 'react';
import { connect } from 'react-redux';

import PokemonSprite from './PokemonSprite.jsx';
import * as actions from '../actions/actions';


const mapDispatchToProps = dispatch => ({
  selectTeamMember : (pokemon) => dispatch(actions.selectTeamMember(pokemon)),
});

const SavedTeamMember = props => {
  // console.log('inside <TeamMember/>', props.pokemonData)
  return (
    <div className="saved-team-member-container" >
      <div className='saved-team-member'>
        <PokemonSprite
          key={props.key}
          pokemon={props.pokemonName}
          pokedexId={props.pokemonData.pokedexId}
          className={"pokemon-sprite-saved-team"}
          type={"still"}
          // onClick={()=>{props.selectTeamMember(props.pokemonData)}}
        />
      </div>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(SavedTeamMember);