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
      <div className='team-member'>
        <PokemonSprite
          pokemon={props.pokemonName}
          className={"pokemon-sprite-class-small"}
          onClick={()=>{props.selectTeamMember(props.pokemonData)}}
        />
      </div>
      {/* <div className='types-colors'>
        <div className='types-colors-inner' id={props.pokemonData.types[0]}></div>
        {(props.pokemonData.types[1]) ? 
          <div className='types-colors-inner' id={props.pokemonData.types[1]}></div> 
          : null}
      </div> */}
    </div>
  );
}

export default connect(null, mapDispatchToProps)(SavedTeamMember);