/**
 * ************************************
 *
 * @module  BrowsingHistory
 * @author zi 
 * @date
 * @description sets and read cache from local storage in browser and dispaly the last 10 pokemon the user looked up 
 *
 * ************************************
 */

// importing dependencies 
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import Data from './dexData.js';
// importing other files and components
import PokemonSprite from './PokemonSprite.jsx';
import ImportExportModal from './modals/ImportExportModal.jsx';

const allMonsJSON = Data.allMonsJSON;

const mapStateToProps = state => {
  return {
    historyCache: state.pokemon.historyCache,
  }
}

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  addPokemon : (pokemon) => dispatch(actions.addPokemon(pokemon)),
  updatePokemon: (pokemon, pokemonData, mode) => dispatch(actions.updatePokemonPokeAPI(pokemon, pokemonData, mode)),
  updateHistoryCache: (type, pokemonObj, array) => dispatch(actions.updateHistoryCache(type, pokemonObj, array)),

});


const BrowsingHistory = props => {
  console.log('BrowsingHistory is re-rendering', props.historyCache)

  const [cacheOfHistoryDisplay, setCacheOfHistoryDisplay] = useState([]);

  const populateHistory = () => {
    console.log('inside populateHistory')
    // check if we should poppulate from local storage 
    if (!localStorage.getItem('pokemon-team-builder-history-cache')) localStorage.setItem('pokemon-team-builder-history-cache', '[]');

    let historyFromLocalStorage = JSON.parse(localStorage.getItem('pokemon-team-builder-history-cache'));
    // console.log('historyFromLocalStorage, ', historyFromLocalStorage, props.historyCache);

    const newCacheDisplay = [];
    // initial load 
    if (!props.historyCache[0]) {
      
      // sync redux state with the data stored in loccalStorage 
      if (JSON.stringify(props.historyCache) !== JSON.stringify(historyFromLocalStorage)) props.updateHistoryCache('sync', null, historyFromLocalStorage);
    } else {
      localStorage.setItem('pokemon-team-builder-history-cache', JSON.stringify(props.historyCache));
      historyFromLocalStorage = props.historyCache;
    }


    for (let i=0; i<historyFromLocalStorage.length; i++){
      const pokemonObj = historyFromLocalStorage[i];
      newCacheDisplay.push(
          <PokemonSprite
            key={pokemonObj.pokemon + i}
            pokemon={pokemonObj.pokemon}
            pokedexId={pokemonObj.pokedexId}
            onClick={() => {props.updatePokemon(pokemonObj.name, pokemonObj, 'cached')}}
            className={"pokemon-sprite-cache"}
            type={"still"}
            // onClick={()=>{props.selectTeamMember(props.pokemonData)}}
          />
      );
    }
    setCacheOfHistoryDisplay(newCacheDisplay);
  }


  useEffect(() => {
    populateHistory();
  }, [props.historyCache])

  return (
    <div className='browsing-history' id='browsing-history' >
      {cacheOfHistoryDisplay}
      <img className='browsing-history-logo' src="/static/history.png" alt="" />
      <ImportExportModal />
    </div>
  )
}

// helper functions 
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, function(match) {
    return match.toUpperCase();
  }).replace(/-/g, ' ');
}



export default connect(mapStateToProps, mapDispatchToProps)(BrowsingHistory);