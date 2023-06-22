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

const allMonsJSON = Data.allMonsJSON;

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  addPokemon : (pokemon) => dispatch(actions.addPokemon(pokemon)),
  updatePokemon: (pokemon, pokemonData) => dispatch(actions.updatePokemonPokeAPI(pokemon, pokemonData)),
  // updatePokemonName: (pokemon) => dispatch(actions.updatePokemonName(pokemon))
});


const PokemonSearch = props => {

  const [modalDisplay, setModalDisplay] = useState(false);
  const [modalClassName, setModalClassName] = useState('pokedex-modal ');
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [once, setOnce] = useState(true);
  const [pokedex, setPokedex] = useState([]);

  const populatePokedex = (searchStr) => {
    const newPokedex = [];

    for (let monName of allMonsJSON) {
      console.log('mon check', monName, monName[1])
      let mon = monName[1]; 
      newPokedex.push(
        <div className='pokedex-row' onClick={(e) => {console.log('pokedex-row clicked'); searchEventHandler(e, mon.name.toLowerCase())}}>
          <PokemonSprite
            key={mon.name}
            pokemon={mon.name}
            pokedexId={mon.pokedexId}
            className={"pokemon-sprite-pokedex"}
            type={"still"}
          // onClick={()=>{props.selectTeamMember(props.pokemonData)}}
          />
          <h4 className='pokedex-mon-name'>{mon.name}</h4>
          <h4 className='pokedex-type-1'>{mon.types[0]}</h4>
          <h4 className='pokedex-type-2'>{mon.types[1]}</h4>
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
              <h5>{mon.baseStats.hp}</h5>
              <h5>{mon.baseStats.atk}</h5>
              <h5>{mon.baseStats.def}</h5>
              <h5>{mon.baseStats.spa}</h5>
              <h5>{mon.baseStats.spd}</h5>
              <h5>{mon.baseStats.spe}</h5>  
            </div>
          </div>
        </div>
      )
    };
    setPokedex(newPokedex);
  }
  
  const searchEventHandler = (e, str) => {
    console.log('inside searchEventHandler');
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
      setModalClassName('pokedex-modal pokedex-fade-out')
      ;
      setTimeout(() => {
        searchElement.classList.remove("search-bar-element-focused");
        setModalDisplay(false);
      }, 1500);
      
    }, 400);
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
    fetch('/api/fetchPokeAPI', {
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
        if (pokemonData.error === 404) {
          alert('Pokemon not found! Please check your spelling and try again :)')
        };
        input.value = '';
        input.focus();
      });

      // setTimeout(() => {
      //   console.log('inside setTimeout')
      //   const searchElement = document.getElementById("search-bar-element");
      //   searchElement.classList.remove("search-bar-element-focused");
      //   setModalDisplay(false);
      // }, 1000);
  }

  const pokedexOnclick = (str) => {

  }

  const changeBackground = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const appContainer =     document.querySelector("body");
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

    searchBar.addEventListener("focus", function () {
      console.log('adding focus function')
      searchElement.classList.add("search-bar-element-focused");
      setModalClassName('pokedex-modal pokedex-fade-in')
    });
    searchBar.addEventListener("blur", function () {
      console.log('adding blur function');
      setTimeout(() => {
        setModalClassName('pokedex-modal pokedex-fade-out')
        ;
        setTimeout(() => {
          searchElement.classList.remove("search-bar-element-focused");
          setModalDisplay(false);
        }, 2000);
        
      }, 400);
    });
    setOnce(false);
  }

  useEffect(() => {
    if (once) addEventListenersOnce();
    populatePokedex();
    changeBackground();
    // setModalDisplay(false)
  }, [])

  return (
    <div className='search-bar-element' id='search-bar-element' >
      <form onSubmit={(e) => searchEventHandler(e)}>
        <input type="text" id='pokemon-search-name' autocomplete="off" placeholder="search a mon" onClick={()=>{setModalDisplay(true)}} />
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
        <img className='between-rerender-loading-gif' src='/static/loading-2.gif' alt="" />
        : null}
    </div>
  )
}

export default connect(null, mapDispatchToProps)(PokemonSearch);