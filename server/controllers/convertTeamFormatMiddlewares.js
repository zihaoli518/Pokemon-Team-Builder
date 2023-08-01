const fetch = require('node-fetch');
const parse = require('node-html-parser');
const {Teams} = require('pokemon-showdown');


const convertTeamFormatMiddlewares = {}; 

// hnadles converting export format to JSON format
convertTeamFormatMiddlewares.importMon = (req, res, next) => {
  const exportFormatMon = req.body.team
  console.log('inside importMon middleware ', exportFormatMon);

  const testJSON =   [{
    "name": "",
    "species": "Armaldo",
    "gender": "",
    "item": "Leftovers",
    "ability": "Swift Swim",
    "evs": {"hp": 128, "atk": 252, "def": 4, "spa": 0, "spd": 0, "spe": 124},
    "nature": "Adamant",
    "moves": ["X-Scissor", "Stone Edge", "Aqua Tail", "Rapid Spin"]
   }]
  // console.log(Teams.export(testJSON))
  console.log(Teams.import(exportFormatMon));

  const pokemonObj = Teams.import(exportFormatMon)[0];
  pokemonObj.item = pokemonObj.item.toLowerCase().replace(' ','-');
  pokemonObj.moves = pokemonObj.moves.map(move => move.toLowerCase());

  // fetch('')
  req.body.pokemon = pokemonObj.species.toLowerCase();

  res.locals.importedMon = pokemonObj;
  return next();
}



module.exports= convertTeamFormatMiddlewares;