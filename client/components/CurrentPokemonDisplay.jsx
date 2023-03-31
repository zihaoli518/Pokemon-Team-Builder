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

// importing files 
import * as actions from '../actions/actions';
import PokemonSprite from './PokemonSprite.jsx';
import StatChart from './StatChart.jsx';
import CurrentPokemonDetails from './CurrentPokemonDetails.jsx'



// currentPokemon contains all data. moveSet contains all moves(object)
const mapStateToProps = state => {
  return {
    currentPokemon : state.pokemon.currentPokemon,
    moveSet : state.pokemon.currentPokemon.moves,
    abilities: state.pokemon.currentPokemon.abilities,
    competetiveStatus : state.pokemon.currentPokemon.competetiveStatus,
    yourTeam : state.pokemon.yourTeam,
    enemyTeam: state.pokemon.enemyTeam
  }
}

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  addPokemonToYourTeam : (pokemonObj) => dispatch(actions.addPokemonToYourTeam(pokemonObj)),
  addPokemonToEnemeyTeam: (pokemonObj) => dispatch(actions.addPokemonToEnemyTeam(pokemonObj)),
  selectAbility : (ability) => dispatch(actions.selectAbility(ability)),

});

const types = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water']



class CurrentPokemonDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {pokemon: this.props.currentPokemon, immunities: [], weaknesses: [], resistances:[]}
  }

  componentWillMount = () => {
    this.generateWeakness(this.props.currentPokemon.pokemon);
  }

  componentDidUpdate = (prevState) => {
    // console.log('inside componentWillUpdate - CurrentPokemonDisplay')
    // console.log(prevState.currentPokemon, this.props.currentPokemon, this.state)
    if (prevState.currentPokemon.pokemon !== this.props.currentPokemon.pokemon) {
      this.generateWeakness();
      this.updateActiveAbility();
    }
  }

  // get the top 2 most common abilities - currently unavailable 
  // getAbilities() {
  //   let abilityMap = {};
  //   for (let i = 0; i < 2; i++) {
  //     // break in case pokemon only has 1 ability
  //     if (Object.keys(this.props.abilities)[i] === undefined) {
  //       break;
  //     }
  //     let currentAbility = Object.keys(this.props.abilities)[i];
  //     let currentPercentage =
  //       this.props.abilities[Object.keys(this.props.abilities)[i]];
  //     abilityMap[i] = [currentAbility, currentPercentage];
  //   }
  //   // console.log(abilityMap)
  //   return abilityMap;
  // }

  // get the top 4 most used moves for current pokemon - currently unavailable 
  // getMoveSet() {
  //   let moveSetMap = {};
  //   for (let i = 0; i < 4; i++) {
  //     let currentMove = Object.keys(this.props.moveSet)[i];
  //     let currentPercentage =
  //       this.props.moveSet[Object.keys(this.props.moveSet)[i]];
  //     moveSetMap[i] = [currentMove, currentPercentage];
  //   }
  //   return moveSetMap;
  // }
  generateWeakness(pokemon) {
    const newImmunitiesArray = [];
    const newWeaknessArray = [];
    const newResistanceArray = [];
    for (let type of types) {
      // console.log(type, this.props.currentPokemon.weakness[type])
      switch (this.props.currentPokemon.weakness[type]) {
        case 0:
          newImmunitiesArray.push(
            <h5 key={type} className={`type resistance-immune`} id={type}>{type}</h5>
          )
          break;
        case 0.25: 
          newResistanceArray.unshift(
            <h5 key={type} className={`type resistance-x4`} id={type}>{type}</h5>
          )
          break;
        case 0.5: 
          newResistanceArray.push(
            <h5 key={type} className={`type resistance-x2`} id={type}>{type}</h5>
          )
          break;
        case 2: 
          newWeaknessArray.push(
            <h5 key={type} className={`type weakness-x2`} id={type}>{type}</h5>
          )
          break;
        case 4: 
          newWeaknessArray.unshift(
            <h5 key={type} className={`type weakness-x4`} id={type}>{type}</h5>
          )
          break;

        default:
          break;
      }
    }
    // console.log('end of generateWeakness()',{immunities: newImmunitiesArray, weaknesses: newWeaknessArray, resistances:newResistanceArray})
    this.setState((state) => {
      return {pokemon: pokemon,immunities: newImmunitiesArray, weaknesses: newWeaknessArray, resistances:newResistanceArray}
    })
  }


  addToTeam(pokemon, team) {
    // e.preventDefault();
    if (team === "friendly") {
      this.props.addPokemonToYourTeam(pokemon);
    } else {
      this.props.addPokemonToEnemeyTeam(pokemon);
    }
  }

  updateActiveAbility() {
    const firstAbility = this.props.currentPokemon.abilities[0].ability
      const url = firstAbility.url;
      fetch(url)
        .then(data => data.json())
        .then(data => {
          let effectStr = data.effect_entries[1].effect; 
          let index = 0; 
          for (let i=0; i<effectStr.length; i++) {
            if (effectStr[i]==='O') {
              if (effectStr[i+1]==='v' && effectStr[i+2]==='e' && effectStr[i+3]==='r' && effectStr[i+4]==='w' ) break;
            }
            index++;
          }
          let newStr = effectStr.slice(0, index)
          console.log(newStr)
          let newAbilityObject = {name: firstAbility.name, description: newStr}
          this.props.selectAbility(newAbilityObject);
        })
  }

  render() {
    // if (this.props.currentPokemon.pokemon!==undefined) {
    {
      console.log("inside current pokemon display", this.props.currentPokemon.pokemon);
    }
    // {console.log(this.props.currentPokemon.pokemon)}
    return (
      <div className='current-pokemon-container'>
        <div key={this.props.currentPokemon.pokemon} className="current-pokemon">
          <div className="top-flexbox">
            <h3 id={this.props.currentPokemon.pokemon}> {this.props.currentPokemon.pokemon} </h3>
            <div className="types">
              <h4 className="type" id={this.props.currentPokemon.types[0]}>{this.props.currentPokemon.types[0]}</h4>
              <h4 className="type" id={this.props.currentPokemon.types[1]}>{this.props.currentPokemon.types[1]}</h4>
            </div>
            <div className="current-pokemon-spacer" ></div>
            <div className="option-buttons">
              <button className='add-to-your-team' onClick={()=>{this.addToTeam(this.props.currentPokemon, 'friendly');console.log('onclick fired GREEN')}}>Add</button>
              <button className='add-to-enemy-team' onClick={()=>{this.addToTeam(this.props.currentPokemon, 'enemy');console.log('onclick fired RED')}}>Add</button>
            </div>
          </div>
          <div className="current-pokemon-flexbox">
            
            <PokemonSprite
              pokemon={this.props.currentPokemon.pokemon}
              className="pokemon-class"
            />

            <div className="stats">
              {/* <h5>Base Stats</h5> */}
              <StatChart name={this.props.currentPokemon.pokemon} pokemonStats={this.props.currentPokemon.stats} currentPokemon={this.props.currentPokemon}/>
            </div>
          </div>
          <div className='current-pokemon-weakness-summary'> 
          <div className='weaknesses'>
                <h4>immunity : </h4>
                <div className='weaknesses-inner'>
                  {this.state.immunities}
                </div>
            </div>
            <div className='weaknesses'>
                <h4>weakness : </h4>
                <div className='weaknesses-inner'>
                  {this.state.weaknesses}
                </div>
            </div>
            <div className='weaknesses'>
                <h4>resistance : </h4>
                <div className='weaknesses-inner'>
                  {this.state.resistances}
                </div>
            </div>
          </div>
          <div>{/* counters and weakness */}</div>
        </div>
        <CurrentPokemonDetails />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentPokemonDisplay)