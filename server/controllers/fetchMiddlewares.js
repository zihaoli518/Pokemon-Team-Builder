const fetch = require('node-fetch');

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
    .then(data => data.json())
    .then(data => {
      res.locals.data = data;
      return next();
    })
    .catch(error => {
      return next(error);
    })
}

module.exports= fetchMiddlewares;