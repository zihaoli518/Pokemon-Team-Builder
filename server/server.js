const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000; 

const fetchMiddlewares = require('./controllers/fetchMiddlewares.js')

app.use(express.json());
// // statically serve everything in the build folder on the route '/build'
// app.use('/build', 
// poing, 
// express.static(path.join(__dirname, '../build')));

console.log('inside server.js')

// taking care of CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// serve index.html on the route '/'
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../index.html'));
});

app.post('/api/fetchPokeAPI', fetchMiddlewares.fetchPokeAPI, (req, res) => {
  console.log('/fetch-pokeAPI complete')
  return res.status(200).send(res.locals.data)
})

// app.post('/api/fetch-smogon', fetchMiddlewares.fetchSmogon, (req, res) => {
//   console.log('/fetch-smogon complete')
//   return res.status(200).send(res.locals.data)
// })

app.listen(PORT); 

