/**
 * ************************************
 *
 * @module PokemonSprite
 * @author zi 
 * @date
 * @description displays pokemon gif 
 *
 * ************************************
 */

// importing dependencies 
import React, {useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import fetch from 'node-fetch';

import loadingGIF from '../../assets/loading.gif';
import hoshiHat from '../../assets/hoshi-hat.png';
import hoshi from '../../assets/hoshi.png';


const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  updateGif : (url) => dispatch(actions.updateGif(url)),
});


const PokemonSprite = props => {
  const [url, setUrl] = useState(loadingGIF)
  const [initialRender, setInitialRender] = useState(true);
  const [isValid, setIsValid] = useState(false); // State to check if animated URL is valid

  console.log('in SPRITE ', props.className, props.type, props.pokedexId)

  let className = '';
  let onClick = null;
  let id = '';

  if (props.className) className = props.className;
  if (props.onClick) onClick = props.onClick;
  if (props.id) id = id;
  
  let stillUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.pokedexId}.png`;
  if (props.shiny) stillUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${props.pokedexId}.png`;
  if (props.pokedexId < 1) {
    stillUrl = 'https://www.clipartmax.com/png/full/185-1853692_flat-mark-circle-round-question-help-icon-question-mark-in-circle.png';
    className = 'pokedex-sprite-placeholder';
  }

  console.log(stillUrl)


  const previousPropsRef = useRef({
    pokemon: props.pokemon,
    shiny: props.shiny,
    pokedexId: props.pokedexId,
    type: props.type
  });


  useEffect(() => {
    const checkUrl = (animatedUrl, stillUrl) => {
      const img = new Image();
      img.onload = () => {
        setUrl(animatedUrl);
        setIsValid(true);
      };
      img.onerror = () => {
        console.log('img load error!!!', stillUrl)

        setUrl(stillUrl);
        setIsValid(false);
      };
      img.src = animatedUrl;
    };

    let animatedUrl = `https://play.pokemonshowdown.com/sprites/xyani/${props.pokemon.toLowerCase()}.gif`;
    if (props.shiny) animatedUrl = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${props.pokemon.toLowerCase()}.gif`;

    if (props.type !== 'still') checkUrl(animatedUrl, stillUrl);
    else {
      setUrl(stillUrl)
    }
  
  }, [props.pokemon]);
 



  // useEffect(() => {
  //   let isCancelled = false;
  //   // check if url is cached -> avoid requests 
  //   if (!localStorage.getItem('pokemon-team-builder-cache')) localStorage.setItem('pokemon-team-builder-cache', '{}');

  //   const cacheObj = JSON.parse(localStorage.getItem('pokemon-team-builder-cache'))
  //   if (cacheObj.hasOwnProperty(props.pokemon.toLowerCase())) {
  //     let cachedUrl = cacheObj[props.pokemon.toLowerCase()]['url'];
  //     setUrl(cachedUrl);
  //     isCancelled = true;
  //   }
  //   if (props.type==='still') {

  //     // let stillUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.pokedexId}.png`;
  //     // return (<croppedSprite src={stillUrl}/>)
  //     console.log(stillUrl)
  //     setUrl(stillUrl)
  //     return;
  //   }

  //   // setting url for fetch requests based on NODE_ENV 
  //   let backendURL = '/api/testForNewerSprites';
  //   if (process.env.NODE_ENV==='production') backendURL = 'https://pokemon-team-builder-api.vercel.app' + backendURL;

  //   if (!isCancelled) {
  //     console.log('sprite about to fetch: ', )
  //     fetch(backendURL, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json, text/plain',
  //       },
  //       body: JSON.stringify({url: animatedUrl, pokemon:props.pokemon.toLowerCase()})
  //     })
  //       .then((response) => response.json())
  //       .then((updatedUrlObject) => {
  //         // console.log('testForNewerSprites FRONT ', updatedUrlObject);
  //         setUrl(updatedUrlObject.url);

  //         if (localStorage.getItem('pokemon-team-builder-cache')) {
  //           const localStorageObj = JSON.parse(localStorage.getItem('pokemon-team-builder-cache'));
  //           const copyOfLocalStorage = {...localStorageObj};
  //           copyOfLocalStorage[props.pokemon.toLowerCase()] = {url: updatedUrlObject.url};
  //           localStorage.setItem('pokemon-team-builder-cache', JSON.stringify(copyOfLocalStorage))
  //         } else {
  //           localStorage.setItem('pokemon-team-builder-cache', '{}')
  //         }
  //         if (updatedUrlObject.error === 404) {
  //           alert('ERROR in testForNewerSprites FRONT ')
  //         }
  //       })
  //     }
  //   return () => {
  //     isCancelled = true;
  //   }
  // }, []);

  return (
      <img key={props.pokemon} onClick={onClick} className={className} id={props.id} src={url} />
  )
}



export default connect(null, mapDispatchToProps)(PokemonSprite);