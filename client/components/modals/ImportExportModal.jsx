/**
 * ************************************
 *
 * @module ImportExportModal
 * @author zi 
 * @date
 * @description 
 *
 * ************************************
 */

// importing dependencies 
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';

import {calculate, Generations, Pokemon, Move} from '@ajhyndman/smogon-calc';

 


const mapStateToProps = state => {
  return {
    currentPokemon: state.pokemon.currentPokemon,
  }
}

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  updatePokemon: (pokemon, pokemonData, mode) => dispatch(actions.updatePokemonPokeAPI(pokemon, pokemonData, mode)),
  updatePokemonSet: (importedSet) => dispatch(actions.updatePokemonSet(importedSet))
});



const ImportExportModal = props => {
  
  const [showModal, setShowModal] = useState(false);
  const [modalShown, setModalShown] = useState({import: false, export: false});
  const [modalContent, setModalContent] = useState([]);
  const [className, setClassName] = useState(''); 
  


  const toggleImport = () => {
    // control state changes 
    if (showModal && modalShown.import) {
      setShowModal(false); 
      setModalShown({import: false, export: false});
      return 
    }
    setShowModal(true); 
    setModalShown({import: true, export: false});

    const closeModal = () => {
      setShowModal(false); 
      setModalShown({import: false, export: false});
    }

    const handleImport = () => {
      const userInput = document.getElementById('import-current-pokemon-input').value;
      fetch('/api/importMon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain',
        },
        body: JSON.stringify({team: userInput})
      })
        .then((response) => response.json())
        .then((response) => {
          // console.log(response.pokemonData);
          const pokemonData = response.pokemonData
          props.updatePokemon(pokemonData.name, pokemonData);
          return response.importedSet
        })
        .then((importedSet) => {
          // console.log(importedSet);
          // props.updatePokemonSet(importedSet)
        })
    }

    // generate modal content 
    const newModalContent = (
      <div className='import-export-modal'>
        <img className="remove-button" onClick={()=>{closeModal()}} src='https://cdn-icons-png.flaticon.com/512/66/66847.png'></img>
        <textarea type='text' id='import-current-pokemon-input'></textarea>
        <button onClick={() => {handleImport()}}>import</button>
      </div>
    );
    setModalContent(newModalContent);

  }

  return (
    <div className="import-export-current-pokemon">
      <div className="import-export-buttons">
        <button onClick={()=>{toggleImport()}}>import</button>
        <button onClick={()=>{toggleExport()}}>export</button>
      </div>
      {showModal ? 
        <div className={className}>
          {modalContent}
        </div> 
        : null}
    </div>
  );
} 







export default connect(mapStateToProps, mapDispatchToProps)(ImportExportModal);