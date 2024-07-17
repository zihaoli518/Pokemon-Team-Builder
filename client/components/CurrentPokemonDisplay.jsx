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
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { connect } from 'react-redux';

// importing files 
import * as actions from '../actions/actions';
import PokemonSprite from './PokemonSprite.jsx';
import StatChartRadar from './StatChartRadar.jsx';
import CurrentPokemonDetails from './CurrentPokemonDetails.jsx'
import EvolutionTree from './EvolutionTree.jsx';
import ImportExportModal from './modals/ImportExportModal.jsx';

import { useTheme } from '@mui/material/styles';

import isEqualState from 'lodash.isequal';

// currentPokemon contains all data. moveSet contains all moves(object)
const mapStateToProps = state => {
  return {
    currentPokemon : state.pokemon.currentPokemon,
    moveSet : state.pokemon.currentPokemon.moves,
    abilities: state.pokemon.currentPokemon.abilities,
    competetiveStatus : state.pokemon.currentPokemon.competetiveStatus,
  }
}

const mapDispatchToProps = dispatch => ({
  addPokemonToYourTeam : (pokemonObj) => dispatch(actions.addPokemonToYourTeam(pokemonObj)),
  addPokemonToEnemeyTeam: (pokemonObj) => dispatch(actions.addPokemonToEnemyTeam(pokemonObj)),
  selectAbility : (ability) => dispatch(actions.selectAbility(ability)),
  addMonToCalc : (pokemonObj, team) => dispatch(actions.addMonToCalc(pokemonObj, team))
});

const types = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water']


const CurrentPokemonDisplay = (props) => {
  const [state, setState] = useState({ 
    pokemon: props.currentPokemon, 
    immunities: [], 
    weaknesses: [], 
    resistances: [] 
  });

  const [prevPokemon, setPrevPokemon] = useState({ current: null });


  const theme = useTheme();

  const playCrySound = useCallback(() => {
    const parsedName = props.currentPokemon.pokemon.replace('-', '');
    const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${parsedName}.mp3`;
    const cryAudio = new Audio(cryUrl);
    cryAudio.play();
  }, [props.currentPokemon.pokemon]);

  const generateWeakness = useCallback(() => {
    const newImmunitiesArray = [];
    const newWeaknessArray = [];
    const newResistanceArray = [];
    for (let type of types) {
      switch (props.currentPokemon.weakness[type]) {
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
    setState({ 
      pokemon: props.currentPokemon.pokemon,
      immunities: newImmunitiesArray, 
      weaknesses: newWeaknessArray, 
      resistances: newResistanceArray
    });
  }, [props.currentPokemon]);

  const addToTeam = useCallback((pokemon, team) => {
    if (team === "friendly") {
      props.addPokemonToYourTeam(pokemon);
    } else {
      props.addPokemonToEnemeyTeam(pokemon);
    }
  }, [props]);

  const updateActiveAbilityOnNewSearch = useCallback(() => {
    const activeAbility = props.currentPokemon.activeAbility; 
    const firstAbility = props.currentPokemon.abilities[0].ability;
    const url = firstAbility.url;
    fetch(decodeURIComponent(url))
      .then(data => data.json())
      .then(data => {
        let effectStr = data.effect_entries[1].effect; 
        let array = effectStr.split(/\r?\n|\r|\n/g);
        let newStr = array[0];
        let newAbilityObject = { name: firstAbility.name, description: newStr };
        props.selectAbility(newAbilityObject);
        makeDivActive('ability1', 'active-ability-highlighted');
      })
  }, [props]);

  const makeDivActive = useCallback((div, activeClassName) => {
    const previousActive = document.getElementsByClassName(activeClassName);
    if (previousActive.length !== 0) {
      if (previousActive[0].classList !== div) {
        previousActive[0].classList.remove(activeClassName);
      }
    } 
    const container = document.getElementsByClassName(div)[0];
    container.classList.add(activeClassName);
  }, []);


  const prevPokemonRef = useRef(props.currentPokemon);

  useEffect(() => {
    generateWeakness();
    playCrySound();
    if (props.currentPokemon.slot.mon === null && !isEqualState(prevPokemon.current, props.currentPokemon)) {
      console.log('currentPokemonDisplay bug: ', prevPokemonRef.current, props.currentPokemon )
      updateActiveAbilityOnNewSearch();
    }
    setPrevPokemon({ current: props.currentPokemon });
  }, [props.currentPokemon]);


  return (
    <div className='current-pokemon-container' 
      key={props.currentPokemon.slot.mon}
    >
      <EvolutionTree />
      <div className='current-pokemon-outter-flexbox'>
        <div key={props.currentPokemon.pokemon} 
          className="current-pokemon"
          style={{backgroundColor: theme.palette.background.paper}}
        >
          <div className="top-flexbox">
            <h3 id={props.currentPokemon.pokemon}> {props.currentPokemon.pokemon} </h3>
            <div className="types">
              <h4 className={"type"} id={props.currentPokemon.types[0]}>{props.currentPokemon.types[0]}</h4>
              <h4 className={"type"+" type-"+props.currentPokemon.types[1]} id={props.currentPokemon.types[1]}>{props.currentPokemon.types[1]}</h4>
            </div>
            <div className="current-pokemon-spacer" ></div>
          </div>
          <div className="current-pokemon-flexbox">
            <div className='current-sprite-main-container'>
              <PokemonSprite
                key={props.currentPokemon.slot.mon}
                pokemon={props.currentPokemon.pokemon}
                className="current-sprite-main"
              />
            </div>
            <div className="stats">
              <StatChartRadar name={props.currentPokemon.pokemon} pokemonStats={props.currentPokemon.stats} currentPokemon={props.currentPokemon} id={'current-pokemon-chart'}/>
            </div>
          </div>
          <div className={'oval-ground ' + 'type-'+props.currentPokemon.types[0]}>
          </div>
          <div className='current-pokemon-weakness-summary'> 
            <div className='weaknesses'>
              <h4>immunity : </h4>
              <div className='weaknesses-inner'>
                {state.immunities}
              </div>
            </div>
            <div className='weaknesses'>
              <h4>weakness : </h4>
              <div className='weaknesses-inner'>
                {state.weaknesses}
              </div>
            </div>
            <div className='weaknesses'>
              <h4>resistance : </h4>
              <div className='weaknesses-inner'>
                {state.resistances}
              </div>
            </div>
          </div>
        </div>
        <div className="add-to-team-option-buttons">
          <div className='f'>
            <button className='add-to-your-team' onClick={()=>{addToTeam({...props.currentPokemon}, 'friendly')}}>Add</button>
            <button className='add-to-calc' onClick={()=>{props.addMonToCalc({...props.currentPokemon}, 'friendly')}}>Calc</button>
          </div>
          <div className='add-to-team-option-spacer'></div>
          <div className='e'>
            <button className='add-to-enemy-team' onClick={()=>{addToTeam({...props.currentPokemon}, 'enemy')}}>Add</button>
            <button className='add-to-calc' onClick={()=>{props.addMonToCalc({...props.currentPokemon}, 'enemy')}}>Calc</button>
          </div>
        </div>

      </div>
      <CurrentPokemonDetails />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentPokemonDisplay);
