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
import React from 'react';
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
    const input = document.getElementById('pokemon-name');
    const pokemon = input.value;
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
        }
      })
  }

    return (
      <div className='pokemon-search'>
        <form onSubmit={eventHandler}>
          <input type="text" id='pokemon-name' />
          <button type='submit'> <span> Search</span> </button>
        </form>
      </div>
    )
}

export default connect(null, mapDispatchToProps)(PokemonSearch);