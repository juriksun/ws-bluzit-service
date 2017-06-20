'use strict';
const mongoose = require('mongoose'),
    schema = mongoose.Schema;

let userSchema = new schema(
    {
        name: String,
        email: String,
        password: String,
        date_of_birth: String,
        picture: String,
        user_id: Number
    },
    {collection: 'users'}
);

module.exports = mongoose.model(`User`, userSchema); //Creating a model Object and Connect to Schema
