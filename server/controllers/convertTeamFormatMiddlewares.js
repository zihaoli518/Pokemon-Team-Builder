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

  const pokemonObjArray = Teams.import(exportFormatMon);
  // fetch('')
  req.body.pokemon = pokemonObjArray[0].species.toLowerCase();

  res.locals.importedMon = pokemonObjArray[0];
  return next();
}



module.exports= convertTeamFormatMiddlewares;