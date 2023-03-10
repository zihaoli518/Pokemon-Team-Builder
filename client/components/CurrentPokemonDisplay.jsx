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
  addPokemonToEnemeyTeam: (pokemonObj) => dispatch(actions.addPokemonToEnemyTeam(pokemonObj))
});

const types = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water']



class CurrentPokemonDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {weaknesses: [], resistances:[]}
  }

  // getTypes() {
  //   console.log('inside getTypes(): ', this.props.currentPokemon.types)
  //   if (this.props.currentPokemon.types.length=1) console.log('length is 1'); return [this.props.currentPokemon.types[0], ' '];
  //   return this.props.currentPokemon.types
  // }

  componentWillMount = () => {
    this.generateWeakness();
  }

  componentWillUpdate = () => {
    console.log('inside componentWillUpdate - CurrentPokemonDisplay')
    console.log(this.props.yourTeam)
    this.generateWeakness();
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
  generateWeakness() {
    const newWeaknessArray = [];
    const newResistanceArray = [];
    for (let type of types) {
      console.log('start of for loop, ', type, this.props.currentPokemon.weakness[type])
      switch (this.props.currentPokemon.weakness[type]) {
        case 0:
          newResistanceArray.push(
            <h5 className={`type resistance-immune`} id={type}>{type}</h5>
          )
          break;
        case 0.25: 
          newResistanceArray.push(
            <h5 className={`type resistance-x4`} id={type}>{type}</h5>
          )
          break;
        case 0.5: 
          newResistanceArray.push(
            <h5 className={`type resistance-x2`} id={type}>{type}</h5>
          )
          break;
        case 2: 
          newWeaknessArray.push(
            <h5 className={`type weakness-x2`} id={type}>{type}</h5>
          )
          break;
        case 4: 
          newWeaknessArray.push(
            <h5 className={`type weakness-x4`} id={type}>{type}</h5>
          )
          break;

        default:
          break;
      }
      console.log('end of for loop', newWeaknessArray, newResistanceArray)
    }
    console.log('end of generateWeakness()',{weaknesses: newWeaknessArray, resistances:newResistanceArray})
    this.setState({weaknesses: newWeaknessArray, resistances:newResistanceArray})

  }



  addToTeam(pokemon, team) {
    // e.preventDefault();
    if (team === "friendly") {
      this.props.addPokemonToYourTeam(pokemon);
    } else {
      this.props.addPokemonToEnemeyTeam(pokemon);
    }
  }

  render() {
    // if (this.props.currentPokemon.pokemon!==undefined) {
    {
      console.log("inside current pokemon display");
    }
    // {console.log(this.props.currentPokemon)}
    // {console.log(this.props.currentPokemon.pokemon)}
    return (
      <div key={this.props.currentPokemon.pokemon} className="current-pokemon">
        <div className="top-flexbox">
          <h3 id={this.props.currentPokemon.pokemon}> {this.props.currentPokemon.pokemon} </h3>
          <div className="types">
            <h4 className="type" id={this.props.currentPokemon.types[0]}>{this.props.currentPokemon.types[0]}</h4>
            <h4 className="type" id={this.props.currentPokemon.types[1]}>{this.props.currentPokemon.types[1]}</h4>
          </div>
          <div className="current-pokemon-spacer" ></div>
          <div className="option-buttons">
            <button className='add-to-your-team' onClick={()=>{this.addToTeam(this.props.currentPokemon, 'friendly');console.log('onclick fired GREEN')}}>Add to team </button>
            <button className='add-to-enemy-team' onClick={()=>{this.addToTeam(this.props.currentPokemon, 'enemy');console.log('onclick fired RED')}}>Add to enemy team</button>
          </div>
        </div>
        <div className="current-pokemon-flexbox">
          <div className="info">
            <div className="outter">
              {this.props.competetiveStatus ? (
                <div className="competitive-info">
                  <h4>Usage Rate: <span>{this.props.currentPokemon.usage}</span></h4>
                  <h5>Most Used Abilities</h5>
                  <ul className="inner" id='inner-1'>
                    <li>
                      <h6>{this.getAbilities()[0][0]}</h6>
                      <p>{this.getAbilities()[0][1]}</p>
                    </li>
                    <li>
                      <h6>{this.getAbilities()[1][0]}</h6>
                      <p>{this.getAbilities()[1][1]}</p>
                    </li>
                  </ul>
                  <h5>Most Commonly Brought Moves</h5>
                  <ul className="inner">
                    <div className='row-1'>
                      <li>
                        <h6>{this.getMoveSet()[0][0]}</h6>
                        <p>{this.getMoveSet()[0][1]}</p>
                      </li>
                      <li>
                        <h6>{this.getMoveSet()[1][0]}</h6>
                        <p>{this.getMoveSet()[1][1]}</p>
                      </li>
                    </div>
                    <div className='row-2'>
                      <li>
                        <h6>{this.getMoveSet()[2][0]}</h6>
                        <p>{this.getMoveSet()[2][1]}</p>
                      </li>
                      <li>
                        <h6>{this.getMoveSet()[3][0]}</h6>
                        <p>{this.getMoveSet()[3][1]}</p>
                      </li>
                    </div>
                  </ul>
                </div>
              ) : (
                // alert(
                //   "No competitive stats found! Current version of the app only supports gen8 OU tier... sorry"
                // )
                null
              )}
            </div>
          </div>
          
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
              <h5>weakness: </h5>
              <div className='weaknesses-inner'>
                {this.state.weaknesses}
              </div>
          </div>
          <div className='weaknesses'>
              <h5>resistance: </h5>
              <div className='weaknesses-inner'>
                {this.state.resistances}
              </div>
          </div>
        </div>
        <div>{/* counters and weakness */}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentPokemonDisplay)