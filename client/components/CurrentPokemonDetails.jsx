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

// importing json files containing data from smogon 
import allItemsJSON from './dexData.js';
import allMovesJSON from './dexData.js';




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
  saveItemToMon : (item, description, url) => dispatch(actions.saveItemToMon(item, description, url)),
  updateSavedTeam: (team) => dispatch(actions.updateSavedTeam(team)),
  updateActiveMove: (moveId, moveObj) => dispatch(actions.updateActiveMove(moveId, moveObj))
});



const CurrentPokemonDetails = props => {
  console.log('inside CurrentPokemonDetails', props.currentPokemon)
  console.log(typeof(allItemsJSON));
  console.log(allItemsJSON)
  
  const [currentlyActiveDiv, setCurrentlyActiveDiv] = useState({div: '', });
  const [showBrowseArea, setShowBrowseArea] = useState(false);

  const [allAbilitiesToBeDisplayed, setAllAbilitiesToBeDisplayed] = useState([]);
  const [allItemsToBeDisplayed, setAllItemsToBeDisplayed] = useState([]);
  const [allMovesToBeDisplayed, setAllMovesToBeDisplayed] = useState([]);



  // generalized function that makes a div have an unique classname (for active effects)
  const makeDivActive = (div, activeClassName, activeComponent) => {
    // check if another div already has the active class, remove if found 
    const previousActive = document.getElementsByClassName(activeClassName);
    if (previousActive.length!==0) {
      if (previousActive[0].classList !== div) {
        previousActive[0].classList.remove(activeClassName);
      }
    } 
    const container = document.getElementsByClassName(div)[0];
    console.log('container: ', container, document.getElementsByClassName(div))
    container.classList.add(activeClassName)
    
    if (div !== 'abilities-container') setShowBrowseArea(true);
    else setShowBrowseArea(false);


    setCurrentlyActiveDiv({div: activeComponent});
  }

  // populate abilities
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

    setAllAbilitiesToBeDisplayed(newAbilitiesToBeDisplayed);
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


  // populate items 
  const populateItems = (searchStr) => {
    const allItemsToBeDisplayed = [];

    const chooseItem = (name, url, description, div, activeClassName, activeComponent) => {
      console.log('inside chooseItem')
      makeDivActive(div, activeClassName, activeComponent);
      props.saveItemToMon(name, description, url);
      props.updateSavedTeam(props.yourTeam);

      // clear input field 
      const input = document.getElementById('item-search-input');
      input.value = '';
    }

    console.log('DEBUGGING ', allItemsJSON)

    for (let name in allItemsJSON) {
      const url = allItemsJSON[name]['spriteUrl'];
      const description = allItemsJSON[name]['desc'];
      const className = 'item-row ' + 'item-row-'+ name;
      const nameLowerCase = allItemsJSON[name]['nameLowerCase'].replace('-', ' ');

      let highlightedStr = '';
      let restOfStr = nameLowerCase;

      // check if row should be pushed to array, if !searchStr then default push everything,  or if searchStr matches the start of item name
      if (searchStr) {
        highlightedStr = nameLowerCase.slice(0, searchStr.length);
        restOfStr = nameLowerCase.slice(searchStr.length, nameLowerCase.length);
      }

      if (!searchStr || highlightedStr===searchStr) {
        if (searchStr)  highlightedStr = searchStr;
        allItemsToBeDisplayed.push(
          // each item row 
          <div className={className} onClick={()=>{chooseItem(name, url, description, 'item-row-'+ name, 'active-item-browse-area', 'item-container')}}>
            <div className='item-row-top'>
              <img src={url} alt="" />
              <h4><span>{highlightedStr}</span>{restOfStr}</h4>
            </div>
            <div className='item-row-bottom'>
              <h5>{description}</h5>
            </div>
          </div>
        )
      }

    }
    setAllItemsToBeDisplayed(allItemsToBeDisplayed)
  }

  const searchAndDisplayItems = () => {
    const input = document.getElementById('item-search-input').value;
    populateItems(input);
  }

  // populate moves
  const selectMoveContainer = (num) => {
    makeDivActive('move-container-' + num, 'active-move-container', 'moves-container');
    props.updateActiveMove('move-'+num);
  }


  const populateMoves = (searchStr) => {
    const allMovesToBeDisplayed = [];

    const chooseMove = (move, div, activeClassName, activeComponent) => {
      console.log('inside chooseMove')
      makeDivActive(div, activeClassName, activeComponent);
      props.saveItemToMon(move);
      props.updateSavedTeam(props.yourTeam);

      // clear input field 
      const input = document.getElementById('item-search-input');
      input.value = '';
    }

    for (let name in allItemsJSON) {
      const url = allItemsJSON[name]['spriteUrl'];
      const description = allItemsJSON[name]['desc'];
      const className = 'item-row ' + 'item-row-'+ name;
      const nameLowerCase = allItemsJSON[name]['nameLowerCase'].replace('-', ' ');

      let highlightedStr = '';
      let restOfStr = nameLowerCase;

      // check if row should be pushed to array, if !searchStr then default push everything,  or if searchStr matches the start of item name
      if (searchStr) {
        highlightedStr = nameLowerCase.slice(0, searchStr.length);
        restOfStr = nameLowerCase.slice(searchStr.length, nameLowerCase.length);
      }

      if (!searchStr || highlightedStr===searchStr) {
        if (searchStr)  highlightedStr = searchStr;
        allItemsToBeDisplayed.push(
          // each item row 
          <div className={className} onClick={()=>{chooseItem(name, url, description, 'item-row-'+ name, 'active-item-browse-area', 'item-container')}}>
            <div className='item-row-top'>
              <img src={url} alt="" />
              <h4><span>{highlightedStr}</span>{restOfStr}</h4>
            </div>
            <div className='item-row-bottom'>
              <h5>{description}</h5>
            </div>
          </div>
        )
      }

    }
    setAllItemsToBeDisplayed(allItemsToBeDisplayed)
  }


  const searchAndDisplayMoves = () => {
    const input = document.getElementById('move-search-input').value;
    populateItems(input);
  }

  
  


  useEffect(() => {
    populateAbilities();
    populateItems();
  }, [props.currentPokemon, props.activeAbility])


  return (
    <div className='current-pokemon-rightside-container'>
      <div className='pokemon-details-container'>
        <div className='abilities-container' onClick={()=> {makeDivActive('abilities-container', 'active-pokemon-detail-container', 'abilities-container')}}>
          <h3>ability</h3>
          <div className='abilities-container-inner'>              
            {allAbilitiesToBeDisplayed}
          </div>
          {currentlyActiveDiv.div ==='abilities-container'?
          <div className='ability-description-container'> 
            <h4 className='ability-description'> {props.activeAbility.description} </h4>
          </div> :
          null
        }
        </div>

        <div className='item-container' onClick={()=> {makeDivActive('item-container', 'active-pokemon-detail-container', 'item-container')}}>
          <h3>item</h3>

            {props.currentPokemon.item.url ?
            <div className='item'>
              <img src={props.currentPokemon.item.url} alt="" />
              <h4>{props.currentPokemon.item.item.replace('-', ' ')}</h4>
              </div>
              : null
            }
        </div>

        <div className='moves-container' onClick={()=> {makeDivActive('moves-container', 'active-pokemon-detail-container', 'moves-container')}}>
          <h3>moves</h3>
            <div className='moves-container-row'>
              <div className='move-container move-container-1' onClick={()=>{selectMoveContainer(1)}}>
                <h4>shadow ball</h4>
              </div>
              <div className='move-container move-container-2' onClick={()=>{selectMoveContainer(2)}}>
              <h4>stealth rocks</h4>
              </div>
            </div>
            <div className='moves-container-row'>
              <div className='move-container move-container-3' onClick={()=>{selectMoveContainer(3)}}>
              <h4>leech seed</h4>
              </div>
              <div className='move-container move-container-4' onClick={()=>{selectMoveContainer(4)}}>
              <h4>flamethrower</h4>
              </div>
            </div>

        </div>

        <div className='evs-container' onClick={()=> {makeDivActive('evs-container', 'active-pokemon-detail-container', 'evs-container')}}>
          <h3>EVs</h3>

        </div>
      </div>
      {/* browse and search area on the right side  */}
      {showBrowseArea ?
        <div className='browse-area-container'>
          {/* item container */}
          {currentlyActiveDiv.div ==='item-container' || currentlyActiveDiv.div ==='item-row' ?
            <div className='browse-items-container'> 
              <h3>item</h3>
              <div className='search-area'>
                <input type="text" id='item-search-input' onKeyUp={() => {searchAndDisplayItems()}}/>
              </div>
                {/* the active item */}
              {props.currentPokemon.item.item ?
                <div className='item-selected'>
                  <div className='item-row-top'>
                    <img src={props.currentPokemon.item.url} alt="" />
                    <h4>{props.currentPokemon.item.item}</h4>
                  </div>
                  <div className='item-row-bottom'>
                    <h5>{props.currentPokemon.item.description}</h5>
                  </div>
                </div>
                : <div className='item-selected-placeholder'> </div>
              }
                {/* all items */}
              <div className='item-list'>
                {allItemsToBeDisplayed}
              </div>
            </div> :
            null
          }
          {/* moves container */}
          {currentlyActiveDiv.div ==='moves-container' || currentlyActiveDiv.div ==='item-row' ?
            <div className='browse-moves-container'> 
              <h3>item</h3>
              <div className='search-area'>
                <input type="text" id='item-search-input' onKeyUp={() => {searchAndDisplayMoves()}}/>
              </div>
                {/* active move */}
              {props.currentPokemon.activeMove.name ?
                <div className='move-selected'>
                  <div className='item-row-top'>
                    <img src={props.currentPokemon.item.url} alt="" />
                    <h4>{props.currentPokemon.item.item}</h4>
                  </div>
                  <div className='item-row-bottom'>
                    <h5>{props.currentPokemon.item.description}</h5>
                  </div>
                </div>
                : <div className='item-selected-placeholder'> </div>
              }
                {/* all items */}
              <div className='moves-list'>
                {allMovesToBeDisplayed}
              </div>
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