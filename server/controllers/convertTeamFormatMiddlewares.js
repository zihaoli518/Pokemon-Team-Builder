const fetch = import('node-fetch');
const parse = require('node-html-parser');
const {Teams} = require('pokemon-showdown');


const convertTeamFormatMiddlewares = {}; 

// hnadles converting export format to JSON format
convertTeamFormatMiddlewares.importMonSet= (req, res, next) => {
  const exportFormatText = req.body.team
  console.log('inside importMonSet middleware ', exportFormatText);

  const convertedArray = Teams.import(exportFormatText);
  console.log('convertedArray', convertedArray);

  const pokemonObj = convertedArray[0];
  pokemonObj.item = pokemonObj.item.toLowerCase().replace(' ','-');
  pokemonObj.moves = pokemonObj.moves.map(move => move.toLowerCase());

  // fetch('')
  req.body.pokemon = pokemonObj.species.toLowerCase();

  res.locals.importedSet = pokemonObj;
  return next();
}



convertTeamFormatMiddlewares.importTeam = (req, res, next) => {
  const exportFormatText = req.body.team;
  console.log('inside importSets middleware', exportFormatText);

  try {
    const convertedArray = Teams.import(exportFormatText);
    // console.log('Converted array:', convertedArray); // Add this line

    const resultArray = [];
    const pokemonNameArray = [];
    convertedArray.forEach(mon => {
      mon.item = mon.item.toLowerCase().replace(' ', '-');
      mon.moves.map(move => move.toLowerCase());
      resultArray.push(mon);
      pokemonNameArray.push(mon.species)
    });
    console.log('Result array:', resultArray, pokemonNameArray); // Add this line

    res.locals.importedTeam = resultArray;
    res.locals.pokemonNameArray = pokemonNameArray;
    return next();
  } catch (error) {
    console.error('Error in importTeam middleware:', error);
    return res.status(500).json({ error: 'Failed to import team' });
  }
};



convertTeamFormatMiddlewares.exportMon = (req, res, next) => {
  const reduxPokemonObject = req.body.mon;
  const movesArray = [];
  for (let moveKey in reduxPokemonObject.moves) {
    const moveName = reduxPokemonObject.moves[moveKey].name;
    if (moveName) movesArray.push(capitalizeWords(moveName))
    else movesArray.push('')
  }

  let standardFormatMon = {
    name: "",
    species: capitalizeWords(reduxPokemonObject.pokemon),
    gender: "",
    item: reduxPokemonObject.item.item ? capitalizeWords(reduxPokemonObject.item.item) : "",
    ability: reduxPokemonObject.activeAbility.name ? capitalizeWords(reduxPokemonObject.activeAbility.name) : "",
    evs: reduxPokemonObject.evs.obj,
    nature: reduxPokemonObject.nature ? capitalizeWords(reduxPokemonObject.nature) : "",
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
  console.log('capitalize', str)
  return str.replace(/\b\w/g, function(match) {
    return match.toUpperCase();
  }).replace(/-/g, ' ');
}

module.exports= convertTeamFormatMiddlewares;