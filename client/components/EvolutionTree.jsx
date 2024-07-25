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

import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import StartTwoToneIcon from '@mui/icons-material/StartTwoTone';
import { Typography, Tooltip, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';



const mapStateToProps = (state) => {
  return {
    currentPokemon: state.pokemon.currentPokemon,
    historyCache: state.pokemon.historyCache,
  };
};

const mapDispatchToProps = dispatch => ({
  refreshAndDecodeSavedTeams : (savedTeams) => dispatch(actions.refreshAndDecodeSavedTeams(savedTeams)),
  updatePokemonPokeAPI: (pokemon, pokemonData, mode) => dispatch(actions.updatePokemonPokeAPI(pokemon, pokemonData, mode)),
});



const EvolutionTree= (props) => {
  const theme = useTheme();

  const [classNameMinMax, setClassNameMinMax] = useState('evolution-container-minimize');
  const [evolutionTree, setEvolutionTree] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);

  
  const handleMouseEnter = () => {
    setClassNameMinMax('evolution-container-maximize');
  };

  const handleMouseLeave = () => {
    setClassNameMinMax('evolution-container-minimize');
  };

  const populateEvolutionTree = () => {
    console.log('inside populateEvolutionTree ', props.currentPokemon)
    const newTreeArray = []; 
    // reformat evlution tree object in state 
    let chain = props.currentPokemon.evolution_chain;
    // push first evolution 
    let firstSpriteClassName = 'evolution-sprite';
    let firstTextClassName = 'evolution-inner-text';
    if (chain.species.name===props.currentPokemon.pokemon) {
      firstSpriteClassName += ' evolution-sprite-current';
      firstTextClassName = 'evolution-text-current'
    }
    newTreeArray.push(
      <div key={Math.random()} className='evolution-row evolution-tier-1' onClick={(e)=>{handleFetch(e, chain.species.name)}}>
        <PokemonSprite pokemon={chain.species.name} pokedexId={props.currentPokemon.pokedexId} className={firstSpriteClassName}/>
        {/* <Typography className={firstTextClassName}>{(classNameMinMax ==='evolution-container-minimize') ? chain.species.name : null}</Typography> */}
        <Typography className={firstTextClassName}>{chain.species.name}</Typography>

      </div>
    )

    // recursively push evolution nodes to array 
    function recursivelyPushPokemon(chain, level=2) {
      if (!chain.evolves_to.length) return; 
      chain.evolves_to.forEach(innerChain => {
        let spriteClassName = 'evolution-sprite';
        let textClassName = 'evolution-inner-text';
        if (innerChain.species.name===props.currentPokemon.pokemon) {
          spriteClassName += ' evolution-sprite-current';
          textClassName = 'evolution-text-current'
        }
        newTreeArray.push(
          <div key={Math.random()} className={'evolution-row evolution-tier-' + level} onClick={(e)=>{handleFetch(e, innerChain.species.name)}}>
            {/* <img className='arrows' src="https://cdn-icons-png.flaticon.com/512/109/109617.png" alt="" /> */}
            <StartTwoToneIcon sx={{ fontSize: 'small' }} />
            <PokemonSprite pokemon={innerChain.species.name} pokedexId={props.currentPokemon.pokedexId} className={spriteClassName}/>
            {/* <Typography className={textClassName}>{(classNameMinMax ==='evolution-container-minimize') ? innerChain.species.name: null}</Typography> */}
            <Typography className={textClassName}>{ innerChain.species.name}</Typography>

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
        // console.log('cached!!')
        setLoadingStatus(false);
        props.updatePokemonPokeAPI(pokemon, pokemonObj, 'cached');
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
        props.updatePokemonPokeAPI(pokemon, pokemonData);
      })
  }


  useEffect(() => {

    populateEvolutionTree();

  }, [props.currentPokemon.pokemon])

  return (
    <Paper
      className={classNameMinMax}
      key={props.currentPokemon.name}
      elevation={3}
      sx={{ height: "85%", display: "flex", flexDirection: "column", }}

      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <Paper
        elevation={3}
        sx={{
          height: "8%",
          display: "flex",
          justifyContent: "center",
          gap: "3%",
          zIndex: 100,
          alignItems: "center",
          borderRadius: "0.6rem",
          backgroundColor: theme.palette.primary.dark
        }}
      >
        < AccountTreeRoundedIcon id='evolution-tree-icon' sx={{height: '80%', width: 'auto'}}/>
        <Typography
          sx={{ marginLeft: "3%", lineHeight:'100%', fontSize: '25%'}}
        >
          Evolution Tree 
        </Typography>
      </Paper>

      <Paper className='evolution-tree-container'>
        {evolutionTree}
      </Paper>

           {loadingStatus ?
          <img className='between-rerender-loading-gif-evotree' src={loadingGIF} alt="" />
          : null}
    </Paper>
  );

}

export default connect(mapStateToProps, mapDispatchToProps)(EvolutionTree)