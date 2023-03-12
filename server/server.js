const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000; 

const fetchMiddlewares = require('./controllers/fetchMiddlewares.js')
const userMiddlewares = require('./controllers/userMiddlewares.js')

app.use(express.json());

console.log('inside server.js')

// taking care of CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/static', 
express.static(path.join(__dirname, '../assets')));

// serve index.html on the route '/'
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../index.html'));
});

// // statically serve everything in the build folder on the route '/build'
// serve static content 

app.post('/api/fetchPokeAPI', fetchMiddlewares.fetchPokeAPI, (req, res) => {
  console.log('/fetch-pokeAPI complete')
  return res.status(200).send(res.locals.data)
})

app.post('/api/testForNewerSprites', fetchMiddlewares.testForNewerSprites, (req, res) => {
  console.log('/testForNewerSprites complete')
  return res.status(200).send({url: res.locals.url})
})

// app.post('/api/fetch-smogon', fetchMiddlewares.fetchSmogon, (req, res) => {
//   console.log('/fetch-smogon complete')
//   return res.status(200).send(res.locals.data)
// })

app.listen(PORT); 

