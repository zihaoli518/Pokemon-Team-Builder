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


const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  updateGif : (url) => dispatch(actions.updateGif(url)),
});

const PokemonSprite = props => {
  // console.log(props)
  const url = 'https://play.pokemonshowdown.com/sprites/xyani/' + props.pokemon.toLowerCase() + '.gif'

  let className = '';
  let onClick = null;
  if (props.className) className = props.className;
  if (props.onClick) onClick = props.onClick;

  return (
    <img onClick={onClick} className={className} src={url} />
  )
}

export default connect(null, mapDispatchToProps)(PokemonSprite);