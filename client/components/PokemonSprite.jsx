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
import React, {useState, useEffect } from 'react';
import { connect } from 'react-redux';
import fetch from 'node-fetch';

import CropImage from './croppedSprite.jsx'


const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  updateGif : (url) => dispatch(actions.updateGif(url)),
});


const PokemonSprite = props => {
  // console.log('inside PokemonSprite, props:', props)
  const [url, setUrl] = useState('/static/loading.gif')
  const [initialRender, setInitialRender] = useState(true)


  let className = '';
  let onClick = null;
  let id = '';

  if (props.className) className = props.className;
  if (props.onClick) onClick = props.onClick;
  if (props.id) id = id;
  
  const animatedUrl = ('https://play.pokemonshowdown.com/sprites/xyani/' + props.pokemon.toLowerCase() + '.gif');

  if (props.pokemon==='hoshi') {
    if (props.type==='still') return (<img src='/static/hoshi-hat.png' className={className}/>)
    return (
      <img src='/static/hoshi.png' className={className}/>
    )
  }
  if (props.pokemon==='lina') {
    return (
      <img src='/static/lina.png' className={className}/>
    )
  }

  // for saved teams - still sprites
  if (props.type==='still') {
    console.log('should be still')
    let stillUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.pokedexId}.png`;
    return (<CropImage src={stillUrl} maxWidth={'105%'} maxHeight={'105%'}/>)
  }





  useEffect(() => {
    let isCancelled = false;
    // check if url is cached -> avoid requests 
    if (!localStorage.getItem('pokemon-team-builder-cache')) localStorage.setItem('pokemon-team-builder-cache', '{}');

    const cacheObj = JSON.parse(localStorage.getItem('pokemon-team-builder-cache'))
    if (cacheObj.hasOwnProperty(props.pokemon.toLowerCase())) {
      let cachedUrl = cacheObj[props.pokemon.toLowerCase()]['url'];
      setUrl(cachedUrl);
      isCancelled = true;
    }
    if (props.type==='still') {
      console.log('should be still')

      // let stillUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.pokedexId}.png`;
      // return (<croppedSprite src={stillUrl}/>)
      console.log(stillUrl)
      setUrl(stillUrl)
      return;
    }

    if (!isCancelled) {
      fetch('/api/testForNewerSprites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain',
        },
        body: JSON.stringify({url: animatedUrl, pokemon:props.pokemon.toLowerCase()})
      })
        .then((response) => response.json())
        .then((updatedUrlObject) => {
          console.log('testForNewerSprites FRONT ', updatedUrlObject);
          setUrl(updatedUrlObject.url);

          if (localStorage.getItem('pokemon-team-builder-cache')) {
            const localStorageObj = JSON.parse(localStorage.getItem('pokemon-team-builder-cache'));
            const copyOfLocalStorage = {...localStorageObj};
            copyOfLocalStorage[props.pokemon.toLowerCase()] = {url: updatedUrlObject.url};
            localStorage.setItem('pokemon-team-builder-cache', JSON.stringify(copyOfLocalStorage))
          } else {
            localStorage.setItem('pokemon-team-builder-cache', '{}')
          }
          if (updatedUrlObject.error === 404) {
            alert('ERROR in testForNewerSprites FRONT ')
          }
        })
      }
    return () => {
      isCancelled = true;
    }
  }, []);

  return (
      <img onClick={onClick} className={className} id={props.id} src={url} />
  )
}



export default connect(null, mapDispatchToProps)(PokemonSprite);