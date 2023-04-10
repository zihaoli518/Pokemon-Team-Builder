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
  if (props.id) id = id
  const animatedUrl = ('https://play.pokemonshowdown.com/sprites/xyani/' + props.pokemon.toLowerCase() + '.gif');

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



let img;
let mask;
let scaledImg;
let scaledMask;
function scale(url) {
  createCanvas(640, 480);
  loadImage(url, function(img) {
    // Generate the transparency mask
    img.loadPixels();
    mask = createImage(img.width, img.height);
    mask.loadPixels();
    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        let index = (x + y * img.width) * 4;
        let alpha = img.pixels[index + 3];
        if (alpha == 0) {
          mask.pixels[index + 0] = 0;
          mask.pixels[index + 1] = 0;
          mask.pixels[index + 2] = 0;
          mask.pixels[index + 3] = 0;
        } else {
          mask.pixels[index + 0] = 255;
          mask.pixels[index + 1] = 255;
          mask.pixels[index + 2] = 255;
          mask.pixels[index + 3] = 255;
        }
      }
    }
    mask.updatePixels();

    // Scale the image and the transparency mask
    let scaleFactor = min(width / img.width, height / img.height);
    let scaledWidth = img.width * scaleFactor;
    let scaledHeight = img.height * scaleFactor;
    scaledImg = createImage(scaledWidth, scaledHeight);
    scaledImg.copy(img, 0, 0, img.width, img.height, 0, 0, scaledWidth, scaledHeight);
    scaledMask = createImage(scaledWidth, scaledHeight);
    scaledMask.copy(mask, 0, 0, img.width, img.height, 0, 0, scaledWidth, scaledHeight);

    // Blend the scaled image and the scaled mask to produce the final output image
    let output = createImage(width, height);
    output.copy(scaledImg, 0, 0, scaledWidth, scaledHeight, 0, 0, width, height);
    output.blend(scaledMask, 0, 0, scaledWidth, scaledHeight, 0, 0, width, height, MULTIPLY);

    // Convert the output image to a base64-encoded PNG data URL
    let dataURL = output.canvas.toDataURL('image/png');

    return dataURL
  });
}

export default connect(null, mapDispatchToProps)(PokemonSprite);