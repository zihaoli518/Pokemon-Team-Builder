/**
 * ************************************
 *
 * @module CurrentPokemonDisplay
 * @author zi 
 * @date
 * @description displays pokemon info from fetch request 
 *
 * ************************************
 */

// importing dependencies 
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { connect } from 'react-redux';

// importing files 
import * as actions from '../actions/actions';
import PokemonSprite from './PokemonSprite.jsx';
import StatChartRadar from './StatChartRadar.jsx';
import CurrentPokemonDetails from './CurrentPokemonDetails.jsx';
import CurrentPokemonDetailsModern from './CurrentPokemonDetailsModern.jsx'


import EvolutionTree from './EvolutionTree.jsx';
import ImportExportModal from './modals/ImportExportModal.jsx';

import allMonsDataObj from '../allPokemonData.js';

import { Typography, Tooltip, Paper, Box, Grid, Accordion, AccordionSummary, AccordionDetails, SpeedDial, SpeedDialAction} from '@mui/material';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import FormatListNumberedRtlRoundedIcon from '@mui/icons-material/FormatListNumberedRtlRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';


import { useTheme } from '@mui/material/styles';

import isEqualState from 'lodash.isequal';
import { Troubleshoot } from '@mui/icons-material';



// currentPokemon contains all data. moveSet contains all moves(object)
const mapStateToProps = state => {
  return {
    currentPokemon : state.pokemon.currentPokemon,
    moveSet : state.pokemon.currentPokemon.moves,
    abilities: state.pokemon.currentPokemon.abilities,
    competetiveStatus : state.pokemon.currentPokemon.competetiveStatus,
  }
}

const mapDispatchToProps = dispatch => ({
  addPokemonToYourTeam : (pokemonObj) => dispatch(actions.addPokemonToYourTeam(pokemonObj)),
  addPokemonToEnemeyTeam: (pokemonObj) => dispatch(actions.addPokemonToEnemyTeam(pokemonObj)),
  selectAbility : (ability) => dispatch(actions.selectAbility(ability)),
  addMonToCalc : (pokemonObj, team) => dispatch(actions.addMonToCalc(pokemonObj, team))
});

const types = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water']


const CurrentPokemonDisplay = (props) => {
  const [state, setState] = useState({ 
    pokemon: props.currentPokemon, 
    immunities: [], 
    weaknesses: [], 
    resistances: [],
    immunityStripes: [],
    weaknessStripes: [],
    resistanceStripes: [],
  });

  const theme = useTheme();
  const [prevPokemon, setPrevPokemon] = useState({ current: null });
  const [expandedAccordion, setExpandedAccordion] = useState('');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : '');
  };


  const playCrySound = useCallback(() => {
    const parsedName = props.currentPokemon.pokemon.replace('-', '');
    const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${parsedName}.mp3`;
    const cryAudio = new Audio(cryUrl);
    cryAudio.play();
  }, [props.currentPokemon.pokemon]);

  const generateWeakness = useCallback(() => {
    const newImmunitiesArray = [];
    const newWeaknessArray = [];
    const newResistanceArray = [];

    const newImmunityStripesArray = [];
    const newWeaknessStripesArray = [];
    const newResistanceStripesArray = [];
    for (let type of types) {
      switch (props.currentPokemon.weakness[type]) {
        case 0:
          newImmunitiesArray.push(
            <Typography variant='h7' key={type} className={`type resistance-immune weakness-type-tag`} id={type}>{type}</Typography>
          );
          newImmunityStripesArray.push(
            <div
              className="types-colors-inner"
              id={type}
            ></div>
          );
          break;
        case 0.25: 
          newResistanceArray.unshift(
            <Typography variant='h7' key={type} className={`type resistance-x4 weakness-type-tag`} id={type}>{type}</Typography>
          );
          newResistanceStripesArray.push(
            <div
              className="types-colors-inner"
              id={type}
            ></div>
          );
          break;
        case 0.5: 
          newResistanceArray.push(
            <Typography variant='h7' key={type} className={`type resistance-x2 weakness-type-tag`} id={type}>{type}</Typography>
          );
          newResistanceStripesArray.push(
            <div
              className="types-colors-inner"
              id={type}
            ></div>
          );
          break;
        case 2: 
          newWeaknessArray.push(
            <Typography variant='h7' key={type} className={`type weakness-x2 weakness-type-tag`} id={type}>{type}</Typography>
          );
          newWeaknessStripesArray.push(
            <div
              className="types-colors-inner"
              id={type}
            ></div>
          );
          break;
        case 4: 
          newWeaknessArray.unshift(
            <Typography variant='h7' key={type} className={`type weakness-x4 weakness-type-tag`} id={type}>{type}</Typography>
          );
          newWeaknessStripesArray.push(
            <div
              className="types-colors-inner"
              id={type}
            ></div>
          );
          break;
        default:
          break;
      }
    }
    setState({ 
      pokemon: props.currentPokemon.pokemon,
      immunities: newImmunitiesArray, 
      weaknesses: newWeaknessArray, 
      resistances: newResistanceArray,
      immunityStripes: newImmunityStripesArray,
      weaknessStripes: newWeaknessStripesArray,
      resistanceStripes: newResistanceStripesArray,
    });
  }, [props.currentPokemon]);

  const addToTeam = useCallback((pokemon, team) => {
    if (team === "friendly") {
      props.addPokemonToYourTeam(pokemon);
    } else {
      props.addPokemonToEnemeyTeam(pokemon);
    }
  }, [props]);

  const updateActiveAbilityOnNewSearch = useCallback(() => {
    const activeAbility = props.currentPokemon.activeAbility; 
    const firstAbility = props.currentPokemon.abilities[0].ability;
    const url = firstAbility.url;
    fetch(decodeURIComponent(url))
      .then(data => data.json())
      .then(data => {
        let effectStr = data.effect_entries[1].effect; 
        let array = effectStr.split(/\r?\n|\r|\n/g);
        let newStr = array[0];
        let newAbilityObject = { name: firstAbility.name, description: newStr };
        props.selectAbility(newAbilityObject);
        makeDivActive('ability1', 'active-ability-highlighted');
      })
  }, [props]);

  const makeDivActive = useCallback((div, activeClassName) => {
    const previousActive = document.getElementsByClassName(activeClassName);
    if (previousActive.length !== 0) {
      if (previousActive[0].classList !== div) {
        previousActive[0].classList.remove(activeClassName);
      }
    } 
    const container = document.getElementsByClassName(div)[0];
    container.classList.add(activeClassName);
  }, []);


  const prevPokemonRef = useRef(props.currentPokemon);

  useEffect(() => {
    generateWeakness();
    playCrySound();
    if (props.currentPokemon.slot.mon === null && !isEqualState(prevPokemon.current, props.currentPokemon)) {
      console.log('currentPokemonDisplay bug: ', prevPokemonRef.current, props.currentPokemon )
      updateActiveAbilityOnNewSearch();
    }
    setPrevPokemon({ current: props.currentPokemon });
  }, [props.currentPokemon]);


  return (
    <div
      className="current-pokemon-container"
      key={props.currentPokemon.slot.mon}
    >
      <EvolutionTree />

      <div className="current-pokemon-outter-flexbox">
        <Paper
          className="current-pokemon"
          key={props.currentPokemon.pokemon}
          elevation={3}
          sx={{
            height: "85%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            // backgroundColor: theme.palette.primary.dark,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              height: "6%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              // gap: "2%",
              zIndex: 100,
              backgroundColor: theme.palette.primary.dark,

              borderRadius: "0.6rem",
              // border: 2,
              // borderColor: theme.palette.secondary.main,
            }}
          >
            <InfoTwoToneIcon
              id="general-info-icon"
              sx={{ height: "70%", width: "auto", marginLeft: "3%" }}
            />
            <Typography sx={{ marginLeft: "2%" }}>General Info</Typography>
          </Paper>

          <Box
            className="top-flexbox"
            sx={{
              height: "15%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: "5%",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                width: "40%",
                alignSelf: "center",
                textAlign: "center",
                fontSize: "70%",
                marginLeft: "3%",
              }}
            >
              {props.currentPokemon.pokemon}
            </Typography>
            <div className="types">
              <h4 className={"type"} id={props.currentPokemon.types[0]}>
                {props.currentPokemon.types[0]}
              </h4>
              <h4
                className={"type" + " type-" + props.currentPokemon.types[1]}
                id={props.currentPokemon.types[1]}
              >
                {props.currentPokemon.types[1]}
              </h4>
              {/* <div className="current-pokemon-spacer"></div> */}
            </div>
            <Box
              sx={{
                height: "100%",
                width: "30%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormatListNumberedRtlRoundedIcon />
              <Typography>
                {
                  allMonsDataObj[
                    capitalizeAfterSpaceOrHyphen(props.currentPokemon.pokemon)
                  ].tier
                }
              </Typography>
            </Box>
          </Box>

          {/* <div className="current-pokemon-flexbox"> */}
          <Box
            className="current-pokemon-sprite-chart-row"
            sx={{
              height: "40%",
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "40%",
                height: "100%",
                display: "flex",
                marginLeft: "5%",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <PokemonSprite
                key={props.currentPokemon.slot.mon}
                pokemon={props.currentPokemon.pokemon}
                className="current-sprite-main"
              />
              <div
                className={
                  "oval-ground " + "type-" + props.currentPokemon.types[0]
                }
              ></div>
            </Box>
            <div className="stats">
              <StatChartRadar
                name={props.currentPokemon.pokemon}
                pokemonStats={props.currentPokemon.stats}
                currentPokemon={props.currentPokemon}
                id={"current-pokemon-chart"}
              />
            </div>
          </Box>

          <Box
            className="current-pokemon-weakness-summary"
            sx={{ height: "30%" }}
          >
            <Accordion
              expanded={expandedAccordion === "panel1"}
              onChange={handleChange("panel1")}
              className={
                expandedAccordion !== "panel1"
                  ? "collapsed-accordion"
                  : "expanded-accordion"
              }
              sx={{
                height: "33%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                marginBottom: "0px !important",
              }}
            >
              <AccordionSummary
                className="accordion-summary-weakness"
                expandIcon={<ExpandMoreIcon />}
                aria-controls="resistances-content"
                id="resistances-header"
                sx={{ backgroundColor: theme.palette.custom.shadows.main }}
              >
                <Typography
                  sx={{ fontSize: "25%", width: "27%" }}
                  variant="h6"
                  component="h6"
                >
                  Immunity
                </Typography>
                <Box
                  className={
                    expandedAccordion !== "panel1"
                      ? "types-color-minimized"
                      : "types-color-hidden"
                  }
                  sx={{
                    width: "70%",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "5%",
                    flexWrap: "wrap",
                    gap: "2%",
                  }}
                >
                  {expandedAccordion !== "panel1"
                    ? state.immunityStripes
                    : null}
                </Box>
              </AccordionSummary>
              <AccordionDetails className="accordion-details-weakness">
                {state.immunities.map((immunity, index) => (
                  <Box
                    key={index}
                    sx={{
                      margin: "1%",
                      height: "40%",
                      width: "17%",
                      display: "flex",
                    }}
                  >
                    {immunity}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expandedAccordion === "panel2"}
              onChange={handleChange("panel2")}
              className={
                expandedAccordion !== "panel2"
                  ? "collapsed-accordion"
                  : "expanded-accordion"
              }
              sx={{
                height: "33%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                marginBottom: "0px !important",
              }}
            >
              <AccordionSummary
                className="accordion-summary-weakness"
                expandIcon={<ExpandMoreIcon />}
                aria-controls="resistances-content"
                id="resistances-header"
                sx={{ backgroundColor: theme.palette.custom.shadows.main }}
              >
                <Typography
                  sx={{ fontSize: "25%", width: "27%" }}
                  variant="h6"
                  component="h6"
                >
                  Weakness
                </Typography>
                <Box
                  className={
                    expandedAccordion !== "panel2"
                      ? "types-color-minimized"
                      : "types-color-hidden"
                  }
                  sx={{
                    width: "70%",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "5%",
                    flexWrap: "wrap",
                    gap: "2%",
                  }}
                >
                  {expandedAccordion !== "panel2"
                    ? state.weaknessStripes
                    : null}
                </Box>
              </AccordionSummary>
              <AccordionDetails
                flexWrap="wrap"
                className="accordion-details-weakness"
              >
                {state.weaknesses.map((weakness, index) => (
                  <Box
                    key={index}
                    sx={{
                      margin: "1%",
                      height: "40%",
                      width: "17%",
                      display: "flex",
                    }}
                  >
                    {weakness}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expandedAccordion === "panel3"}
              onChange={handleChange("panel3")}
              className={
                expandedAccordion !== "panel3"
                  ? "collapsed-accordion"
                  : "expanded-accordion"
              }
              sx={{
                height: "33%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                marginBottom: "0px !important",
              }}
            >
              <AccordionSummary
                className="accordion-summary-weakness"
                expandIcon={<ExpandMoreIcon />}
                aria-controls="resistances-content"
                id="resistances-header"
                sx={{ backgroundColor: theme.palette.custom.shadows.main }}
              >
                <Typography
                  sx={{ fontSize: "25%", width: "27%" }}
                  variant="h6"
                  component="h6"
                >
                  Resistance
                </Typography>
                <Box
                  className={
                    expandedAccordion !== "panel3"
                      ? "types-color-minimized"
                      : "types-color-hidden"
                  }
                  sx={{
                    width: "70%",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "5%",
                    flexWrap: "wrap",
                    gap: "2%",
                  }}
                >
                  {expandedAccordion !== "panel3"
                    ? state.resistanceStripes
                    : null}
                </Box>
              </AccordionSummary>
              <AccordionDetails
                flexWrap="wrap"
                className="accordion-details-weakness"
              >
                {state.resistances.map((resistance, index) => (
                  <Box
                    key={index}
                    sx={{
                      margin: "1%",
                      height: "40%",
                      width: "17%",
                      display: "flex",
                    }}
                  >
                    {resistance}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Paper>


        <Paper
          className="add-to-team-option-buttons"
          key={props.currentPokemon.name}
          elevation={6}
          sx={{
            height: "15%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}

          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
        >
          <Paper
            elevation={3}
            sx={{
              height: "20%",
              display: "flex",
              justifyContent: "flex-start",
              gap: "2%",
              zIndex: 100,
              alignItems: "center",
              borderRadius: "0.6rem",
              backgroundColor: theme.palette.primary.dark,
            }}
          >
            <ShareRoundedIcon
              id="current-mon-options-icon"
              sx={{ height: "80%", width: "auto", marginLeft: '3%' }}
            />
            <Typography
              sx={{ marginLeft: "3%", lineHeight: "100%", fontSize: "25%" }}
            >
              Add / Calc
            </Typography>
          </Paper>

          <Box
            sx={{
              height: "80%",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              gap: "3%",
            }}
          >
            {/* <Backdrop open={open} /> */}
            <SpeedDial
              ariaLabel="SpeedDial tooltip example"
              icon={
                <SpeedDialIcon
                  sx={{ color: theme.palette.custom.friendly.main }}
                />
              }
              direction="right"
              // onClose={handleClose}
              // onOpen={handleOpen}
              // open={open}
            >
              <SpeedDialAction
                icon={
                  <AddCircleTwoToneIcon
                    sx={{ color: theme.palette.custom.friendly.main }}
                  />
                }
                tooltipTitle={"add to your team"}
                onClick={() => {
                  addToTeam({ ...props.currentPokemon }, "friendly");
                }}
              />

              <SpeedDialAction
                icon={
                  <CalculateRoundedIcon
                    sx={{ color: theme.palette.custom.friendly.main }}
                  />
                }
                tooltipTitle={"damage calculator (your side)"}
                onClick={() => {
                  props.addMonToCalc({ ...props.currentPokemon }, "friendly");
                }}
              />
            </SpeedDial>

            <SpeedDial
              ariaLabel="SpeedDial tooltip example"
              icon={
                <SpeedDialIcon
                  sx={{ color: theme.palette.custom.enemy.main }}
                />
              }
              direction="left"

              // onClose={handleClose}
              // onOpen={handleOpen}
              // open={open}
            >
              <SpeedDialAction
                icon={<AddCircleTwoToneIcon />}
                tooltipTitle={"add to opponent team"}
                onClick={() => {
                  addToTeam({ ...props.currentPokemon }, "enemy");
                }}
                sx={{ color: theme.palette.custom.enemy.main }}
              />

              <SpeedDialAction
                icon={<CalculateRoundedIcon />}
                tooltipTitle={"damage calculator (opponent side)"}
                onClick={() => {
                  props.addMonToCalc({ ...props.currentPokemon }, "enemy");
                }}
                sx={{ color: theme.palette.custom.enemy.main }}
              />
            </SpeedDial>
          </Box>
        </Paper>
      </div>
      { (props.themeMode==='pallet town') ?
          <CurrentPokemonDetails />
          :
          < CurrentPokemonDetailsModern /> 
      }
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentPokemonDisplay);




function capitalizeAfterSpaceOrHyphen(str) {
  return str
    .split(/([-\s])/g) // Split the string by spaces or hyphens, retaining the separators
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(''); // Join them back together
}