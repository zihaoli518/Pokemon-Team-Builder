const fetch = require('node-fetch');

const fetchMiddlewares = {}; 

fetchMiddlewares.fetchSmogon = (req, res, next) => {
  const pokemonName = req.body.pokemon
  fetch('https://smogon-usage-stats.herokuapp.com/gen8ou/' + pokemonName)
}

module.exports()