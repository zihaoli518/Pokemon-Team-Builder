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
import React, { useState, useEffect, useRef} from 'react';
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
  updatePokemon: (pokemon, pokemonData, mode, importedSet) => dispatch(actions.updatePokemonPokeAPI(pokemon, pokemonData, mode, importedSet)),
  updatePokemonSet: (importedSet) => dispatch(actions.updatePokemonSet(importedSet))
});



const ImportExportModal = props => {
  
  const [showModal, setShowModal] = useState(false);
  const [modalShown, setModalShown] = useState({import: false, export: false});
  const [modalContent, setModalContent] = useState([]);
  const [className, setClassName] = useState(''); 
  const [exportedFormat, setExportedFormat] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const divRef = useRef(null);

  const handleClickOutside = (event) => {

    if (divRef.current && !divRef.current.contains(event.target) && event.target.nodeName !== 'BUTTON') {
      // Click occurred outside the div, execute your logic here
      console.log("Click occurred outside the div");
      setShowModal(false); 
      setModalShown({import: false, export: false});
    }
  };
  
  const closeModal = () => {
    setShowModal(false); 
    setModalShown({import: false, export: false});
  }

  const toggleImport = () => {
    // control state changes 
    if (showModal && modalShown.import) {
      setShowModal(false); 
      setModalShown({import: false, export: false});
      return 
    }
    setShowModal(true); 
    setModalShown({import: true, export: false});

    const handleImport = () => {
      const userInput = document.getElementById('import-current-pokemon-input').value;
      // setting url for fetch requests based on NODE_ENV 
      let backendURL = '/api/importMon';
      if (process.env.NODE_ENV==='production') backendURL = 'https://pokemon-team-builder-api.vercel.app' + backendURL;
      fetch(backendURL, {
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
          props.updatePokemon(pokemonData.name, pokemonData, 'import', response.importedSet);
          closeModal();
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


  const toggleExport = () => {
    // control state changes 
    if (showModal && modalShown.export) {
      setShowModal(false); 
      setModalShown({import: false, export: false});
      return 
    }
    setShowModal(true); 
    setModalShown({import: false, export: true});

    handleExport();
  }

  const handleExport = () => {
    const userInput = props.currentPokemon;
          
    // setting url for fetch requests based on NODE_ENV 
    let backendURL = '/api/exportMon';
    if (process.env.NODE_ENV==='production') backendURL = 'https://pokemon-team-builder-api.vercel.app' + backendURL;
    fetch(backendURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
      },
      body: JSON.stringify({mon: userInput})
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response.exportedSet);
        return response.exportedSet
      })
      .then((response) => {
        console.log('about to set new content')
        const newModalContent = (
          <div className='import-export-modal' key={isCopied}>
            <img className="remove-button" onClick={()=>{closeModal()}} src='https://cdn-icons-png.flaticon.com/512/66/66847.png'></img>
            <textarea type='text' id='import-current-pokemon-input' value={response}></textarea>
            <button onClick={() => {handleCopyClick(response)}}>
              <span>{isCopied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        );
        setModalContent(newModalContent);
        setExportedFormat(response.exportedSet);
      })
  }

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = (copyText) => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(copyText)
      .then(() => {
        // If successful, update the isCopied state value
        console.log('inside copyText .then')
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // update the modal content - but do not run on load 
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
    } else {
      handleExport();
    }
  }, [isCopied, exportedFormat]);

  
  // closes modal when click outside modal detected
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="import-export-current-pokemon">
      <div className="import-export-buttons">
        <button onClick={()=>{toggleImport()}}>import set</button>
        <button onClick={()=>{toggleExport()}}>export set</button>
      </div>
      {showModal ? 
        <div ref={divRef} className={className} >
          {modalContent}
        </div> 
        : null}
    </div>
  );
} 







export default connect(mapStateToProps, mapDispatchToProps)(ImportExportModal);