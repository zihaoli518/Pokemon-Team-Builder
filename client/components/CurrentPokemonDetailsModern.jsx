import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  TextField, 
  InputAdornment, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';


import PokemonSprite from './PokemonSprite.jsx';


import * as actions from '../actions/actions';
import Data from './dexData.js';
import SpriteWrappedTransition from './SpriteWrappedTransition.jsx';


const allItemsJSON = Data.allItemsJSON;
const allMovesJSON = Data.allMovesJSON;


const StyledImage = styled('img')({
  width: '24px',
  height: '24px',
});



const mapStateToProps = state => ({
  currentPokemon: state.pokemon.currentPokemon,
  activeAbility: state.pokemon.currentPokemon.activeAbility,
  yourTeam: state.pokemon.yourTeam,
});

const mapDispatchToProps = dispatch => ({
  selectAbility: (ability) => dispatch(actions.selectAbility(ability)),
  saveItemToMon: (item, description, url) => dispatch(actions.saveItemToMon(item, description, url)),
  updateSavedTeam: (team, triggeredBy) => dispatch(actions.updateSavedTeam(team, triggeredBy)),
  updateActiveMove: (moveId, moveObj) => dispatch(actions.updateActiveMove(moveId, moveObj)),
  selectMoveFromList: (moveId, moveObj) => dispatch(actions.selectMoveFromList(moveId, moveObj)),

  updateCurrentSet: (category, data) => dispatch(actions.updateCurrentSet(category, data)),
});




const CurrentPokemonDetails = props => {
  const theme = useTheme();

  const [currentlyActiveDiv, setCurrentlyActiveDiv] = useState('');
  const [showBrowseArea, setShowBrowseArea] = useState(false);
  const [allMoveContainers, setAllMoveContainers] = useState([]);
  const [allAbilitiesToBeDisplayed, setAllAbilitiesToBeDisplayed] = useState([]);
  const [allItemsToBeDisplayed, setAllItemsToBeDisplayed] = useState([]);
  const [allMovesToBeDisplayed, setAllMovesToBeDisplayed] = useState([]);
  
  const [valuesOfEV, setValuesOfEv] = useState({ hp: 0, attack: 0, defense: 0, specialA: 0, specialD: 0, speed: 0 });
  const [valuesOfIV, setValuesOfIv] = useState({ hp: 31, attack: 31, defense: 31, specialA: 31, specialD: 31, speed: 31 });
  const [calculatedStat, setCalculatedStat] = useState({ hp: 0, attack: 0, defense: 0, specialA: 0, specialD: 0, speed: 0 });

  const [expandContainer, setExpandContainer] = useState(false);
  const boxRef = useRef(null);

  const handleClickOutside = (event) => {
    if (boxRef.current && !boxRef.current.contains(event.target)) {
      setExpandContainer(false);
    }
  };
  // a list of jsx/MUI list components ready to be displayed 
  const [listDisplay, setListDisplay] = useState([]);
  const [selectedThing, setSelectedThing] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [currentInputText, setCurrentInputText] = useState({
    ability: props.currentPokemon.activeAbility.name,
    item: props.currentPokemon.item.item,
    nickName: props.currentPokemon.nickname,
    shiny: props.currentPokemon.shiny,
    move_1: props.currentPokemon.moves.move_1.name ? props.currentPokemon.moves.move_1.name : '',
    move_2: props.currentPokemon.moves.move_2.name ? props.currentPokemon.moves.move_1.name : '',
    move_3: props.currentPokemon.moves.move_3.name ? props.currentPokemon.moves.move_1.name : '',
    move_4: props.currentPokemon.moves.move_4.name ? props.currentPokemon.moves.move_1.name : '',
  })


  const prevPokemon = useRef(props.currentPokemon);

  const capitalizeWords = str => str.replace(/\b\w/g, match => match.toUpperCase()).replace(/-/g, ' ');

  const makeDivActive = (div, activeClassName, activeComponent) => {
    setCurrentlyActiveDiv(activeComponent);
    if (div === 'abilities-container' || div === 'evs-container') {
      setShowBrowseArea(false);
    } else {
      setShowBrowseArea(true);
    }
  };


  // abilities
  const populateAbilities = () => {
    const newAbilitiesToBeDisplayed = props.currentPokemon.abilities.map((ability, i) => {
      const name = capitalizeWords(ability.ability.name);
      const url = ability.ability.url;
      const className = `ability ability${i + 1} pokemon-details-${name} ${props.currentPokemon.activeAbility.name === name ? 'active-ability-highlighted' : ''}`;
      return (
        <Box key={name} className={className} onClick={() => chooseAbility(name, url, `ability${i + 1}`, 'active-ability-highlighted')}>
          <Typography variant="h6">{name}</Typography>
        </Box>
      );
    });
    setAllAbilitiesToBeDisplayed(newAbilitiesToBeDisplayed);
    if (!props.currentPokemon.activeAbility.name) {
      const firstAbility = props.currentPokemon.abilities[0].ability;
      getAbilityDescription(firstAbility.name, firstAbility.url);
    }
  };

  const getAbilityDescription = async (ability, url) => {
    const response = await fetch(decodeURIComponent(url));
    const data = await response.json();
    const effectStr = data.effect_entries[1].effect;
    const newStr = effectStr.split(/\r?\n|\r|\n/g)[0];
    const newAbilityObject = { name: ability, description: newStr };
    props.selectAbility(newAbilityObject);
  };

  const chooseAbility = (name, url, div, activeClassName) => {
    getAbilityDescription(name, url);
    makeDivActive(div, activeClassName, 'abilities-container');
    props.updateSavedTeam(props.yourTeam, 'CurrentPokemonDetails.chooseAbility');
  };


// items
  const populateItems = (searchStr = '') => {
    const filteredItems = Object.entries(allItemsJSON).filter(([name]) => name.toLowerCase().includes(searchStr.toLowerCase()));
    const newItemsToBeDisplayed = filteredItems.map(([name, itemData]) => {
      const { spriteUrl, desc, nameLowerCase } = itemData;
      const nameWithDash = nameLowerCase.replace('-', ' ');
      return (
        <ListItem 
          key={name} 
          button 
          onClick={() => chooseItem(name, spriteUrl, desc, `item-row-${name}`, 'active-item-browse-area', 'item-container')}
          sx={{ height: '25%', display: 'flex', alignItems: 'center' }}
        >
          <ListItemAvatar>
            <Avatar src={spriteUrl} />
          </ListItemAvatar>
          <ListItemText 
            sx={{ 
              fontSize: '20%', 
              '& .MuiTypography-root': {
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                lineHeight: '100%'
              }
            }} 
            primary={capitalizeWords(nameWithDash)} 
            secondary={desc} 
          />
        </ListItem>
      );
    });
    setListDisplay(newItemsToBeDisplayed);
  };

  const chooseItem = (name, url, description, div, activeClassName, activeComponent) => {
    makeDivActive(div, activeClassName, activeComponent);
    props.saveItemToMon(name, description, url);
    props.updateSavedTeam(props.yourTeam, 'CurrentPokemonDetails.chooseItem');
    setCurrentInputText({...currentInputText, item: name})
  };

  const searchAndDisplayItems = (input) => {
    // const input = document.getElementById('item-search-input').value;
    populateItems(input);
  };


// moves
  const selectMoveContainer = (num) => {
    makeDivActive('moves-container', 'active-pokemon-detail-container', 'moves-container');
    makeDivActive(`move-container-${num}`, 'active-move-container', 'move-container');
    props.updateActiveMove(`move_${num}`, props.currentPokemon.moves[`move_${num}`]);
  };

  const populateMoves = (searchStr = '') => {
    const filteredMoves = Object.entries(allMovesJSON).filter(([name]) => props.currentPokemon.movePool[name] && name.toLowerCase().includes(searchStr.toLowerCase()));
    const newMovesToBeDisplayed = filteredMoves.map(([name, moveData]) => {
      const { category, shortDesc, type, basePower, accuracy, typeImageUrl, categoryImageUrl } = moveData;
      const nameWithDash = name.replace(' ', '-');
      return (
        <ListItem key={nameWithDash} button onClick={() => chooseMove(props.currentPokemon.activeMove.moveId, moveData, `move-row-${nameWithDash}`, 'active-move-browse-area', 'moves-container')}>
          <ListItemText
            primary={
              <Grid container alignItems="center">
                <Grid item xs={4}>{capitalizeWords(name)}</Grid>
                <Grid item xs={2}><Avatar src={typeImageUrl} /></Grid>
                <Grid item xs={2}><Avatar src={categoryImageUrl} /></Grid>
                <Grid item xs={2}>{basePower || '-'}</Grid>
                <Grid item xs={2}>{accuracy || '100%'}</Grid>
              </Grid>
            }
            secondary={shortDesc}
          />
        </ListItem>
      );
    });
    setAllMovesToBeDisplayed(newMovesToBeDisplayed);
  };

  const chooseMove = (moveId, moveObj, div, activeClassName, activeComponent) => {
    makeDivActive(div, activeClassName, activeComponent);
    props.selectMoveFromList(moveId, moveObj);
    selectMoveContainer(Number(moveId[moveId.length - 1]) + 1);
  };

  const searchAndDisplayMoves = (input) => {
    // const input = document.getElementById('move-search-input').value;
    populateMoves(input);
  };


  // switches menu, list display, activeSelection from a str like 'items'
  const handleSelectMenu = (menuStr) => {
    console.log('handleSelectedMenu', menuStr, props.currentPokemon.shiny)
    if (menuStr==='items') {
      const newMenuComponents = (
        <Box sx={{height:'100%', width: '100%', display: 'flex', justifyContent:'flex-start'}}>
          <Typography>Items</Typography>
          <Typography>Description</Typography>
        </Box>
      );
      const newSelectedItem = (
        <List sx={{ height: '100%', width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <ListItem
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}
          key={props.currentPokemon.item.item}
        >
          <ListItemAvatar sx={{ height: '100%', minWidth: 0, marginRight: 1 }}>
            <Avatar sx={{ height: '100%', width: 'auto' }} src={props.currentPokemon.item.url} />
          </ListItemAvatar>
          <ListItemText
            sx={{ height: '100%', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
            primary={capitalizeWords(props.currentPokemon.item.item)}
            secondary={props.currentPokemon.item.description}
          />
        </ListItem>
      </List>
          
      )
      setSelectedMenu(newMenuComponents);
      setSelectedThing(newSelectedItem);
      populateItems();
    }
    if (menuStr==='abilities') {

    }
    
    if (menuStr==='shiny') {
      // setCurrentInputText({...currentInputText, shiny: !currentInputText.shiny});
      props.updateCurrentSet('shiny', !props.currentPokemon.shiny)
    }

  }




  useEffect(() => {
    if (prevPokemon.current !== props.currentPokemon) {
      populateAbilities();
      populateItems();
      populateMoves();
    }
    prevPokemon.current = props.currentPokemon;
  }, [props.currentPokemon]);

  // for changing display when mouse is outside 
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    // <Container sx={{ height: "100%", width: "60%", paddingLeft: '0 !immportant', }}>
      <Box
        container
        ref={boxRef}
        onClick={() => setExpandContainer(true)}
        sx={{
          height: "100%",
          width: expandContainer ? "70%" : "60%",
          display: "flex",
          flexDirection: 'column',
          justifyContent: "flex-start",
          transition: 'width 0.3s',
          '&:hover': {
            width: '70%',
          },
          // overflowY: 'scroll'
        }}
      >
        <Grid
          container
          spacing={1}
          sx={{ height: "40%", width: '100%', display: "flex", justifyContent: "flex-start" }}
        >

        <Grid item xs={4}>
  <Paper sx={{ height: "100%", display: "flex", flexDirection: 'column', justifyContent: 'center' }}>
    <Paper
      elevation={3}
      sx={{
        height: "8%",
        display: "flex",
        justifyContent: "flex-start",
        gap: "3%",
        zIndex: 100,
        alignItems: "center",
        borderRadius: "0.3rem",
        backgroundColor: theme.palette.primary.dark,
      }}
    >
      <Typography
        sx={{ marginLeft: "3%", lineHeight: "100%", fontSize: "28%" }}
      >
        Details
      </Typography>
    </Paper>

    <Box sx={{ height: "50%", width: '100%', display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
      <TextField 
        label="Nickname" 
        value={currentInputText.nickName} 
        variant="outlined" 
        sx={{ 
          width: '70%', 
          height: '30%',
          marginLeft: '5%',
        }}
        onChange={(e) => {setCurrentInputText({...currentInputText, nickName: e.target.value})}}
      />
      <Box sx={{ height: '70%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <SpriteWrappedTransition
          key={props.currentPokemon.pokemon}
          pokemon={props.currentPokemon.pokemon}
          pokedexId={props.currentPokemon.pokedexId}
          className={"pokemon-sprite-detail"}
          type={"still"}
          shiny={props.currentPokemon.shiny}
        />
        <Box
        sx={{
          height: "100%",
          width: '60%',
          display: "flex",
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          // Ensure the Box is centered and scales properly
        }}
      >
        <Box
          sx={{height: '50%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        >
          <FormControlLabel
            sx={{
              width: '40%',  // Ensures the FormControlLabel takes up 80% of its container's width
              margin: 0,
            }}
            control={<Switch size='small' sx={{width: '100%'}} checked={props.currentPokemon.shiny} onClick={() => {handleSelectMenu('shiny')}} />}
          />
          <Typography 
            sx={{ width: '30%', fontSize: '20%', }}
          >
            Shiny
          </Typography>
        </Box> 

        <FormControl
          sx={{
            width: '90%',
            height: '40%',
            flex: 1, // Ensure it takes available space
            display: 'flex',
            flexDirection: 'column',
          }}
          size="small"
        >
          <InputLabel id="demo-simple-select-label">Tera Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            value="10" // Ensure this value is consistent with your MenuItem values
            label="Tera Type"
            sx={{fontSize: '25%'}}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Box>
      </Box>
      


    </Box>

    <Box sx={{ height: "50%", width: '100%', display: "flex", justifyContent: 'center', alignItems: 'center', marginTop: '3%' }}>
   
      <Box sx={{ height: "100%", width: '90%', display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

        <Box sx={{ height: "45%", width: '90%', display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <TextField
            label="Ability"
            value={currentInputText.ability}
            variant="outlined"
            sx={{ width: '100%', height: '100%', fontSize: '90%'}}
            onChange={(e) => {setCurrentInputText({...currentInputText, ability: e.target.value})}}
          />
        </Box>

        <Box sx={{ height: "45%", width: '90%', display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <TextField
            label="Item"
            variant="outlined"
            value={currentInputText.item}
            sx={{ width: '100%', height: '100%', fontSize: '90%',
              '& .MuiInputBase-input': {
              margin: 0
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{width: '25%', marginRight: 0, marginLeft: '5%'}}>
                  <StyledImage src={props.currentPokemon.item.url} />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {searchAndDisplayItems (e.target.value); setCurrentInputText({...currentInputText, item: e.target.value})} }
            onClick={(e) => {handleSelectMenu('items')}}
          />
        </Box>

      </Box>
    </Box>
  </Paper>
</Grid>


          <Grid
            item
            xs={4}
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Paper sx={{ height: "100%", display: "flex" }}>
              <Box p={2}>
                <Typography variant="h5">Moves</Typography>
                {/* <TextField
                  id="move-search-input"
                  label="Search Moves"
                  variant="outlined"
                  // fullWidth
                  onChange={searchAndDisplayMoves}
                /> */}
                {/* <List>{allMovesToBeDisplayed}</List> */}
              </Box>
            </Paper>
          </Grid>

          <Grid
            item
            xs={4}
            sx={{
              height: "40%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Paper sx={{ height: "100%", display: "flex" }}>
              <Box p={2}>
                <Typography variant="h5">Stats & EVs</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        
        <Paper elevation={3} sx={{ height: "60%", width: "95%", }}>
          <Box sx={{height: '25%', width: '100%', backgroundColor: theme.palette.background.default, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              {selectedThing}
          </Box>
          <Box sx={{height: '10%', width: '100%',  backgroundColor: ''}}>
              {selectedMenu}
          </Box>
          <Paper elvation={5} sx={{ height: "65%", width: '100%', overflowY: "scroll",  backgroundColor: '' }}>
            <List sx={{ height: "100%", }}>
              {listDisplay}
            </List>
          </Paper>
        </Paper>
      </Box>
    // </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrentPokemonDetails);
