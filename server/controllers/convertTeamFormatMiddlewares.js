const fetch = require('node-fetch');
const parse = require('node-html-parser');
const {Teams} = require('pokemon-showdown');


const convertTeamFormatMiddlewares = {}; 

// hnadles converting export format to JSON format
convertTeamFormatMiddlewares.importMon = (req, res, next) => {
  const exportFormatMon = req.body.team
  console.log('inside importMon middleware ', exportFormatMon);

  // const testJSON =   [{
  //   "name": "",
  //   "species": "Armaldo",
  //   "gender": "",
  //   "item": "Leftovers",
  //   "ability": "Swift Swim",
  //   "evs": {"hp": 128, "atk": 252, "def": 4, "spa": 0, "spd": 0, "spe": 124},
  //   "nature": "Adamant",
  //   "moves": ["X-Scissor", "Stone Edge", "Aqua Tail", "Rapid Spin"]
  //  }]

  console.log(Teams.import(exportFormatMon));

  const pokemonObj = Teams.import(exportFormatMon)[0];
  pokemonObj.item = pokemonObj.item.toLowerCase().replace(' ','-');
  pokemonObj.moves = pokemonObj.moves.map(move => move.toLowerCase());

  // fetch('')
  req.body.pokemon = pokemonObj.species.toLowerCase();

  res.locals.importedMon = pokemonObj;
  return next();
}

convertTeamFormatMiddlewares.exportMon = (req, res, next) => {
  const reduxPokemonObject = req.body.mon;
  const movesArray = [];
  for (let moveKey in reduxPokemonObject.moves) {
    movesArray.push(capitalizeWords(reduxPokemonObject.moves[moveKey].name))
  }

  let standardFormatMon = {
    name: "",
    species: capitalizeWords(reduxPokemonObject.pokemon),
    gender: "",
    item: capitalizeWords(reduxPokemonObject.item.item),
    ability: capitalizeWords(reduxPokemonObject.activeAbility.name),
    evs: reduxPokemonObject.evs.obj,
    nature: capitalizeWords(reduxPokemonObject.nature),
    moves: movesArray
  }

  console.log(standardFormatMon);
  console.log(Teams.exportSet(standardFormatMon));
  res.locals.exportedSet = Teams.exportSet(standardFormatMon);
  return next();
}

// helper functions 
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function capitalizeWords(str) {
  return str.replace(/\b\w/g, function(match) {
    return match.toUpperCase();
  }).replace(/-/g, ' ');
}

module.exports= convertTeamFormatMiddlewares;