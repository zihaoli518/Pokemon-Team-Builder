/**
 * ************************************
 *
 * @module CurrentPokemonDetails
 * @author zi 
 * @date
 * @description displays CurrentPokemonDetails
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

  }
}

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  addPokemonToYourTeam : (pokemonObj) => dispatch(actions.addPokemonToYourTeam(pokemonObj)),
});



const CurrentPokemonDetails = props => {


  return (
    <div className='pokemon-details-container'>

          <div className='abilities-container'>
            <h3>ability</h3>
            <div className='abilities-container-inner'>              
              <div className='ability'></div>
              <div className='ability'></div>

            </div>
            <div className='ability-description-container'>
              <h4 className='ability-description'>unware makes your balls huge</h4>
            </div>
          </div>

          <div className='item-container'>
            <h3>item</h3>
            <div className='item'>
              <img src="https://www.gamerguides.com/assets/media/15/1997/item_0234.png" alt="" />
              <h4>leftovers</h4>
            </div>
          </div>

          <div className='moves-container'>
            <h3>Moves</h3>
              <div className='move-container'>
                
              </div>
              <div className='move-container'>
                
              </div>
              <div className='move-container'>
                
              </div>
              <div className='move-container'>
                
              </div>

          </div>

          <div className='evs-container'>
            <h3>EVs</h3>
              <div className='move-container'>
                
              </div>
              <div className='move-container'>
                
              </div>
              <div className='move-container'>
                
              </div>
              <div className='move-container'>
                
              </div>

          </div>

          <div className='browse-move-area-container'>

          </div>
        </div>
  );
}

export default connect(mapStateToProps, null)(CurrentPokemonDetails);