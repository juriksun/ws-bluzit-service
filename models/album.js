'use strict';
const   mongoose = require(`mongoose`),
        schema = mongoose.Schema;

let Song = new schema({
            song_name:String,
            song_url:String
});

let albumsSchema = new schema({
        album_name: {String},
        year: {String},
        artist: {String},
        album_picture: {String},
        album_genre: {String},
        album_id: {Number},
        album_songs: [Song]
        },{collection:'albums'}
);

//module.exports = albumsSchema;
module.exports = mongoose.model(`Album`, albumsSchema); //Creating a model Object and Connect to Schema