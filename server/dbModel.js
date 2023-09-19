const { Pool } = require('pg');

const myURI = process.env.PG_URI;

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: myURI
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query: ', text);
    return pool.query(text, params, callback);
  }
};