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
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

// importing other files and components
import * as actions from '../actions/actions';


const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  addPokemon : (pokemon) => dispatch(actions.addPokemon(pokemon)),
  updatePokemon: (pokemon, pokemonData) => dispatch(actions.updatePokemonPokeAPI(pokemon, pokemonData)),
  // updatePokemonName: (pokemon) => dispatch(actions.updatePokemonName(pokemon))
});


const PokemonSearch = props => {

  const eventHandler = e => {
    e.preventDefault();
    const input = document.getElementById('pokemon-search-name');
    let pokemon = input.value;
    pokemon = pokemon.trim();
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
        props.updatePokemon(pokemon, pokemonData);
        if (pokemonData.error === 404) {
          alert('Pokemon not found! Please check your spelling and try again :)')
        };
        input.value = '';
        input.focus();
      })
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

  useEffect(() => {
    // add event listeners
    const searchElement = document.getElementById("search-bar-element");
    const searchBar = document.getElementById('pokemon-search-name');

    console.log('yayeet in useEffect', searchElement);

    searchBar.addEventListener("focus", function () {
      console.log('FOCUSING')
      searchElement.classList.add("search-bar-element-focused");
    });
    searchBar.addEventListener("blur", function () {
      searchElement.classList.remove("search-bar-element-focused");
    });
    changeBackground();
  })

  return (
    <div className='search-bar-element' id='search-bar-element'>
      <form onSubmit={eventHandler}>
        <input type="text" id='pokemon-search-name' />
        <button type='submit'> <span> Search</span> </button>
      </form>
    </div>
  )
}

export default connect(null, mapDispatchToProps)(PokemonSearch);