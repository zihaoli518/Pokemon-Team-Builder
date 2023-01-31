const fetch = require('node-fetch');
const parse = require('node-html-parser');

const fetchMiddlewares = {}; 

fetchMiddlewares.fetchPokeAPI = (req, res, next) => {
  console.log('inside fetchPokeAPI');

  const pokemonName = req.body.pokemon
  fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonName.toLowerCase())
    .then(data => data.json())
    .then(data => {
      res.locals.data = data;
      return next();
    })
    .catch(error => {
      return next(error);
    })
}

fetchMiddlewares.fetchSmogon = (req, res, next) => {
  console.log('inside fetchSmogon');

  const pokemonName = req.body.pokemon
  fetch('https://www.porydex.com/stats/2022-09/gen-8-ou/1695/pokemon/' + pokemonName.toLowerCase())
    .then(res => res.text())
    // .then(text => console.log(text))
    // .then(data => data.json())
    .then(data => {
      // empty object to store all needed parsed data
      const resultObject = {};
      // console.log(typeof(data), data)
      const root = parse.parse(data)
      // console.log(typeof(root), root)
      const abilitiesTable = (root.querySelector('#abilities'));
      const abilitiesObj = abilitiesTable.childNodes[1]

      resultObject['moveSet'] = {
        abilitiesTable.childNodes 
      }
      res.locals.data = resultObject;
      return next();
    })
    .catch(error => {
      return next(error);
    })
}

module.exports= fetchMiddlewares;