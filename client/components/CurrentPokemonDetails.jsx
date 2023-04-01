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
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// importing files 
import * as actions from '../actions/actions';
import PokemonSprite from './PokemonSprite.jsx';
import StatChart from './StatChart.jsx';



// currentPokemon contains all data. moveSet contains all moves(object)
const mapStateToProps = state => {
  return {
    currentPokemon: state.pokemon.currentPokemon,
    activeAbility: state.pokemon.currentPokemon.activeAbility,
    yourTeam: state.pokemon.yourTeam,
  }
}

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  selectAbility : (ability) => dispatch(actions.selectAbility(ability)),
  updateSavedTeam: (team) => dispatch(actions.updateSavedTeam(team)),

});



const CurrentPokemonDetails = props => {
  console.log('inside CurrentPokemonDetails', props.currentPokemon)
  
  const [currentlyActiveDiv, setCurrentlyActiveDiv] = useState({div: '', });
  const [showBrowseArea, setShowBrowseArea] = useState(false);

  const [AbilitiesToBeDisplayed, setAbilitiesToBeDisplayed] = useState([]);


  // generalized function that makes a div have an unique classname (for active effects)
  const makeDivActive = (div, activeClassName) => {
    // check if another div already has the active class, remove if found 
    const previousActive = document.getElementsByClassName(activeClassName);
    if (previousActive.length!==0) {
      if (previousActive[0].classList !== div) {
        previousActive[0].classList.remove(activeClassName);
      }
    } 
    const container = document.getElementsByClassName(div)[0];
    console.log('container: ', div, document.getElementsByClassName(div))
    container.classList.add(activeClassName)
    
    setShowBrowseArea(true);
    setCurrentlyActiveDiv({div: div});
  }


  const populateAbilities = () => {
    console.log('inside populateAbilities', props.currentPokemon.slot)
    const newAbilitiesToBeDisplayed = [];

    const chooseAbility = (name, url, div, activeClassName) => {
      console.log('inside chooseAbility')
      getAbilityDescription(name, url);
      makeDivActive(div, activeClassName);
      props.updateSavedTeam(props.yourTeam);
    }

    for (let i=0; i<props.currentPokemon.abilities.length; i++) {
      const name =  props.currentPokemon.abilities[i].ability.name;
      const url = props.currentPokemon.abilities[i].ability.url;
      let className = 'ability ability' + (i+1) + ' pokemon-details-' + name;
      // highlight active ability on load
      if (props.currentPokemon.activeAbility.name && props.currentPokemon.activeAbility.name===name) className += ' active-ability-highlighted';
      newAbilitiesToBeDisplayed.push(
        <div className={className} onClick={()=> {chooseAbility(name, url, 'ability'+(i+1), 'active-ability-highlighted')}}>
          <h4>
            {name}
          </h4>
        </div>
      )
    }

    setAbilitiesToBeDisplayed(newAbilitiesToBeDisplayed);
    if (!props.currentPokemon.activeAbility.name) {
      const firstAbility = props.currentPokemon.abilities[0].ability
      const url = firstAbility.url;
      getAbilityDescription(firstAbility.name, url);
    }
  }


  // maybe cache this? 
  async function getAbilityDescription(ability, url) {
    await fetch(decodeURIComponent(url))
        .then(data => data.json())
        .then(data => {
          let effectStr = data.effect_entries[1].effect; 
          let array = effectStr.split(/\r?\n|\r|\n/g);
          let newStr = array[0];
          console.log(newStr)

          let newAbilityObject = {name: ability, description: newStr};
          props.selectAbility(newAbilityObject);
          console.log('inside getAbilityDescription, ', 'pokemon-details-' + ability)
        })
    }

  
  
  useEffect(() => {
    populateAbilities();
  }, [props.currentPokemon, props.activeAbility])


  return (
    <div className='current-pokemon-rightside-container'>
      <div className='pokemon-details-container'>
        <div className='abilities-container' onClick={()=> {makeDivActive('abilities-container', 'active-pokemon-detail-container')}}>
          <h3>ability</h3>
          <div className='abilities-container-inner'>              
            {AbilitiesToBeDisplayed}
          </div>
          {/* <div className='ability-description-container'>
            <h4 className='ability-description'> {props.activeAbility.description} </h4>
          </div> */}
        </div>

        <div className='item-container' onClick={()=> {makeDivActive('item-container', 'active-pokemon-detail-container')}}>
          <h3>item</h3>
          <div className='item'>
            <img src="https://www.gamerguides.com/assets/media/15/1997/item_0234.png" alt="" />
            <h4>leftovers</h4>
          </div>
        </div>

        <div className='moves-container' onClick={()=> {makeDivActive('moves-container', 'active-pokemon-detail-container')}}>
          <h3>moves</h3>
            <div className='moves-container-row'>
              <div className='move-container move-container-1'>
                <h4>shadow ball</h4>
              </div>
              <div className='move-container move-container-2'>
              <h4>stealth rocks</h4>
              </div>
            </div>
            <div className='moves-container-row'>
              <div className='move-container move-container-3'>
              <h4>leech seed</h4>
              </div>
              <div className='move-container move-container-4'>
              <h4>flamethrower</h4>
              </div>
            </div>

        </div>

        <div className='evs-container' onClick={()=> {makeDivActive('evs-container', 'active-pokemon-detail-container')}}>
          <h3>EVs</h3>

        </div>
      </div>
      {showBrowseArea ?
        <div className='browse-move-area-container'>
        {currentlyActiveDiv.div ==='abilities-container'?
          <div> 
            <h3>{props.activeAbility.name}</h3>
            <h4 className='ability-description'> {props.activeAbility.description} </h4>
          </div> :
          null
        }
        </div> :
      null
      }
      
    </div>
  );
}


export default connect(mapStateToProps, mapDispatchToProps)(CurrentPokemonDetails);