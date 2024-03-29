/**
 * ************************************
 *
 * @module EvolutionTree
 * @author zi 
 * @date
 * @description EvolutionTree
 *
 * ************************************
 */

// importing dependencies 
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PokemonSprite from './PokemonSprite.jsx';
import SavedTeam from './SavedTeam.jsx';

import * as actions from '../actions/actions';
import loadingGIF from '../../assets/loading-2.gif';



const mapStateToProps = (state) => {
  return {
    currentPokemon: state.pokemon.currentPokemon,
    historyCache: state.pokemon.historyCache,
  };
};

const mapDispatchToProps = dispatch => ({
  refreshAndDecodeSavedTeams : (savedTeams) => dispatch(actions.refreshAndDecodeSavedTeams(savedTeams)),
  updatePokemon: (pokemon, pokemonData, mode) => dispatch(actions.updatePokemonPokeAPI(pokemon, pokemonData, mode)),
});



const EvolutionTree= (props) => {

  const [className, setClassName] = useState('evolution-container-inner-active evolution-container-inner');
  const [evolutionTree, setEvolutionTree] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);

  
  // const toggleActive = (e) => {
  //   e.stopPropagation();
  //   if (className==='evolution-container-inner') {
  //     setClassName('evolution-container-inner evolution-container-inner-active');
  //     setFullDisplay(true)
  //   }
  //   else setClassName('evolution-container-inner')
  // }

  const populateEvolutionTree = () => {
    console.log('inside populateEvolutionTree ', props.currentPokemon)
    const newTreeArray = []; 
    // reformat evlution tree object in state 
    let chain = props.currentPokemon.evolution_chain;
    // push first evolution 
    let firstSpriteClassName = 'evolution-sprite';
    let firstTextClassName = '';
    if (chain.species.name===props.currentPokemon.pokemon) {
      firstSpriteClassName += ' evolution-sprite-current';
      firstTextClassName = 'evolution-text-current'
    }
    newTreeArray.push(
      <div key={Math.random()} className='evolution-row evolution-tier-1'>
        <PokemonSprite key={props.currentPokemon.pokemon} pokemon={chain.species.name} className={firstSpriteClassName}/>
        <a className={firstTextClassName} onClick={(e)=>{handleFetch(e, chain.species.name)}}>{chain.species.name}</a>
      </div>
    )

    // recursively push evolution nodes to array 
    function recursivelyPushPokemon(chain, level=2) {
      if (!chain.evolves_to.length) return; 
      chain.evolves_to.forEach(innerChain => {
        let spriteClassName = 'evolution-sprite';
        let textClassName = '';
        if (innerChain.species.name===props.currentPokemon.pokemon) {
          spriteClassName += ' evolution-sprite-current';
          textClassName = 'evolution-text-current'
        }
        newTreeArray.push(
          <div key={Math.random()} className={'evolution-row evolution-tier-' + level}>
            <img className='arrows' src="https://cdn-icons-png.flaticon.com/512/109/109617.png" alt="" />
            <PokemonSprite key={props.currentPokemon.pokemon} pokemon={innerChain.species.name} className={spriteClassName}/>
            <a className={textClassName} onClick={(e)=>{handleFetch(e, innerChain.species.name)}}>{innerChain.species.name}</a>
          </div>
        );
        if (innerChain.evolves_to.length) {
          level++;
          recursivelyPushPokemon(innerChain, level);
        }
      })
    }

    recursivelyPushPokemon(chain);


    setEvolutionTree(newTreeArray);
  }

      // parse evolution chain object to array 
      // const evolutionArray = [];
      // let chain = data.chain; 
      // while (chain.species) {
      //   evolutionArray.push(chain.species.name);
      //   chain = chain.evolves_to
      // }

  const handleFetch = (e, pokemon) => {
    // quickly loop thru the cache array to check if the data is saved, if found do not make api call 
    for (let pokemonObj of props.historyCache) {
      if (pokemonObj.pokemon===pokemon) {
        console.log('cached!!')
        setLoadingStatus(false);
        props.updatePokemon(pokemon, pokemonObj, 'cached');
        return 
      }
    }

    setLoadingStatus(true);
    e.stopPropagation();
    // setting url for fetch requests based on NODE_ENV 
    let backendURL = '/api/fetchPokeAPI';

    if (process.env.NODE_ENV==='production') backendURL = 'https://pokemon-team-builder-api.vercel.app' + backendURL;
    fetch(backendURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
      },
      body: JSON.stringify({pokemon: pokemon})
    })
      .then((response) => response.json())
      .then((pokemonData) => {
        setLoadingStatus(false);
        props.updatePokemon(pokemon, pokemonData);
      })
  }


  useEffect(() => {

    populateEvolutionTree();

  }, [props.currentPokemon])

  return (
    // <div className='evolution-container' >
    //   {fullDisplay ?     
    //     <div className={className} onClick={(e) => {toggleActive(e)}}>
    //       <h4>evolution tree</h4>
    //       <div>
    //         <h4>charizard</h4>
    //       </div>
    //     </div> :
    //     <div className={className} onClick={(e) => {toggleActive(e)}}>
    //       <h4>evolution tree</h4>
    //       <div>
    //         <h4>charizard</h4>
    //       </div>
    //    </div>
  
    //   }
    // </div>
    <div className='evolution-container' key={props.currentPokemon.name}>
  
      <div className={className} >
        <h4>Evolutions</h4>
        <div className='evolution-tree-container'>
          {evolutionTree}
        </div>
      </div> 
      {loadingStatus ? 
        <img className='between-rerender-loading-gif-evotree' src={loadingGIF} alt="" />
        : null}
  </div>
 
  );

}

export default connect(mapStateToProps, mapDispatchToProps)(EvolutionTree)