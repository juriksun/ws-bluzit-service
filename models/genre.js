'use strict';
const mongoose = require('mongoose'),
    schema = mongoose.Schema;

let genre = new schema(
    {
        name: {String},
        albums: [Number]
    },
    {strict: true}
);

module.exports = mongoose.model(`Genres`, genre); //Creating a model Object and Connect to Schema