'use strict';
const mongoose = require('mongoose'),
    schema = mongoose.Schema;

let userPreferences = new schema(
    {
        username: {type:String,required:true},
        albums_id: [{type:Number}],
        genres:[String]
    },
    {collection: 'users_preferences'}
);

module.exports = mongoose.model('user_references', userPreferences); //Creating a model Object and Connect to Schema
