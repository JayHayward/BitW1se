var pgp = require('pg-promise')();

const dbConfig = {
   host: 'localhost',
   port: 5432,
   database: 'd45m33mk9qqb46',
   user: 'fblkanhqkhzzie',
   password: '7ee94c260f32621a29bca1764a90cec3403041b56059afae5d3c8a4d88ef8742'
};

var db = pgp(dbConfig);

module.exports = db;