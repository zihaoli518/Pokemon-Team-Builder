/**
 * ************************************
 *
 * @module MoveSearchModal
 * @author zi 
 * @date
 * @description CalcEV
 *
 * ************************************
 */

// importing dependencies 
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'

import { connect } from 'react-redux';

import * as actions from '../../../actions/actions';

const calculator = require('pokemon-stat-calculator')
import {calculate, Generations, Pokemon, Move} from '@ajhyndman/smogon-calc';

// importing json files containing data from smogon 
import Data from '../../dexData.js';
const allItemsJSON = Data.allItemsJSON;
const allMovesJSON = Data.allMovesJSON;
const natureArray = Data.natureArray;
const statusArray = Data.statusArray;




const mapStateToProps = (state, ownProps) => {
  const pokemonCalcDataFriendly = state.damageCalc.pokemonCalcDataFriendly
  const pokemonCalcDataEnemy = state.damageCalc.pokemonCalcDataEnemy;

  const currentPokemon = (ownProps.team==='friendly') ? pokemonCalcDataFriendly : pokemonCalcDataEnemy;

  return {
    currentPokemon: currentPokemon,
    pokemonCalcDataFriendly: pokemonCalcDataFriendly,
    pokemonCalcDataEnemy: pokemonCalcDataEnemy,
  }
}


const mapDispatchToProps = dispatch => ({
  updateCalculatedStatsCalc : (team, evs, results) => dispatch(actions.updateCalculatedStatsCalc(team, evs, results)),
  chooseMoveForCalc: (team, moveId, move, type, basepower, categoryUrl) => dispatch(actions.chooseMoveForCalc(team, moveId, move, type, basepower, categoryUrl)),
});

const statOrder = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
// for reformat according to smogon/damage-calc interface
const statusMap = {healthy: '', poisoned: 'psn', 'badly poisoned': 'tox', burned: 'brn', paralyzed: 'par', asleep: 'slp', frozen: 'frz'}



const MoveSearchModal = props => {

  const [modalOptions, setModalOptions] = useState([]);
  const moveId = props.moveId;


  const populateModal = (moveId, searchStr) => {
    // console.log('inside populateModal, ', moveId, searchStr)
    const arrayOfMoves = [];
    // helper function for choose move onclick 
    function chooseMove(team, moveId, move, type, basepower, categoryUrl) {
      props.chooseMoveForCalc(team, moveId, move, type, basepower, categoryUrl);
      // close the modal
      const newPopUpState = {...props.popUpDisplay};
      newPopUpState[moveId] = false;
      props.setPopUpDisplay(newPopUpState);
      // props.setCategoryUrl(categoryUrl);
    }

    for (let move in allMovesJSON) {
      const capitalizedName = allMovesJSON[move].name;
      const type = allMovesJSON[move].type;
      let basepower = allMovesJSON[move].basePower;
      if (basepower===0) basepower = null;
      const category = allMovesJSON[move].category;
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

      let highlightedStr = '';
      let restOfStr = capitalizedName; 


      // check if row should be pushed to array, if !searchStr then default push everything,  or if searchStr matches the start of item name
      if (searchStr) {
        // convert searchStr to str in case it starts with numbers
        searchStr = searchStr.toString();
        // format to highlight searched str
        highlightedStr = capitalizedName.slice(0, searchStr.length);
        restOfStr = capitalizedName.slice(searchStr.length, capitalizedName.length);
        searchStr = capitalizeWords(searchStr)
      }

      // console.log('searchStr: ', searchStr, 'highlightedStr: ',  highlightedStr, 'restOfStr: ',restOfStr)

      if (!searchStr || highlightedStr===searchStr) {
        if (searchStr)  highlightedStr = searchStr;
        arrayOfMoves.push(
          <div className='calc-modal-option' onClick={()=>{chooseMove(props.team, moveId, capitalizedName, type, basepower, categoryImageUrl)}}>
              <h4><span>{highlightedStr}</span>{restOfStr}</h4>
              <img className='category-symbol' src={categoryImageUrl} alt="" />
              <img className='type-symbol' src={typeImageUrl} alt="" />
              <h4 className='basepower'>{basepower}</h4>
          </div>
        )
      }

    }
    // update state
    setModalOptions(arrayOfMoves);
  }

  
  const searchAndDisplayMoves = (elementId, moveId) => {
    const searchStr = document.getElementById(elementId).value;
    populateModal(moveId, searchStr);
  }



  useEffect(() => {
    populateModal(moveId);
  }, [props.pokemonCalcDataFriendly.moves[moveId], props.pokemonCalcDataEnemy.moves[moveId], props.popUpDisplay])


  return (
    <div className={`calc-modal calc-modal-${moveId}`} style={props.popUpDisplay[moveId] ? { display: 'block' } : { display: 'none' }}>
      <input className={'calc-modal-search'}  id={'calc-modal-search-' + props.team + moveId} type="text" onKeyUp={(event) => {searchAndDisplayMoves(event.target.id, moveId)}}/>
      <img className='calc-search-glass' src="https://cdn-icons-png.flaticon.com/512/808/808731.png" alt="" />
      <div className='calc-modal-option-container'>
        {modalOptions}
      </div>
    </div>

  );
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


export default connect(mapStateToProps, mapDispatchToProps)(MoveSearchModal);