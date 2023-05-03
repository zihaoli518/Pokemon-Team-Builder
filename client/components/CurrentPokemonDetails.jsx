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
import EvSliderContainer from './EvSliderContainer.jsx';
import EvContainer from './EvContainer.jsx';

// importing json files containing data from smogon 
import Data from './dexData.js';
const allItemsJSON = Data.allItemsJSON;
const allMovesJSON = Data.allMovesJSON;



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
  updateActiveMove: (moveId, moveObj) => dispatch(actions.updateActiveMove(moveId, moveObj)),
  selectMoveFromList: (moveId, moveObj) => dispatch(actions.selectMoveFromList(moveId,moveObj))
});



const CurrentPokemonDetails = props => {
  console.log('inside CurrentPokemonDetails', props.currentPokemon)
  
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
    // console.log('inside makeDivActive ', div, activeComponent)
    // console.log('container: ', container, document.getElementsByClassName(div))
    container.classList.add(activeClassName)
    
    if (div === 'abilities-container' || div === 'evs-container') {
      setShowBrowseArea(false);
      const needStretched = document.getElementsByClassName("pokemon-details-container")[0];
      needStretched.classList.add("pokemon-details-container-stretched");
      if (div === 'evs-container')  setShowBrowseArea(true);
    }
    else {
      setShowBrowseArea(true);
      const previousActiveStretched = document.getElementsByClassName("pokemon-details-container-stretched");
      if (previousActiveStretched.length!==0) {
        if (previousActiveStretched[0].classList !== div) {
          previousActiveStretched[0].classList.remove("pokemon-details-container-stretched");
        }
      } 
    }

    // remove active move containers 
    if (activeComponent==='moves-container'||activeComponent==='move-container') {
      setCurrentlyActiveDiv({div: activeComponent});
      return;
    }
    const previousActiveMove = document.getElementsByClassName('active-move-container');
    if (previousActiveMove.length!==0) {
      if (previousActiveMove[0].classList !== div) {
        previousActiveMove[0].classList.remove('active-move-container');
      }
    }  
 
    setCurrentlyActiveDiv({div: activeComponent});
  }

  // populate abilities
  const populateAbilities = () => {
    // console.log('inside populateAbilities', props.currentPokemon.slot)
    const newAbilitiesToBeDisplayed = [];

    const chooseAbility = (name, url, div, activeClassName) => {
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
          // console.log(newStr)

          let newAbilityObject = {name: ability, description: newStr};
          props.selectAbility(newAbilityObject);
          // console.log('inside getAbilityDescription, ', 'pokemon-details-' + ability)
        })
    }


  // populate items 
  const populateItems = (searchStr) => {
    const allItemsToBeDisplayed = [];

    const chooseItem = (name, url, description, div, activeClassName, activeComponent) => {
      // console.log('inside chooseItem')

      makeDivActive(div, activeClassName, activeComponent);
      // encode url so it doesnt cause errors when saved to data base in JSON format
      // url = envURIComponent(url)
      props.saveItemToMon(name, description, url);

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

  const searchAndDisplayItems = () => {
    const input = document.getElementById('item-search-input').value;
    populateItems(input);
  }


  // populate moves
  const selectMoveContainer = (num) => {
    makeDivActive('move-container-' + num, 'active-move-container', 'move-container');
    props.updateActiveMove('move_'+num, props.currentPokemon.moves["move_"+num]);
  }


  const populateMoves = (searchStr) => {
    const allMovesToBeDisplayed = [];

    const chooseMove = (moveId, moveObj, div, activeClassName, activeComponent) => {
      makeDivActive(div, activeClassName, activeComponent);
      props.selectMoveFromList(moveId, moveObj);
      // props.updateSavedTeam(props.yourTeam);

      // clear input field 
      const input = document.getElementById('move-search-input');
      input.value = '';
    }

    for (let name in allMovesJSON) {
      // only run loop if move is found in current pokemon's move pool 
      if (!props.currentPokemon.movePool[name]) continue;

      const currentMove = allMovesJSON[name];

      const category = currentMove.category;
      const description = currentMove.shortDesc;
      const type = currentMove.type;
      let basepower = currentMove.basePower;
      let accuracy = currentMove.accuracy + '%';

      let typeImageUrl = `https://play.pokemonshowdown.com/sprites/types/${type}.png`;
      let categoryImageUrl = '';
      switch (category) {
        case "Physical":
          categoryImageUrl = "https://play.pokemonshowdown.com/sprites/categories/Physical.png";
          break;
        case "Special":
          categoryImageUrl = "https://play.pokemonshowdown.com/sprites/categories/Special.png";
          break;
        case "Status":
          categoryImageUrl = "https://play.pokemonshowdown.com/sprites/categories/Status.png";
          break;
      }
      currentMove['typeImageUrl'] = typeImageUrl;
      currentMove['categoryImageUrl'] = categoryImageUrl;
      if (basepower===0) basepower = null;
      if (accuracy==='true%') accuracy = "100%";

        
      let highlightedStr = '';
      let restOfStr = name; 
      const nameWithDash = name.replace(' ', '-');
      const className = "move-row move-row-" + nameWithDash; 

      // check if row should be pushed to array, if !searchStr then default push everything,  or if searchStr matches the start of item name
      if (searchStr) {
        highlightedStr = name.slice(0, searchStr.length);
        restOfStr = name.slice(searchStr.length, name.length);
      }

      if (!searchStr || highlightedStr===searchStr) {
        if (searchStr)  highlightedStr = searchStr;
        allMovesToBeDisplayed.push(
          // each item row 
          <div className={className} onClick={()=>{chooseMove(props.currentPokemon.activeMove.moveId, currentMove, 'move-row-'+ nameWithDash, 'active-move-browse-area', 'moves-container')}}>
            <div className='move-row-top'>
              <h4><span>{highlightedStr}</span>{restOfStr}</h4>
              <img className='type-symbol' src={typeImageUrl} alt="" />
              <img className='category-symbol' src={categoryImageUrl} alt="" />
              <h4 className='basepower'>{basepower}</h4>
              <h4 className='accuracy'>{accuracy}</h4>
            </div>
            <div className='move-row-bottom'>
              <h5>{description}</h5>
            </div>
          </div>
        )
      }

    }
    setAllMovesToBeDisplayed(allMovesToBeDisplayed)
  }


  const searchAndDisplayMoves = () => {
    const input = document.getElementById('move-search-input').value;
    populateMoves(input);
  }


  const handleFirstClick = (e) => {
    if (currentlyActiveDiv.div==='moves-container' || currentlyActiveDiv.div==='move-container') {
      return;
    }
    selectMoveContainer(1); 
    e.preventDefault();
    e.stopPropagation();
  }

  const helper = {};
  // var rangeslider = document.getElementById("sliderRange");
  // var output = document.getElementById("demo");
  // output.innerHTML = rangeslider.value;

  // rangeslider.oninput = function() {
  //   output.innerHTML = this.value;
  // }

  // state for EVs 
  const [valuesOfEV, setValuesOfEv] = useState({hp: 0, attack: 0, defense: 0, specialA: 0, specialD: 0, speed: 0});
  const [valuesOfIV, setValuesOfIv] = useState({hp: 31, attack: 31, defense: 31, specialA: 31, specialD: 31, speed: 31});
  const [calculatedStat, setCalculatedStat] = useState({hp: 0, attack: 0, defense: 0, specialA: 0, specialD: 0, speed: 0});
  

  useEffect(() => {
    populateAbilities();
    populateItems();
    populateMoves();
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

        <div className='moves-container' onClick={(e)=> {makeDivActive('moves-container', 'active-pokemon-detail-container', 'moves-container'); handleFirstClick(e)}}>
          <h3>moves</h3>
            <div className='moves-container-row'>
              <div className='move-container move-container-1' onClick={()=>{selectMoveContainer(1)}}>
                <div className='move-container-top-row'>
                  <img src={props.currentPokemon.moves.move_1.typeImageUrl} alt="" />
                  <img src={props.currentPokemon.moves.move_1.categoryImageUrl} alt="" />
                </div>
                <h4>{props.currentPokemon.moves.move_1.name}</h4>
              </div>
              <div className='move-container move-container-2' onClick={()=>{selectMoveContainer(2)}}>
                <div className='move-container-top-row'>
                  <img src={props.currentPokemon.moves.move_2.typeImageUrl} alt="" />
                  <img src={props.currentPokemon.moves.move_2.categoryImageUrl} alt="" />
                </div>
                <h4>{props.currentPokemon.moves.move_2.name}</h4>
              </div>
            </div>
            <div className='moves-container-row'>
              <div className='move-container move-container-3' onClick={()=>{selectMoveContainer(3)}}>
                <div className='move-container-top-row'>
                  <img src={props.currentPokemon.moves.move_3.typeImageUrl} alt="" />
                  <img src={props.currentPokemon.moves.move_3.categoryImageUrl} alt="" />
                </div>
                <h4>{props.currentPokemon.moves.move_3.name}</h4>
              </div>
              <div className='move-container move-container-4' onClick={()=>{selectMoveContainer(4)}}>
                <div className='move-container-top-row'>
                  <img src={props.currentPokemon.moves.move_4.typeImageUrl} alt="" />
                  <img src={props.currentPokemon.moves.move_4.categoryImageUrl} alt="" />
                </div>
                <h4>{props.currentPokemon.moves.move_4.name}</h4>
              </div>
            </div>

        </div>
        <EvContainer 
          makeDivActive={makeDivActive} 
          valuesOfEV={valuesOfEV} 
          setValuesOfEv={setValuesOfEv} 
          valuesOfIV={valuesOfIV} 
          setValuesOfIv={setValuesOfIv} 
          calculatedStat={calculatedStat} 
          setCalculatedStat={setCalculatedStat} 
        />
      </div>
      {/* browse and search area on the right side  */}
      {showBrowseArea ?
        <div className='browse-area-container'>
          {/* item container */}
          {currentlyActiveDiv.div ==='item-container' || currentlyActiveDiv.div ==='item-row' ?
            <div className='browse-items-container'> 
              <h3>items</h3>
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
          {currentlyActiveDiv.div==='move-container' || currentlyActiveDiv.div==='moves-container' ?
            <div className='browse-moves-container'> 
              <h3>available moves</h3>
              <div className='search-area'>
                <input type="text" id='move-search-input' onKeyUp={() => {searchAndDisplayMoves()}}/>
              </div>
                {/* active move */}
              {props.currentPokemon.activeMove.moveObj.exists ?
                <div className='move-selected'>
                  <div className='move-row-top'>
                    <h4>{props.currentPokemon.activeMove.moveObj.name}</h4>
                    <img className='type-symbol' src={props.currentPokemon.activeMove.moveObj.typeImageUrl} alt="" />
                    <img className='category-symbol' src={props.currentPokemon.activeMove.moveObj.categoryImageUrl} alt="" />
                    <h4 className='basepower'>{props.currentPokemon.activeMove.moveObj.basePower}</h4>
                    <h4 className='accuracy'>{props.currentPokemon.activeMove.moveObj.accuracy}</h4>
                  </div>
                  <div className='move-row-bottom'>
                    <h5>{props.currentPokemon.activeMove.moveObj.shortDesc}</h5>
                  </div>
                </div>
                : <div className='move-selected-placeholder'> </div>
              }
              <div className='moves-list-labels'>
                <h5 className='name'>name</h5>
                <h5 className='type-l'>type</h5>
                <h5 className='cat'>cat</h5>
                <h5 className='pow'>pow</h5>
                <h5 className='acc'>acc</h5>
              </div>
                {/* all moves */}
              <div className='moves-list'>
                {allMovesToBeDisplayed}
              </div>
            </div> :
            null
          }
          {currentlyActiveDiv.div==='evs-container' ?
            <EvSliderContainer valuesOfEV={valuesOfEV}/> 
            : null
          }
        </div> :
      null
      }
    </div>
  );
}


export default connect(mapStateToProps, mapDispatchToProps)(CurrentPokemonDetails);