'use strict';
const 	mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		Genre = require('../models/genre'),
		Album = require('../models/album'),
		User = require('../models/user'),
		UserPreferences = require('../models/user_preferences');

exports.myTest = function (req, res){
    res.json({"test": "test"});
};

exports.getAllGenres = (req, res) => {
    Genre.find({},'-_id',
        (err, docs) => {
            if(err) console.log(`query error: ${err}`);
            res.status(200).json(docs);
            return;
        }
    );
};

exports.getAlbum = (req, res) => {
    Album.findOne({album_id: parseInt(req.params.album_id)},'-_id',
        (err, docs) => {
            if(err) console.log(`query error: ${err}`);
            console.log(docs);
            res.status(200).json(docs);
            return;
        }
    );
};

exports.getUserData = (req, res) =>{
    User.find({user_id: parseInt(req.params.user_id)},'-_id',
        (err, docs) =>{
            if(err) console.log(`query error: ${err}`);
            res.status(200).json(docs);
            return;
        });
};

exports.getAllAlbums = (req, res) => {
    Album.find({}, '-_id',
        (err, docs) => {
            if(err) console.log(`query error: ${err}`);
            res.status(200).json(docs);
            return;
        }
    );
};

exports.getUserAlbums = (req, res) =>{
    UserPreferences.findOne({user_id: parseInt(req.params.user_id)},
        (err, userPref) => {
            if(err) console.log(`query error: ${err}`);

            Album.find({album_id: { $in : userPref.albums_id}}, (err, albums) => {
                if(err) console.log(`query error: ${err}`);
                res.status(200).json(albums);
                return;
            });
        }
    );
};

exports.getUserAlbumsByGenres = (req, res) =>{
    UserPreferences.findOne({user_id: parseInt(req.params.user_id)}, (err, userPref) => {
        if(err) console.log(`query error: ${err}`);

        Genre.find({name: { $in : userPref.genres}}, (err, genres) => {
            if(err) console.log(`query error: ${err}`);

            let albumsId = [];

            for(let i=0; i< genres.length; i++){
                for(let k=0; k<genres[i].albums.length;k++){
                    albumsId.push(genres[i].albums[k]);
                }
            }
            Album.find({album_id: { $in : albumsId}}, (err, albums) => {
                if(err) console.log(`query error: ${err}`);
                    res.status(200).json(albums);
                return;
            });
        });
    });
};

exports.setUserAlbum = (req, res) =>{
    let conditions ={user_id: parseInt(req.params.user_id)},
        update = {$addToSet:{albums_id: {$each: [parseInt(req.params.album_id)]}}},
        opts ={new: true, upsert: true};

    UserPreferences.update(conditions, update, opts,
        (err) => {
            if(err) {
                console.log(`query error: ${err}`);
                res.status(200).json({"status": "false"});
            }
            else {
                console.log(`Updated document: ${UserPreferences}`);
                res.status(200).json({"status": "true"});
            }
            return;
        }
    );
};

exports.delUserAlbum = (req, res) =>{
    let conditions ={user_id: parseInt(req.params.user_id)},
        update = {$pullAll:{albums_id: [parseInt(req.params.album_id)]}},
        opts ={upsert: true};

    UserPreferences.update(conditions, update, opts,
        (err) => {
            if(err) {
                console.log(`query error: ${err}`);
                res.status(200).json({"status": "false"});
            }
            else {
                console.log(`Updated document: ${UserPreferences}`);
                res.status(200).json({"status": "true"});
            }
            return;
        }
    );
};

exports.setUserGenres = (req, res) =>{
    let user_id = parseInt(req.body.user_id);
    let allParams =[];
    for( let i in req.body ) {
        if (req.body.hasOwnProperty(i) && i !== 'user_id'){
            let idOfParam = i.split('genre_')[1];
            if(!isNaN(parseInt(idOfParam)))
                allParams.push(req.body[i]);
        }
    }
    for(let i = 0; i < allParams.length; i++){
        console.log(allParams[i]);
    }
    if(allParams.length == 0 || user_id === undefined || isNaN(user_id)){
        res.status(200).json({"status":"false"});
    }

    let conditions ={user_id: user_id},
        update = {$addToSet:{genres: {$each: allParams}}},
        opts ={ new: true, upsert: true};
    UserPreferences.update(conditions, update, opts,
        (err) => {
            if(err) {
                console.log(`query error: ${err}`);
                res.status(200).json({"status": "false"});
            }
            else {
                console.log(`Updated document: ${UserPreferences}`);
                res.status(200).json({"status": "true"});
            }
            return;
        }
    );
};