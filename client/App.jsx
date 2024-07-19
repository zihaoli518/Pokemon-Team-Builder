/**
 * ************************************
 *
 * @module  App.jsx
 * @author zi
 * @date
 * @description main app  
 *
 * ************************************
 */

// importing dependencies
import React, { useState, useEffect, useCallback } from 'react';
import { Routes } from 'react-router-dom';
import { Router, Route, Link, browserHistory, IndexRedirect } from 'react-router';

import { connect } from 'react-redux';

// importing components 
import TopNavBar from './components/TopNavBar.jsx';
import PokemonSearch from './components/PokemonSearch.jsx';
import CurrentPokemonDisplay from './components/CurrentPokemonDisplay.jsx';
import TeamDisplay from './components/TeamDisplay.jsx';
import SwitchTeams from './components/SwitchTeams.jsx';
import MoreInfo from './components/MoreInfo.jsx';
import AnalysisMenu from './components/AnalysisMenu.jsx';

import MatchupChart from './components/analysis-menu/MatchupChart.jsx';
import AllSavedTeams from './components/AllSavedTeams.jsx';
import BrowsingHistory from './components/BrowsingHistory.jsx';
import ControlButtonGroup from './components/ControlButtonGroup.jsx';

import themeSongFile from '../assets/theme.mp3';
import buttonSoundFile from '../assets/button-sound-effect.mp3';

import { Switch, FormControlLabel } from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

import './styles/App.scss';

import favicon from '../assets/favicon.ico';

// Import background images
import morningBackground from '../assets/background-merged-afternoon.jpeg';

const themeSong = new Audio(themeSongFile);
const buttonSound = new Audio(buttonSoundFile);

// global themes 
let modernDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90afaf',
      contrastText: '#e5eaea',
      dark: '#707f7f',
    },
    secondary: {
      main: '#ffcdd2',
    },
    background: {
      default: '#21232d',
      paper: '#26262f',
    },
    info: {
      main: '#b3e5fc',
    },
    custom: {
      friendly: {
        main: '#badcd8',
      },
      enemy: {
        main: '#FF5733',
      },
      shadows: {
        main: 'rgba(41,41,49,0.53)',
      }
    },
  },
});

let palletTownTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ffecb3',
      contrastText: '#e5eaea',
      dark: '#263238',
    },
    secondary: {
      main: '#ffcdd2',
    },
    background: {
      default: '#334252',
      paper: '#aed581',
    },
    info: {
      main: '#ffee58',
    },
    text: {
      primary: 'rgba(45,45,45,0.87)',
    },
    custom: {
      friendly: {
        main: '#badcd8',
      },
      enemy: {
        main: '#FF5733',
      },
    },
  },
  typography: {
    fontFamily: 'Indie Flower, cursive',
  },
});

// play music 
window.addEventListener('click', () => {
  addSoundEffectToButtons();
  themeSong.play();
});

const addSoundEffectToButtons = () => {
  const playSound = () => {
    buttonSound.play();
  };
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    button.addEventListener('click', playSound);
  });
};

// redux setup 
const mapStateToProps = (state) => ({
  currentPokemon: state.pokemon.currentPokemon,
  teamStatus: state.pokemon.teamStatus,
  analysisMenuStatus: state.damageCalc.analysisMenuStatus,
  yourTeam: state.pokemon.yourTeam,
  enemyTeam: state.pokemon.enemyTeam,
  showTypingChart: state.pokemon.showTypingChart,
  mainDivClassName: state.userFunctions.mainDivClassName,
});

const App = (props) => {
  const [volume, setVolume] = useState(0.5);
  const [themeMode, setThemeMode] = useState('modernDark');
  // displays 
  const [savedTeamsDisplay, setSavedTeamsDisplay] = useState(false);

  useEffect(() => {
    console.log('in App.jsx... ', 'current theme: ', themeMode);
    addSoundEffectToButtons();
  }, [themeMode]);

  useEffect(() => {
    addSoundEffectToButtons();
  }, []);

  const changeAppVolume = useCallback(() => {
    const volumeControl = document.getElementById('volume-slider');
    const newAppVolume = volumeControl.value;
    setVolume(newAppVolume);
    themeSong.volume = newAppVolume;
    buttonSound.volume = newAppVolume;
  }, []);

  useEffect(() => {
    const slider = document.getElementById('volume-slider');
    slider.addEventListener('change', changeAppVolume);
    return () => {
      slider.removeEventListener('change', changeAppVolume);
    };
  }, [changeAppVolume]);

  // passing theme 
  const theme = themeMode === 'modernDark' ? modernDarkTheme : palletTownTheme;
  const handleThemeChange = () => {
    setThemeMode((prevMode) => (prevMode === 'modernDark' ? 'palletTown' : 'modernDark'));
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="app-container"
        style={{
          backgroundImage: themeMode === 'palletTown' ? `url(${morningBackground})` : 'none',
          backgroundColor: themeMode === 'modernDark' ? theme.palette.background.default : 'none',
      }}>
        <TopNavBar appVolume={volume} changeAppVolume={changeAppVolume} themeMode={themeMode} handleThemeChange={handleThemeChange} />
        <div
          className={props.mainDivClassName}
          id="main-div"
        >
          {!props.currentPokemon.isActive ? (
            <div className="explore-tip">
              <h4>start exploring/team building by looking up a pokemon!</h4>
            </div>
          ) : null}
          
          <div className="navigator-and-history-container"> 
            <ControlButtonGroup savedTeamsDisplay={savedTeamsDisplay} setSavedTeamsDisplay={setSavedTeamsDisplay} />
            <BrowsingHistory />
          </div>

          <div className="main-row-container">
            <AllSavedTeams savedTeamsDisplay={savedTeamsDisplay} setSavedTeamsDisplay={setSavedTeamsDisplay} />
            <div className="current-pokemon-display-container">
              {props.currentPokemon.isActive ? <CurrentPokemonDisplay /> : null}
            </div>
          </div>
          <div className="teams">
            <TeamDisplay key="green" team="green" />
            <SwitchTeams />
            <TeamDisplay key="red" team="red" />
          </div>
          {props.teamStatus || props.analysisMenuStatus ? <AnalysisMenu /> : null}

          <div className="footer-container">
            <h4>electabuzzed.xyz</h4>
            <h5>source code at: </h5>
            <a href="https://github.com/zihaoli518/Pokemon-Team-Builder">https://github.com/zihaoli518/Pokemon-Team-Builder</a>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default connect(mapStateToProps, null)(App);

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
