const fs = require('fs');
const path = require('path');

// Read the JSON file
const filePath = path.join(__dirname, '../mons-data.json');
const jsonData = fs.readFileSync(filePath, 'utf-8');

// Parse the JSON data
const pokemonArray = JSON.parse(jsonData);

// Transform the array into an object
const allPokemonData = pokemonArray.reduce((acc, [name, data]) => {
  acc[name] = data;
  return acc;
}, {});

// Export the object
module.exports = { allPokemonData };

// Optionally, you can write the transformed data to a new JSON file
const outputFilePath = path.join(__dirname, 'allPokemonData.json');
fs.writeFileSync(outputFilePath, JSON.stringify(allPokemonData, null, 2));

console.log('All Pokémon data has been transformed and saved.');

