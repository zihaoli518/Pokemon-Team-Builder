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
import StatChartRadar from './StatChartRadar.jsx';
import CurrentPokemonDetails from './CurrentPokemonDetails.jsx'



// currentPokemon contains all data. moveSet contains all moves(object)
const mapStateToProps = state => {
  return {
    currentPokemon : state.pokemon.currentPokemon,
    moveSet : state.pokemon.currentPokemon.moves,
    abilities: state.pokemon.currentPokemon.abilities,
    competetiveStatus : state.pokemon.currentPokemon.competetiveStatus,
    // yourTeam : state.pokemon.yourTeam,
    // enemyTeam: state.pokemon.enemyTeam
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
    this.playCrySound();
  }

  componentDidUpdate = (prevState) => {
    // console.log('inside componentWillUpdate - CurrentPokemonDisplay')
    // console.log(this.props.currentPokemon)
    if (prevState.currentPokemon.pokemon !== this.props.currentPokemon.pokemon) {
      this.playCrySound();
      this.generateWeakness();
      if (this.props.currentPokemon.slot.mon===null) this.updateActiveAbilityOnNewSearch();
    }
  }

  playCrySound() {
    const parsedName = this.props.currentPokemon.pokemon.replace('-', '');
    const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${parsedName}.mp3`;
    const cryAudio = new Audio(cryUrl);
    cryAudio.play();
  }

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

  updateActiveAbilityOnNewSearch() {
    const activeAbility = this.props.currentPokemon.activeAbility; 
    // if (activeAbility.name && activeAbility.name===this.props.currentPokemon.abilities[0].ability.name) return;
    const firstAbility = this.props.currentPokemon.abilities[0].ability
    const url = firstAbility.url;
    fetch(decodeURIComponent(url))
      .then(data => data.json())
      .then(data => {
        let effectStr = data.effect_entries[1].effect; 

        let array = effectStr.split(/\r?\n|\r|\n/g)
        let newStr = array[0]
        let newAbilityObject = {name: firstAbility.name, description: newStr}
        this.props.selectAbility(newAbilityObject);

        // highlight first ability by default;

        this.makeDivActive('ability1', 'active-ability-highlighted')
      })
  }

  // generalized function that makes a div have an unique classname (for active effects)
  makeDivActive(div, activeClassName) {
    // check if another div already has the active class, remove if found 
    const previousActive = document.getElementsByClassName(activeClassName);
    if (previousActive.length!==0) {
      if (previousActive[0].classList !== div) {
        previousActive[0].classList.remove(activeClassName);
      }
    } 
    const container = document.getElementsByClassName(div)[0];
    container.classList.add(activeClassName)
  }


  render() {
    // if (this.props.currentPokemon.pokemon!==undefined) {
    {
      console.log("inside current pokemon display", this.props.currentPokemon.pokemon);
    }
    // {console.log(this.props.currentPokemon.pokemon)}
    return (
      <div className='current-pokemon-container' key={this.props.currentPokemon.slot.mon}>
        <div className='evolution-container'>
        <h4>evolution tree</h4>
        <div>
          <h4>charizard</h4>
        </div>
        </div>
        <div className='current-pokemon-outter-flexbox'>
          <div key={this.props.currentPokemon.pokemon} className="current-pokemon">
            <div className="top-flexbox">
              <h3 id={this.props.currentPokemon.pokemon}> {this.props.currentPokemon.pokemon} </h3>
              <div className="types">
                <h4 className="type" id={this.props.currentPokemon.types[0]}>{this.props.currentPokemon.types[0]}</h4>
                <h4 className="type" id={this.props.currentPokemon.types[1]}>{this.props.currentPokemon.types[1]}</h4>
              </div>
              <div className="current-pokemon-spacer" ></div>
              <div className="levels">
                <h4>level 100</h4>
              </div>
            </div>
            <div className="current-pokemon-flexbox">
              
              <PokemonSprite
                key={this.props.currentPokemon.slot.mon}
                pokemon={this.props.currentPokemon.pokemon}
                className="pokemon-class"
              />

              <div className="stats">
                {/* <h5>Base Stats</h5> */}
                <StatChartRadar name={this.props.currentPokemon.pokemon} pokemonStats={this.props.currentPokemon.stats} currentPokemon={this.props.currentPokemon} id={'current-pokemon-chart'}/>
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
          </div>
          <div className="add-to-team-option-buttons">
              <button className='add-to-your-team' onClick={()=>{this.addToTeam({...this.props.currentPokemon}, 'friendly')}}>Add</button>
              <button className='add-to-enemy-team' onClick={()=>{this.addToTeam({...this.props.currentPokemon}, 'enemy')}}>Add</button>
          </div>
          <div className="down-arrow-gifs">
              <img className='arrow1' src="https://media3.giphy.com/media/deKZM8D0orxwQ18qtB/giphy.gif?cid=ecf05e47wdglkthtva45fblr1v52dyqktaeiws7a2zi294tv&rid=giphy.gif&ct=s" alt="" />
              <img className='arrow2'src="https://media3.giphy.com/media/deKZM8D0orxwQ18qtB/giphy.gif?cid=ecf05e47wdglkthtva45fblr1v52dyqktaeiws7a2zi294tv&rid=giphy.gif&ct=s" alt="" />
          </div>
        </div>
        <CurrentPokemonDetails />

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentPokemonDisplay)