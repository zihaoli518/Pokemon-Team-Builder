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
import React, {useState} from 'react';
import { connect } from 'react-redux';

import PokemonSprite from './PokemonSprite.jsx';
import * as actions from '../actions/actions';

import { Box, Tooltip, Typography, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';



import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded';


const mapStateToProps = (state) => {
  return {
    currentPokemon: state.pokemon.currentPokemon,
  };
};

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  removeTeamMember : (team, pokemon) => dispatch(actions.removeTeamMember(team, pokemon)),
  selectTeamMember : (pokemonData, team, mon) => dispatch(actions.selectTeamMember(pokemonData, team, mon)),
  addMonToCalc : (pokemonObj, team) => dispatch(actions.addMonToCalc(pokemonObj, team))
});



const TeamMember = props => {
  console.log('inside <TeamMember/>', props)

  const id = props.selectedTeamName + '_' + props.selectedMon;
  const ClassNamePassed = 'pokemon-sprite-class-small';

  const giveSelfActiveClass = () => {
    const previousActive = document.getElementsByClassName('need-active-team-member-hover-effect');
    if (previousActive && previousActive.length!==0) {
      if (previousActive[0].id !== id) {
        previousActive[0].classList.remove('need-active-team-member-hover-effect');
      }
    }
    let activeMon = document.getElementById(id);
    activeMon.classList.add('need-active-team-member-hover-effect')

    
  }

  const theme = useTheme()


  return (
    // <div className="team-member-container">
    < Box className="team-member-container" >
      <div className="team-member-sprite-container">
        <PokemonSprite
          pokemon={props.pokemonName}
          className={ClassNamePassed}
          id={props.selectedTeamName + "_" + props.selectedMon}
          onClick={() => {
            giveSelfActiveClass();
            props.selectTeamMember(props.pokemonData, props.selectedTeam.key, props.selectedMon);
          }}
        />
      </div>
      <div className="types-colors">
        <div
          className="types-colors-inner"
          id={props.pokemonData.types[0]}
        ></div>
        {props.pokemonData.types[1] ? (
          <div
            className="types-colors-inner"
            id={props.pokemonData.types[1]}
          ></div>
        ) : null}
      </div>
      <Divider variant='middle' sx={{marginTop: '1%', borderColor: theme.palette.background.default}} />
      <Box className="team-member-actions" gap={'5%'}>
        <Tooltip
          title={<Typography sx={{ fontSize: "160%" }}>Calc</Typography>}
          arrow
        >
          <CalculateRoundedIcon onClick={()=>{props.addMonToCalc(props.pokemonData, (props.whichSide ==='green') ? 'friendly': 'enemy')}}/>
        </Tooltip>
        <Tooltip
          title={<Typography sx={{ fontSize: "160%" }}>Delete</Typography>}
          arrow
        >
          <DeleteOutlineRoundedIcon onClick={() => props.removeTeamMember(props.selectedTeamName, props.selectedMon)}/>
        </Tooltip>
      </Box>
    </Box>

  );
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamMember);