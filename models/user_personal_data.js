'use strict';
const mongoose = require('mongoose'),
    schema = mongoose.Schema;

let userPersonalDataSchema = new schema(
    {
        username: {type:String, required:true, unique:true},
        first_name: {type:String, required:true},
        last_name: {type:String, required:true},
        email: {type:String, required:true, unique:true},
        profile_mini: {type:String, default:'https://ws-final-ftp.000webhostapp.com/users/default_user/mini.jpg'},
        profile_small: {type:String, default:'https://ws-final-ftp.000webhostapp.com/users/default_user/small.jpg'},
        dob: String,
    },
    {collection: 'user_personal_data'}
);

module.exports = mongoose.model(`userPersonalData`, userPersonalDataSchema); //Creating a model Object and Connect to Schema