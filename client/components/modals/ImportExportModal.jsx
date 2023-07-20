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

// import {Teams} from 'pokemon-showdown';
 


const mapStateToProps = state => {
  return {
    pokemonCalcDataFriendly: state.damageCalc.pokemonCalcDataFriendly,
    pokemonCalcDataEnemy: state.damageCalc.pokemonCalcDataEnemy,
  }
}

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  showTypingChart : () => dispatch(actions.showTypingChart()),
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
      const team = Teams.import(userInput);
      console.log(team)
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