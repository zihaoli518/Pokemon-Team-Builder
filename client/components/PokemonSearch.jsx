/**
 * ************************************
 *
 * @module  PokemonSearch
 * @author zi 
 * @date
 * @description allows user to search pokemon 
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
import loadingGIF from '../../assets/loading-2.gif';

const allMonsJSON = Data.allMonsJSON;

const mapStateToProps = state => {
  return {
    currentPokemon : state.pokemon.currentPokemon,
    historyCache: state.pokemon.historyCache,
  }
}

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  addPokemon : (pokemon) => dispatch(actions.addPokemon(pokemon)),
  updatePokemon: (pokemon, pokemonData, mode) => dispatch(actions.updatePokemonPokeAPI(pokemon, pokemonData, mode)),
  updateHistoryCache: (type, pokemonObj, array) => dispatch(actions.updateHistoryCache(type, pokemonObj, array)),
});


const PokemonSearch = props => {
  
  const [modalDisplay, setModalDisplay] = useState(false);
  const [modalClassName, setModalClassName] = useState('pokedex-modal ');
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [once, setOnce] = useState(true);
  const [pokedex, setPokedex] = useState([]);
  console.log('PokemonSearch is re-rendering', modalDisplay)

  const populatePokedex = (searchStr, historyCache) => {
    const newPokedex = [];

    for (let monName of allMonsJSON) {
      let mon = monName[1]; 

      let highlightedStr = '';
      let restOfStr = mon.name; 

      // check if row should be pushed to array, if !searchStr then default push everything,  or if searchStr matches the start of item name
      if (searchStr) {
        // convert searchStr to str in case it starts with numbers
        searchStr = searchStr.toString();
        // format to highlight searched str
        highlightedStr = restOfStr.slice(0, searchStr.length);
        restOfStr = restOfStr.slice(searchStr.length, restOfStr.length);
        searchStr = capitalizeWords(searchStr)
      }

      if (!searchStr || highlightedStr===searchStr) {
        if (searchStr)  highlightedStr = searchStr;

        newPokedex.push(
          <div className='pokedex-row' onClick={(e) => {searchEventHandler(e, mon.name.toLowerCase(), historyCache)}}>
            <PokemonSprite
              key={mon.name}
              pokemon={mon.name}
              pokedexId={mon.pokedexId}
              className={"pokemon-sprite-pokedex"}
              type={"still"}
            // onClick={()=>{props.selectTeamMember(props.pokemonData)}}
            />
            <h4 className='pokedex-mon-name'><span>{highlightedStr}</span>{restOfStr}</h4>
            <img className='pokedex-type-1' src={`static/types-images/${mon.types[0].toLowerCase()}.png`} alt="" />
            {mon.types[1] ?
             <img className='pokedex-type-2' src={`static/types-images/${mon.types[1].toLowerCase()}.png`} alt="" />
            : null}
            <h4 className='pokedex-tier'>{mon.tier}</h4>
            <div className='pokedex-stats'>
              <div className='pokedex-stats-labels'>
                <h5>HP</h5>
                <h5>Atk</h5>
                <h5>Def</h5>
                <h5>SpA</h5>
                <h5>SpD</h5>
                <h5>Spe</h5>
              </div>
              <div className='pokedex-stats-base-stats'>
                <h5 style={{color : stat2color(mon.baseStats.hp, 110, 20)}}>{mon.baseStats.hp}</h5>
                <h5 style={{color : stat2color(mon.baseStats.atk, 110, 20)}}>{mon.baseStats.atk}</h5>
                <h5 style={{color : stat2color(mon.baseStats.def, 110, 20)}}>{mon.baseStats.def}</h5>
                <h5 style={{color : stat2color(mon.baseStats.spa, 110, 20)}}>{mon.baseStats.spa}</h5>
                <h5 style={{color : stat2color(mon.baseStats.spd, 110, 20)}}>{mon.baseStats.spd}</h5>
                <h5 style={{color : stat2color(mon.baseStats.spe, 110, 20)}}>{mon.baseStats.spe}</h5>
              </div>
            </div>
          </div>
        )
      }
    };
    setPokedex(newPokedex);
  }

  
  const searchEventHandler = (e, str, historyCache) => {
    console.log('inside searchEventHandler', historyCache);
    setLoadingStatus(true);
    e.stopPropagation();
    e.preventDefault();
    let pokemon = str;
    if (!str) {
      const input = document.getElementById('pokemon-search-name');
      let pokemonValue = input.value; 
      pokemon = pokemonValue.trim();
    } 

    setTimeout(() => {
      setModalClassName('pokedex-modal pokedex-fade-out');
      setTimeout(() => {
      const searchElement = document.getElementById("search-bar-element");
      searchElement.classList.remove("search-bar-element-focused");
      setModalDisplay(false);
      }, 1500);
      
    }, 400);

    console.log(historyCache, pokemon)
    // quickly loop thru the cache array to check if the data is saved, if found do not make api call 
    for (let i = 0; i < historyCache.length; i++) {
      const pokemonObj = historyCache[i];
      if (pokemonObj.pokemon === pokemon) {
        console.log('cached!!');
        setLoadingStatus(false);
        props.updatePokemon(pokemon, pokemonObj, 'cached');
        let newHistoryCache = [...historyCache];
        newHistoryCache.splice(i, 1);
        newHistoryCache.push(pokemonObj);
        props.updateHistoryCache('sync', null, newHistoryCache);
        return; 
      }
    }

    // const heroku = 'https://obscure-dawn-47563.herokuapp.com/';
    // ^ heroku is no longer free :(

    // fetching from smogon usage - feature currently suspended - data not updated 
    // fetch('/api/fetch-smogon', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json, text/plain',
    //   },
    //   body: JSON.stringify({pokemon: pokemon}),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log('smogon fetch data: ', data);
    //     // if (Object.keys(data.moves)[0]!==undefined) 
    //     props.addPokemon(data);
    //     // else alert('No competitive stats found! Current version of the app only supports gen8 OU tier... sorry');
    //     if (data.error === 404) {
    //       alert('Pokemon not found! Please check your spelling and try again :)')
    //     }})
    //   .catch((error) => {
    //     alert('Pokemon not found! Current version of the app only supports gen8 OU tier... sorry')
    //     console.log('error inside PokemonSearch: ', error)
    //   });
    

    // fetching from pokeAPI

    // setting url for fetch requests based on NODE_ENV 
    let backendURL = '/api/fetchPokeAPI';
    if (process.env.NODE_ENV==='production') backendURL = 'https://pokemon-team-builder-api.vercel.app/' + backendURL;

    fetch(backendURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
      },
      body: JSON.stringify({pokemon: pokemon})
    })
      .then((response) => response.json())
      .then((pokemonData) => {
        console.log('fetchPokeAPI ', pokemonData);
        setLoadingStatus(false);
        props.updatePokemon(pokemon, pokemonData);
        // if (pokemonData.error === 404) {
        //   alert('Pokemon not found! Please check your spelling and try again :)')
        // };
        const input = document.getElementById('pokemon-search-name')
        input.value = '';
        input.focus();
        // update cache 
      })
      .catch(error => {
        console.log('fetchPokeAPI error: ', error);
        alert('Pokemon not found! Please check your spelling and try again :)')
        setLoadingStatus(false);
      })
  }

  const searchAndDisplayDex = () => {
    const searchStr = document.getElementById('pokemon-search-name').value;
    populatePokedex(searchStr, props.historyCache);
  }

  const changeBackground = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const appContainer = document.querySelector("body");
    console.log(currentHour)
    document.querySelector("body")
    if (currentHour >= 5 && currentHour < 3) {
      appContainer.classList.add('morning');
    } else {
      appContainer.classList.add('afternoon');
    }
  }

  const addEventListenersOnce = () => {
    // add event listeners
    const searchElement = document.getElementById("search-bar-element");
    const searchBar = document.getElementById('pokemon-search-name');

    let clickOverride = false;
    let timeoutId;

    searchBar.addEventListener("focus", function () {
      console.log('adding focus function');
      clickOverride = true;
      searchElement.classList.add("search-bar-element-focused");
      setModalClassName('pokedex-modal pokedex-fade-in');

    });
    
    searchBar.addEventListener("blur", function () {
      clickOverride = false;
      console.log('adding blur function');
      searchElement.classList.remove("search-bar-element-focused");
      setTimeout(() => {
        if (clickOverride) {
          return
        }
        setModalClassName('pokedex-modal pokedex-fade-out');
        setTimeout(() => {
          if (!clickOverride) setModalDisplay(false);
        }, 800);
        
      }, 300);
    });
    setOnce(false);
  }

  useEffect(() => {
    if (once) addEventListenersOnce();
    populatePokedex(null, props.historyCache);
    changeBackground();
    // setModalDisplay(false)
  }, [props.historyCache]);

  useEffect(() => {
    // update cache 
    console.log('update cache - add ', props.currentPokemon);
    if (props.currentPokemon.pokemon) props.updateHistoryCache('add', props.currentPokemon, null);
    
  }, [props.currentPokemon.pokemon])

  return (
    <div className='search-bar-element' id='search-bar-element' >
      <form onSubmit={(e) => searchEventHandler(e, null, props.historyCache)}>
        <input type="text" id='pokemon-search-name' autocomplete="off" placeholder="search a mon" onClick={()=>{setModalDisplay(true)}} onKeyUp={()=>{searchAndDisplayDex()}} />
        <button type='submit'> <span> Search</span> </button>
      </form> 
      <div className={modalClassName} style={modalDisplay ? { display: 'block'} : { display: 'none' }} >
        {/* <div className='pokedex-labels'>
          <h4>pokémon</h4>
          <h4>type</h4>
          <h4>tier</h4>
          <h4>base stats</h4>
        </div> */}
        {pokedex}
      </div>
      {loadingStatus ? 
        <img className='between-rerender-loading-gif' src={loadingGIF} alt="" />
        : null}
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

 // helper function for generating color based on value 
 function stat2color(stat, max = maxStat, min = minStat) {
  // perc ranges from 0-100 and is responsible for the color scale 
  let perc;
  if (stat > max) perc = 100;
  else if (stat < min) perc = 0;
  else perc = (stat / (max / 100));

  var r,g,b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  } else {
    g = 255;
    r = Math.round(510 - 5.1 * perc);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  return "#" + ("000000" + h.toString(16)).slice(-6);
}

export default connect(mapStateToProps, mapDispatchToProps)(PokemonSearch);