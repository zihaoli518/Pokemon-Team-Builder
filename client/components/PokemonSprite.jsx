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
import React from 'react';
import { connect } from 'react-redux';
import fetch from 'node-fetch';


const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  updateGif : (url) => dispatch(actions.updateGif(url)),
});

const PokemonSprite = props => {
  // console.log(props)
  let url = 'https://play.pokemonshowdown.com/sprites/xyani/' + props.pokemon.toLowerCase() + '.gif'

  let className = '';
  let onClick = null;
  if (props.className) className = props.className;
  if (props.onClick) onClick = props.onClick;
  console.log(url)

  fetch('/api/testForNewerSprites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain',
    },
    body: JSON.stringify({url: url})
  })
    // .then((response) => response.json())
    .then((updatedUrl) => {
      console.log('testForNewerSprites FRONT ', updatedUrl);
      url = updatedUrl;
      if (updatedUrl.error === 404) {
        alert('ERROR in testForNewerSprites FRONT ')
      }
    })


  return (
    <img onClick={onClick} className={className} src={url} />
  )
}

export default connect(null, mapDispatchToProps)(PokemonSprite);