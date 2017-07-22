'use strict';
const mongoose = require('mongoose'),
    schema = mongoose.Schema;

let userVerificationSchema = new schema(
    {
        username: {type:String, required:true, unique:true},
        password: {type:String, required:true}
    },
    {collection: 'user_verification'}
);

module.exports = mongoose.model(`userVerificationSchema`, userVerificationSchema); //Creating a model Object and Connect to Schema