'use strict';
const mongoose = require('mongoose'),
    Genre = require('../models/genre'),
    Album = require('../models/album'),
    UserPreferences = require('../models/user_preferences'),
    UserPersonalData = require('../models/user_personal_data'),
    userVerification = require('../models/user_verification');

let TrueMassage = () => {
    return {
        status: "true",
        message: ""
    }
};

let FalseMassage = () =>{
    return {
        status: "false",
        message: "",
        error: []
    }
};

//Get info function
exports.info = function (req, res) {
    res.status(200).json(
        {
            "name": "bluzit music service",
            "version": "2.1",
            "authors":"Shamir Krizler and Alexander Djura",
            "description": "",
        });
};

//Get user genres function
exports.getUserGenres = (req, res) => {

    let resTrue = TrueMassage();//prepare message for success
    let resFalse = FalseMassage();//prepare message for unsuccess

    resTrue.message = 'Getting user genres.';
    resFalse.message = 'Problem with getting user genres.';

    UserPreferences.findOne({username: req.params.username}, (err, userPref) => {
        if (err || userPref == null){
            if(err){
                console.log(`query error: ${err}`);
                resFalse.error.push({name: "db", message: `query error: ${err}`});
            }
            if(userPref == null){
                resFalse.error.push(
                    {
                        name: "account",
                        message: `User '${req.params.username}' does not exist`
                    }
                );
            }
            res.status(200).json(resFalse);
            console.log(`query error: ${err}`);
        } else {
            resTrue.username = userPref.username;
            resTrue.genres = userPref.genres;
            res.status(200).json(resTrue);
        }
        return;
    });
};

//Get user personal data function
exports.getUserPersonalData = (req, res) => {
    let resTrue = TrueMassage();//prepare message for success
    let resFalse = FalseMassage();//prepare message for unsuccess

    resTrue.message = 'Getting user personal data.';
    resFalse.message = 'Problem with getting user personal data.';

    UserPersonalData.findOne({username: req.params.username},{_id:0,__v:0 },
        (err, userPersonalData) => {
            if (err || userPersonalData == null){
                if(err){
                    console.log(`query error: ${err}`);
                    resFalse.error.push({name: "db", message: `query error: ${err}`});
                } else if(userPersonalData == null){
                    resFalse.error.push(
                        {
                            name: "account",
                            message: `User '${req.params.username}' does not exist`
                        }
                    );
                }
                res.status(200).json(resFalse);
                console.log(`query error: ${err}`);
            } else {
                resTrue.user = userPersonalData;
                res.status(200).json(resTrue);
            }
            return;
        }
    );
};

//Get all genres function.
exports.getAllGenres = (req, res) => {

    let resTrue = TrueMassage();//prepare message for success
    let resFalse = FalseMassage();//prepare message for unsuccess

    resTrue.message = 'Getting all genres.';
    resFalse.message = 'Problem with getting all genres.';

    Genre.find({}, {_id:0,__v:0 },
        (err, genres) => {
            if (err){
                console.log(`query error: ${err}`);
                resFalse.error.push({name: "db", message: `query error: ${err}`});
                res.status(200).json(resFalse);
            }else {
                resTrue.genres = genres;
                res.status(200).json(resTrue);
            }
            return;
        }
    );
};

//Get album by id function
exports.getAlbum = (req, res) => {

    let resTrue = TrueMassage();//prepare message for success
    let resFalse = FalseMassage();//prepare message for unsuccess

    resTrue.message = 'Getting album.';
    resFalse.message = 'Problem with getting album.';

    Album.findOne({album_id: parseInt(req.params.album_id)}, {_id:0, __v:0},
        (err, album) => {
            if (err || album == null) {
                if(err){
                    console.log(`query error: ${err}`);
                    resFalse.error.push({name: "db", message: `query error: ${err}`});
                } else if(album == null){
                    resFalse.error.push(
                        {
                            name: "album",
                            message: `Album '${req.params.album_id}' does not exist`
                        }
                    );
                }
                res.status(200).json(resFalse);
            } else {
                resTrue.album = album;
                res.status(200).json(resTrue);
            }
            return;
        }
    );
};

//Get all albums function
exports.getAllAlbums = (req, res) => {
    let resTrue = TrueMassage();//prepare message for success
    let resFalse = FalseMassage();//prepare message for unsuccess

    resTrue.message = 'Getting all albums.';
    resFalse.message = 'Problem with getting all albums.';

    //find all genres in data base
    Album.find({}, {_id:0, __v:0 },
        (err, albums) => {
            if (err){//check if errors exist.
                console.log(`query error: ${err}`);
                //if errors exist prepare message.
                resFalse.error.push({name: "db", message: `query error: ${err}`});
                //sending error json
                res.status(200).json(resFalse);
            }else {
                //prepare message to return
                resTrue.albums = albums;
                //send response json
                res.status(200).json(resTrue);
            }
            return;
        }
    );
};

//Get user albums function
exports.getUserAlbums = (req, res) => {
    let resTrue = TrueMassage();//prepare message for success
    let resFalse = FalseMassage();//prepare message for unsuccess

    resTrue.message = 'Getting user personal data.';
    resFalse.message = 'Problem with getting user personal data.';

    UserPreferences.findOne({username: req.params.username},{_id:0,__v:0 },
        (err, userPreferences) => {
            if (err || userPreferences == null){
                if(err){
                    console.log(`query error: ${err}`);
                    resFalse.error.push({name: "db", message: `query error: ${err}`});
                } else if(userPreferences == null){
                    resFalse.error.push(
                        {
                            name: "account",
                            message: `User '${req.params.username}' does not exist`
                        }
                    );
                }
                res.status(200).json(resFalse);
                console.log(`query error: ${err}`);
            } else {
                Album.find({album_id: {$in: userPreferences.albums_id}}, (err, albums) => {
                    if(err){
                        console.log(`query error: ${err}`);
                        resFalse.error.push({name: "db", message: `query error: ${err}`});
                    } else {
                        resTrue.username = userPreferences.username;
                        resTrue.albums = albums;
                        res.status(200).json(resTrue);
                    }
                    return;
                });
            }
            return;
        }
    );
};

//Get user albums by genres function
exports.getUserAlbumsByGenres = (req, res) => {

    let resTrue = TrueMassage();//prepare message for success
    let resFalse = FalseMassage();//prepare message for unsuccess

    resTrue.message = 'Getting user albums by genres.';
    resFalse.message = 'Problem with getting user albums by genres.';

    UserPreferences.findOne({username: req.params.username}, (err, userPref) => {
        if (err || userPref == null){
            if(err){
                console.log(`query error: ${err}`);
                resFalse.error.push({name: "db", message: `query error: ${err}`});
            }
            if(userPref == null){
                resFalse.error.push(
                    {
                        name: "account",
                        message: `User '${req.params.username}' does not exist`
                    }
                );
            }
            res.status(200).json(resFalse);
            console.log(`query error: ${err}`);
            return;
        } else {
            Genre.find({name: {$in: userPref.genres}}, (err, genres) => {
                if (err){
                    console.log(`query error: ${err}`);
                    resFalse.error.push({name: "db", message: `query error: ${err}`});
                    res.status(200).json(resFalse);
                    return;
                }
                else {
                    let albumsId = [];

                    for (let i = 0; i < genres.length; i++) {
                        for (let k = 0; k < genres[i].albums.length; k++) {
                            albumsId.push(genres[i].albums[k]);
                        }
                    }
                    Album.find({album_id: {$in: albumsId}},{_id:0,__v:0 }, (err, albums) => {
                        if (err){
                            console.log(`query error: ${err}`);
                            resFalse.error.push({name: "db", message: `query error: ${err}`});
                            res.status(200).json(resFalse);
                        }
                        else {
                            resTrue.username = userPref.username;
                            resTrue.album = albums;
                            res.status(200).json(resTrue);
                        }
                        return;
                    });
                }
            });
        }
    });
};

//Set user album function.
exports.setUserAlbum = (req, res) => {

    const bodyParams = req.body;
    const  username = bodyParams.username,
        password = bodyParams.password;
    let album_id = bodyParams.album_id;

    let resTrue = TrueMassage();//prepare message for success
    let resFalse = FalseMassage();//prepare message for unsuccess
    resFalse.message = "The album does not added.";


    if(//check if all params passed and they not empty
    username != undefined && password != undefined && album_id!= undefined
    &&
    username != "" && password != "" && album_id!= ""
    ){
        //check property length of params
        if(isNaN(album_id = parseInt(album_id))){
            resFalse.error.push(
                {
                    name: "parameters",
                    message: "The album id must by number."
                }
            );
            res.status(200).json(
                resFalse
            );
            return;
        }
    }else{//build the error message
        let message = "Undefined or empty parameters: ";
        if(username == undefined || username == ""){ message += "user_name, ";}
        if(password == undefined || password == ""){ message += "password, ";}
        if(album_id == undefined || album_id == ""){message += "album_id, ";}
        message +=")";
        message = message.split(', )')[0] + ".";

        resFalse.error.push(
            {
                name: "parameters",
                message: message
            }
        );
        //send error massage
        res.status(200).json(
            resFalse
        );
        return;
    }
    resTrue.message = `The album '${album_id}' was added to '${username}'.`;

    //checking if user exist.
    userVerification.findOne({username: username, password: password},
        (err1, user) => {
            //checking if genres names exist
            Album.findOne({album_id}, (err2, album) => {
                if (err1 || err2 || user == null || album == null) {
                    if (err1) {
                        resFalse.error.push(
                            {
                                name: "db",
                                message: `Query error: ${err1}.`
                            }
                        );

                        console.log(`query error: ${err1}`);
                    }
                    if (err2) {
                        resFalse.error.push({name: "db", message: `Query error: ${err2}.`}
                        );
                        console.log(`query error: ${err2}`);
                    }
                    if (user == null)
                        resFalse.error.push(
                            {
                                name: "account",
                                message: `The user '${username}' or password '${password}' wrong.`
                            }
                        );
                    res.status(200).json(
                        resFalse
                    );
                    return;
                } else {
                    let conditions = {username: username},
                        update = {$addToSet: {albums_id: {$each: [album_id]}}},
                        opts = {new: true, upsert: true};

                    UserPreferences.update(conditions, update, opts, (err3) => {
                            if (err3) {
                                console.log(`query error: ${err3}`);
                                resFalse.error.push({name: "db", message: `Query error: ${err3}.`});
                                res.status(200).json(
                                    resFalse
                                );
                                return;
                            }
                            else {
                                console.log('Database adding.');
                                res.status(200).json(
                                    resTrue
                                );
                            }
                            return;
                        }
                    );
                }
            });
        }
    );
};

//Delete user album function
exports.delUserAlbum = (req, res) => {
    const bodyParams = req.body;
    const  username = bodyParams.username,
        password = bodyParams.password;
    let album_id = bodyParams.album_id;

    let resTrue = TrueMassage();//prepare message for success
    let resFalse = FalseMassage();//prepare message for unsuccess
    resFalse.message = "The album does not added.";


    if(//check if all params passed and they not empty
    username != undefined && password != undefined && album_id!= undefined
    &&
    username != "" && password != "" && album_id!= ""
    ){
        //check property length of params
        if(isNaN(album_id = parseInt(album_id))){
            resFalse.error.push(
                {
                    name: "parameters",
                    message: "The album id must by number."
                }
            );
            res.status(200).json(
                resFalse
            );
            return;
        }
    }else{//build the error message
        let message = "Undefined or empty parameters: ";
        if(username == undefined || username == ""){ message += "user_name, ";}
        if(password == undefined || password == ""){ message += "password, ";}
        if(album_id == undefined || album_id == ""){message += "album_id, ";}
        message +=")";
        message = message.split(', )')[0] + ".";

        resFalse.error.push(
            {
                name: "parameters",
                message: message
            }
        );
        //send error massage
        res.status(200).json(
            resFalse
        );
        return;
    }
    resTrue.message = `The album '${album_id}' was deleted from '${username}'.`;

    //checking if user exist.
    userVerification.findOne({username: username, password: password},
        (err1, user) => {
            //checking if genres names exist
            Album.findOne({album_id}, (err2, album) => {
                if (err1 || err2 || user == null || album == null) {
                    if (err1) {
                        resFalse.error.push(
                            {
                                name: "db",
                                message: `Query error: ${err1}.`
                            }
                        );

                        console.log(`query error: ${err1}`);
                    }
                    if (err2) {
                        resFalse.error.push({name: "db", message: `Query error: ${err2}.`}
                        );
                        console.log(`query error: ${err2}`);
                    }
                    if (user == null)
                        resFalse.error.push(
                            {
                                name: "account",
                                message: `The user '${username}' or password '${password}' wrong.`
                            }
                        );
                    res.status(200).json(
                        resFalse
                    );
                    return;
                } else {
                    let conditions = {username: username},
                        update = {$pullAll: {albums_id: [album_id]}},
                        opts = {upsert: true};

                    UserPreferences.update(conditions, update, opts, (err3) => {
                            if (err3) {
                                console.log(`query error: ${err3}`);
                                resFalse.error.push({name: "db", message: `Query error: ${err3}.`});
                                res.status(200).json(
                                    resFalse
                                );
                                return;
                            }
                            else {
                                console.log('Database adding.');
                                res.status(200).json(
                                    resTrue
                                );
                            }
                            return;
                        }
                    );
                }
            });
        }
    );
};

//Adding new genres function. Before adding, function validate: all parameters, if user exist & if genre exist
exports.setUserGenres = (req, res) => {
    const bodyParams = req.body;
    const  username = bodyParams.username,
        password = bodyParams.password;

    let resTrue = TrueMassage();//prepare message for success
    let resFalse = FalseMassage();//prepare message for failure
    resFalse.message = "The genres does not added.";

    let genresToAdd = [];//array for genres to add

    for (let i in bodyParams) {//parsing and validate genres params
        if (i !== 'username' && i !== 'password') {

            let splitedParam = i.split('_');
            let nameOfParam = splitedParam[0];
            let idOfParam = parseInt(splitedParam[1]);

            if (isNaN(idOfParam) || nameOfParam != 'genre' || genresToAdd.length + 1 != idOfParam) {
                genresToAdd = [];
                break;
            } else {
                genresToAdd.push(bodyParams[i]);
            }
        }
    }
    //check if genres params pass validation and user id is number
    if (
        genresToAdd.length == 0 || username == undefined || username == ""
        || password == undefined || password == ""
    ) {
        //prepare error json
        resFalse.error.push(
            {
                name: "parameters",
                message: "You mast Pass: username=(string), password(string), " +
                    "genre_1=(string),genre_2=(string),...,genre_n=(string)"
            }
        );
        //send error json
        res.status(200).json(
            resFalse
        );
        return;
    }
    //checking if user exist.
    userVerification.findOne({username: username, password: password}, (err1, docs) => {
            //checking if genres names exist
            Genre.find({name: {$in: genresToAdd}}, (err2, genres) => {
                //check if some errors exist and if all genres name exists in database
                if (err1 || err2 || docs == null || genres == null || genres.length != genresToAdd.length) {
                    if (err1) {
                        //prepare error message
                        resFalse.error.push(
                            {
                                name: "db",
                                message: `Query error: ${err1}.`
                            }
                        );
                        console.log(`query error: ${err1}`);
                    }
                    if (err2) {
                        //prepare error message
                        resFalse.error.push({name: "db", message: `Query error: ${err2}.`}
                        );
                        console.log(`query error: ${err2}`);
                    }
                    if (docs == null)
                        resFalse.error.push(//prepare error message
                            {
                                name: "account",
                                message: `The user '${username}' or password '${password}' wrong.`
                            }
                        );
                    if (genres.length != genresToAdd.length)
                        resFalse.error.push(//prepare error message
                            {
                                name: "parameters",
                                message: "wrong name of genres"
                            }
                        );
                    //send error json
                    res.status(200).json(
                        resFalse
                    );
                    return;
                } else {
                    let conditions = {username: username},
                        update = {$addToSet: {genres: {$each: genresToAdd}}},
                        opts = {new: true, upsert: true};
                    UserPreferences.update(conditions, update, opts, (err3) => {
                            if (err3) {
                                console.log(`query error: ${err3}`);
                                resFalse.error.push({name: "db", message: `Query error: ${err3}.`});
                                res.status(200).json(
                                    resFalse
                                );
                                return;
                            }
                            else {
                                resTrue.message = 'Genres(';
                                for (let i of genresToAdd) {
                                    resTrue.message += `${i}, `;
                                }
                                resTrue.message += ")";
                                resTrue.message = resTrue.message.split(', )')[0] + `) was added to '${username}'`;

                                console.log('Database adding.');
                                res.status(200).json(
                                    resTrue
                                );
                            }
                            return;
                        }
                    );
                }
            });
        }
    );
};

//Adding new user function. Before adding function validate: all parameters and if user name free
exports.setNewUser = (req,res) => {

    const bodyParams = req.body;
    const  username = bodyParams.username,
        password = bodyParams.password,
        firstName = bodyParams.first_name,
        secondName = bodyParams.second_name,
        email = bodyParams.email,
        dob = bodyParams.dob;

    let resTrue = TrueMassage();//prepare message for success
    let resFalse = FalseMassage();//prepare message for unsuccess

    resFalse.message = "The user does not added.";

    if(//check if all params passed and they not empty
        username != undefined && password != undefined && firstName != undefined
        && secondName != undefined && email != undefined && dob!= undefined
        &&
        username != "" && password != "" && firstName != ""
        && secondName != "" && email != "" && dob!= ""
    ){
        //check property length of params
        if(password.length < 8 || password.length > 20){
            resFalse.error.push(
                {
                    name: "parameters",
                    message: "The length of password mast be between 8 and 20"
                }
            );
            res.status(200).json(
                resFalse
            );
            return;
        }
    }else{//build the error message

        let message = "Undefined or empty parameters: ";
        if(username == undefined || username == ""){ message += "user_name, ";}
        if(password == undefined || password == ""){ message += "password, ";}
        if(firstName == undefined || firstName == ""){ message += "first_name, ";}
        if(secondName == undefined || secondName == ""){ message += "second_name, ";}
        if(email == undefined || email == ""){message += "email, ";}
        if(bod == undefined || dob == ""){message += "dob, ";}
        message +=")";
        message = message.split(', )')[0] + ".";

        resFalse.error.push(
            {
                name: "parameters",
                message: message
            }
        );
        //send error massage
        res.status(200).json(
            resFalse
        );
        return;
    }
    resTrue.message = `The user ${username} was added.`;

    //checking if user exist.
    UserPersonalData.findOne({$or:[{username: username},{ email:email}]},
        (err1, docs) => {
            if (err1 || docs != null) {
                if (err1) {
                    resFalse.error.push({name: "db", message: `query error: ${err1}`});
                }
                if(docs != null){
                    resFalse.error.push(
                        {
                            name: "duplicate",
                            message: `The user '${username}' or email '${email}' exist.`
                        }
                    );
                }
                res.status(200).json(
                    resFalse
                );
                return;
            } else {
                //create new verification user
                let newUserVerification = new userVerification({
                    username: username,
                    password: password
                });
                //save new verification user
                newUserVerification.save((err2) => {
                    if (err2) {
                        resFalse.error.push({name: "db", message: `query error: ${err2}`});
                        res.status(200).json(
                            resFalse
                        );
                        return;
                    }
                    else {
                        //create new user personal data
                        let newUserPersonalData = new UserPersonalData({
                            username: username,
                            first_name: firstName,
                            second_name: secondName,
                            email: email,
                            dob: dob
                        });
                        //save new user personal data
                        newUserPersonalData.save((err3) => {
                            if (err3) {
                                resFalse.error.push({name: "db", message: `query error: ${err3}`});
                                res.status(200).json(
                                    resFalse
                                );
                                return;
                            }
                            else {
                                let newUserPreferences = new UserPreferences({
                                    username: username,
                                    albums_id:[],
                                    genres:[]
                                });
                                //save new user personal data
                                newUserPreferences.save((err4) => {
                                    if (err4) {
                                        resFalse.error.push({name: "db", message: `query error: ${err4}`});
                                        res.status(200).json(
                                            resFalse
                                        );
                                        return;
                                    }
                                    else {
                                        res.status(200).json(
                                            resTrue
                                        );
                                        return;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    );
};

//Adding new genres function. Before adding, function validate: all parameters, if user exist & if genre exist
exports.resetUserGenres = (req, res) => {
    const bodyParams = req.body;
    const  username = bodyParams.username,
        password = bodyParams.password;

    let resTrue = TrueMassage();//prepare message for success
    let resFalse = FalseMassage();//prepare message for failure
    resFalse.message = "The genres does not reset.";

    let genresToAdd = [];

    for (let i in bodyParams) {//parsing and validate genres params
        if (i !== 'username' && i !== 'password') {

            let splitedParam = i.split('_');
            let nameOfParam = splitedParam[0];
            let idOfParam = parseInt(splitedParam[1]);

            if (isNaN(idOfParam) || nameOfParam != 'genre' || genresToAdd.length + 1 != idOfParam) {
                genresToAdd = [];
                break;
            } else {
                genresToAdd.push(bodyParams[i]);
            }
        }
    }
    //check if genres params pass validation and user id is number
    if (
        genresToAdd.length == 0 || username == undefined || username == ""
        || password == undefined || password == ""
    ) {
        resFalse.error.push(
            {
                name: "parameters",
                message: "You mast Pass: username=(string), password(string), " +
                "genre_1=(string),genre_2=(string),...,genre_n=(string)"
            }
        );
        res.status(200).json(
            resFalse
        );
        return;
    }

    //checking if user exist.
    userVerification.findOne({username: username, password: password}, (err1, docs) => {
            //checking if genres names exist
            Genre.find({name: {$in: genresToAdd}}, (err2, genres) => {

                if (err1 || err2 || docs == null || genres == null || genres.length != genresToAdd.length) {
                    if (err1) {
                        resFalse.error.push(
                            {
                                name: "db",
                                message: `Query error: ${err1}.`
                            }
                        );

                        console.log(`query error: ${err1}`);
                    }
                    if (err2) {
                        resFalse.error.push({name: "db", message: `Query error: ${err2}.`}
                        );
                        console.log(`query error: ${err2}`);
                    }
                    if (docs == null)
                        resFalse.error.push(
                            {
                                name: "account",
                                message: `The user '${username}' or password '${password}' wrong.`
                            }
                        );
                    if (genres.length != genresToAdd.length)
                        resFalse.error.push(
                            {
                                name: "parameters",
                                message: "wrong name of genres"
                            }
                        );
                    res.status(200).json(
                        resFalse
                    );
                    return;
                } else {
                    let conditions = {username: username},
                        update = {$set: {genres: genresToAdd}},
                        opts = {new: true, upsert: true};
                    UserPreferences.update(conditions, update, opts, (err3) => {
                            if (err3) {
                                console.log(`query error: ${err3}`);
                                resFalse.error.push({name: "db", message: `Query error: ${err3}.`});
                                res.status(200).json(
                                    resFalse
                                );
                                return;
                            }
                            else {
                                resTrue.message = 'Genres(';
                                for (let i of genresToAdd) {
                                    resTrue.message += `${i}, `;
                                }
                                resTrue.message += ")";
                                resTrue.message = resTrue.message.split(', )')[0] + `) was reset to '${username}'`;

                                console.log('Database adding.');
                                res.status(200).json(
                                    resTrue
                                );
                            }
                            return;
                        }
                    );
                }
            });
        }
    );
};