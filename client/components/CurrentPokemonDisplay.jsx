/**
 * ************************************
 *
 * @module CurrentPokemonDisplay
 * @author zi 
 * @date
 * @description displays pokemon info from fetch request 
 *
 * ************************************
 */

// importing dependencies 
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PokemonSprite from './PokemonSprite.jsx';

// importing files 
import * as actions from '../actions/actions';



// currentPokemon contains all data. mvoeSet contains all moves(object)
const mapStateToProps = state => ({
  currentPokemon : state.pokemon.currentPokemon,
  moveSet : state.pokemon.currentPokemon.moves,
  abilities: state.pokemon.currentPokemon.abilities
})

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  addPokemonToYourTeam : (pokemonObj) => dispatch(actions.addPokemonToYourTeam(pokemonObj)),
  addPokemonToEnemeyTeam: (pokemonObj) => dispatch(actions.addPokemonToEnemeyTeam(pokemonObj))
});


class CurrentPokemonDisplay extends Component {
  constructor(props) {
    super(props);
  }

  // getTypes() {
  //   console.log('inside getTypes(): ', this.props.currentPokemon.types)
  //   if (this.props.currentPokemon.types.length=1) console.log('length is 1'); return [this.props.currentPokemon.types[0], ' '];
  //   return this.props.currentPokemon.types
  // }

  // get the top 2 most common abilities 
  getAbilities() {
    let abilityMap = {}; 
    for (let i=0; i<2; i++) {
      // break in case pokemon only has 1 ability 
      if (Object.keys(this.props.abilities)[i]===undefined) {
        break;
      }
      let currentAbility = Object.keys(this.props.abilities)[i];
      let currentPercentage = this.props.abilities[Object.keys(this.props.abilities)[i]];
      abilityMap[i] = [currentAbility, currentPercentage]
    }
    // console.log(abilityMap)
    return abilityMap
  }

  // get the top 4 most used moves for current pokemon 
  getMoveSet() {
    let moveSetMap = {};
    for (let i=0; i<4; i++) {
      let currentMove = Object.keys(this.props.moveSet)[i];
      let currentPercentage = this.props.moveSet[Object.keys(this.props.moveSet)[i]];
      moveSetMap[i] = [currentMove, currentPercentage]
    }
    return moveSetMap
  }

  addToTeam(pokemon, team) {
    // e.preventDefault();
    if (team==='friendly') {
      this.props.addPokemonToYourTeam(pokemon)
    } else {
      this.props.addPokemonToEnemeyTeam(pokemon)
    }
  }

  render() {
    // if (this.props.currentPokemon.pokemon!==undefined) {
      {console.log('inside current pokemon display')}
      // {console.log(this.props.currentPokemon)}
      // {console.log(this.props.currentPokemon.pokemon)}
      return (
        <div className="current-pokemon">
          {/* <h4>{JSON.stringify(this.props.currentPokemon)}</h4> */}
          <div className='top-flexbox'>
            <h3>{this.props.currentPokemon.pokemon}</h3>
            <div className='option-buttons'>
              {/* <button onClick={this.addToTeam(this.props.currentPokemon, 'friendly')}>Add to your team</button>
              <button onClick={this.addToTeam(this.props.currentPokemon, 'enemey')}>Add to enemy team</button> */}
            </div>
          </div>
          <div className="current-pokemon-flexbox">
            <div className="info">
              <div className="outter">
                <div className='types'>
                  <h3>Type: </h3>
                  <div className='type-inner'>
                    <h4 className='type'>{this.props.currentPokemon.types[0]}</h4>
                    <h4 className='type'>{this.props.currentPokemon.types[1]}</h4>
                  </div>
                </div>
                <li>Usage Rate: {this.props.currentPokemon.usage}</li>
                <h5>Most Common Abilities</h5>
                <ul className="inner">
                  <li>
                    <h6>{this.getAbilities()[0][0]}</h6>
                    <p>{this.getAbilities()[0][1]}</p>
                  </li>
                  <li>
                    <h6>{this.getAbilities()[1][0]}</h6>
                    <p>{this.getAbilities()[1][1]}</p>
                  </li>
                </ul>
                <h5>Most Commonly Used Moves</h5>
                <ul className="inner">
                  <li>
                    <h6>{this.getMoveSet()[0][0]}</h6>
                    <p>{this.getMoveSet()[0][1]}</p>
                  </li>
                  <li>
                    <h6>{this.getMoveSet()[1][0]}</h6>
                    <p>{this.getMoveSet()[1][1]}</p>
                  </li>
                  <li>
                    <h6>{this.getMoveSet()[2][0]}</h6>
                    <p>{this.getMoveSet()[2][1]}</p>
                  </li>
                  <li>
                    <h6>{this.getMoveSet()[3][0]}</h6>
                    <p>{this.getMoveSet()[3][1]}</p>
                  </li>
                </ul>
              </div>
            </div>

            <PokemonSprite
              pokemon={this.props.currentPokemon.pokemon}
              className="pokemon-class"
            />

            <div className="stats">
              <h5>Base Stats</h5>
              <ul>
                <li>HP: {this.props.currentPokemon.stats.hp}</li>
                <li>Attack: {this.props.currentPokemon.stats.attack}</li>
                <li>Defense: {this.props.currentPokemon.stats.defense}</li>
                <li>
                  Special Attack: {this.props.currentPokemon.stats.specialA}
                </li>
                <li>
                  Special Defense: {this.props.currentPokemon.stats.specialD}
                </li>
                <li>Speed: {this.props.currentPokemon.stats.speed}</li>
              </ul>
            </div>
          </div>
          <div>
            {/* counters and weakness */}
          </div>
        </div>
      );
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentPokemonDisplay)