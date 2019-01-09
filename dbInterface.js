var express = require('express');
var db = require('./database');
var app = express();
module.exports = app;

app.get('/', function (request, response) {

    // TODO: Initialize the query variable with a SQL query
    // that returns all the rows in the ‘store’ table
    var query = 'select * from entries';

    db.any(query)
        .then(function (rows) {
            // render views/store/list.ejs template file
            console.log(rows);
        })
        .catch(function (err) {
            console.log(err);
        })
});