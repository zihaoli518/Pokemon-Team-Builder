import React from 'react';
import { styled } from '@mui/material/styles';

import PokemonSprite from './PokemonSprite.jsx';

const SpriteWrapper = styled('div')({
  position: 'relative',
  width: '100%', // Adjust width
  height: '100%', // Adjust height
});

// const SpriteWrappedDouble = styled('img')({
//   position: 'absolute',
//   width: '100%',
//   height: '100%',
//   transition: 'opacity 0.5s ease-in-out',
// });

const SpriteWrappedTransition = (props) => {
  // const normalSpriteUrl = `path/to/normal/${pokemon}.png`; // Update path
  // const shinySpriteUrl = `path/to/shiny/${pokemon}.png`; // Update path
  console.log('in SpriteWrappedTransition', props)

  return (
    <SpriteWrapper className='sprite-wrapper-outter'>
        <PokemonSprite
          // key={props.key + 'shiny'}
          pokemon={props.pokemon}
          pokedexId={props.pokedexId}
          className= {props.className + ` sprite-wrapper-inner same-props ${props.shiny ? 'fade-in' : 'fade-out'}`}          
          type={props.type}
          shiny={true}
        />
        <PokemonSprite
          // key={props.key + 'normal'}
          pokemon={props.pokemon}
          pokedexId={props.pokedexId}
          className= {props.className+ ` sprite-wrapper-inner opposite-props ${props.shiny ? 'fade-out' : 'fade-in'}`}          
          type={props.type}
          shiny={false}
        />
    </SpriteWrapper>
  );
};

export default SpriteWrappedTransition;