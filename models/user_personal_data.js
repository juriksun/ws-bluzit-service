'use strict';
const mongoose = require('mongoose'),
    schema = mongoose.Schema;

let userPersonalDataSchema = new schema(
    {
        username: {type:String, required:true, unique:true},
        first_name: {type:String, required:true},
        last_name: {type:String, required:true},
        email: {type:String, required:true, unique:true},
        picture: {type:String, default:'https://ssss.html'},
        dob: String,
    },
    {collection: 'user_personal_data'}
);

module.exports = mongoose.model(`userPersonalData`, userPersonalDataSchema); //Creating a model Object and Connect to Schema