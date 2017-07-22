'use strict';
const   mongoose = require('mongoose'),
        Genre = require('../models/genre'),
        Album = require('../models/album'),
        UserPreferences = require('../models/user_preferences'),
        UserPersonalData = require('../models/user_personal_data'),
        userVerification = require('../models/user_verification');

//template for TRUE message
let TrueMassage = () => {
    return {
        status: "true",
        message: ""
    }
};

//template for FAILURE message
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
            "description": "Restful Services Course - Final Project",
        });
};

exports.getUserVerification = (req, res) => {

    const   bodyParams = req.body;
    const   username = bodyParams.username,
            password = bodyParams.password;

    let resTrue = TrueMassage();//prepare message for success
    let resFalse = FalseMassage();//prepare message for unsuccess
    resFalse.message = "No matched username found";

    if (//check if all params passed and they not empty
    username != undefined && password != undefined
    &&
    username != "" && password != ""
    ) {
    } else {//build the error message
        let message = "Undefined or empty parameters: ";
        if (username == undefined || username == "") {
            message += "user_name, ";
        }
        if (password == undefined || password == "") {
            message += "password, ";
        }
        message += ")";
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
    resTrue.message = `The user '${username}' exist`;

    //checking if user exist.
    userVerification.findOne({username: username, password: password},{_id:0,__v:0 },
        (err, user) => {
            //checking if genres names exist
            if (err || user == null) {
                if (err) {
                    resFalse.error.push(
                        {
                            name: "db",
                            message: `Query error: ${err}.`
                        }
                    );
                    console.log(`query error: ${err}`);
                } else {
                    resFalse.error.push(
                        {
                            name: "account",
                            message: `The user '${username}' or password '${password}' wrong.`
                        }
                    );
                }
                res.status(200).json(resFalse);
                return;
            } else {
                console.log('User added to Database ');
                resTrue.user = user;
                res.status(200).json(
                    resTrue
                );
                return;
            }
        });
};

//Get user genres function
exports.getUserGenres = (req, res) => {

    let resTrue = TrueMassage();//prepare message for success
    let resFalse = FalseMassage();//prepare message for unsuccess

    resTrue.message = 'Getting user genres';
    resFalse.message = 'There was a Problem with getting user genres';

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
                console.log(`User '${req.params.username}' does not exist`);
            }
            res.status(200).json(resFalse);
        } else {
            console.log(`User genres received from DB`);
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

    resTrue.message = 'Getting user personal data';
    resFalse.message = 'Problem with getting user personal data';

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
                    console.log(`User '${req.params.username}' does not exist`);
                }
                res.status(200).json(resFalse);
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

    resTrue.message = 'Getting all genres';
    resFalse.message = 'Problem with getting all genres';

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

// Get album by id function
exports.getAlbum = (req, res) => {

    let resTrue = TrueMassage(); // Prepare message for success
    let resFalse = FalseMassage(); // Prepare message for unsuccess

    resTrue.message = 'Getting album';
    resFalse.message = 'Problem with getting album';

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
                    console.log(`Album '${req.params.album_id}' does not exist`);
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

// Get all albums function
exports.getAllAlbums = (req, res) => {

    let resTrue = TrueMassage(); // Prepare message for success
    let resFalse = FalseMassage(); // Prepare message for unsuccess

    resTrue.message = 'Getting all albums';
    resFalse.message = 'Problem with getting all albums';

    //find all genres in data base
    Album.find({}, {_id:0, __v:0 },
        (err, albums) => {
            if (err){
                console.log(`query error: ${err}`);
                resFalse.error.push({name: "db", message: `query error: ${err}`});
                res.status(200).json(resFalse);
            }else {
                resTrue.albums = albums;
                res.status(200).json(resTrue); //send json response
            }
            return;
        }
    );
};

// Get user albums function
exports.getUserAlbums = (req, res) => {

    let resTrue = TrueMassage(); // Prepare message for success
    let resFalse = FalseMassage(); // Prepare message for unsuccess

    resTrue.message = 'Getting user personal data';
    resFalse.message = 'Problem with getting user personal data';

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
                    console.log (`User '${req.params.username}' does not exist`);
                }
                res.status(200).json(resFalse);
            } else {
                Album.find({album_id: {$in: userPreferences.albums_id}}, (err, albums) => {
                    if(err){
                        console.log(`query error: ${err}`);
                        resFalse.error.push({name: "db", message: `query error: ${err}`});
                    } else {
                        console.log('User Albums returned from DB');
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

// Get user albums by genres function
exports.getUserAlbumsByGenres = (req, res) => {

    let resTrue = TrueMassage(); // Prepare message for success
    let resFalse = FalseMassage(); // Prepare message for unsuccess

    resTrue.message = 'Getting user albums by genres';
    resFalse.message = 'Problem with getting user albums by genres';

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
                console.log (`User '${req.params.username}' does not exist`);
            }
            res.status(200).json(resFalse);
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

// Set user album function.
exports.setUserAlbum = (req, res) => {

    const   bodyParams = req.body;
    const   username = bodyParams.username,
            password = bodyParams.password;
    let     album_id = bodyParams.album_id;

    let resTrue = TrueMassage(); // Prepare message for success
    let resFalse = FalseMassage(); // Prepare message for unsuccess
    resFalse.message = "Album not added!";

    if(  // Check validation of user parameters and params not empty
    username != undefined && password != undefined && album_id!= undefined
    &&
    username != "" && password != "" && album_id!= ""
    ){
        // Check params length validation
        if(isNaN(album_id = parseInt(album_id))){
            resFalse.error.push(
                {
                    name: "parameters",
                    message: "Parameter Error! Album Id must be a number"
                }
            );
            res.status(200).json(
                resFalse
            );
            return;
        }
    }else{
        let message = "Undefined or empty parameters: "; // Build template error message
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
        res.status(200).json(  // Send error massage
            resFalse
        );
        return;
    }
    resTrue.message = `The album '${album_id}' was added to User '${username}'`;

    userVerification.findOne({username: username, password: password},  // Checking if User exists
        (err1, user) => {
            Album.findOne({album_id}, (err2, album) => {   // Checking if Album exist
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
                                message: `User name '${username}' is missing or incorrect or password '${password}' 
                                is wrong.`
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
                                console.log('Album added to User album list');
                                res.status(200).json(
                                    resTrue
                                );
                            }
                            return;
                        } // End Update function
                    );
                }
            });
        }
    );
};

// Delete user album function
exports.delUserAlbum = (req, res) => {
    const   bodyParams = req.body;
    const   username = bodyParams.username,
            password = bodyParams.password;
    let     album_id = bodyParams.album_id;

    let resTrue = TrueMassage(); // Prepare message for success
    let resFalse = FalseMassage(); // Prepare message for unsuccess
    resFalse.message = "Album has not been moved from User list";

    if( // Check validation of user parameters and params not empty
    username != undefined && password != undefined && album_id!= undefined
    &&
    username != "" && password != "" && album_id!= ""
    ){
        // Check params length validation
        if(isNaN(album_id = parseInt(album_id))){
            resFalse.error.push(
                {
                    name: "parameters",
                    message: "Parameter Error! Album Id must be a number"
                }
            );
            res.status(200).json(
                resFalse
            );
            return;
        }
    }else{ // Build template error message
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
        res.status(200).json( // Send error massage
            resFalse
        );
        return;
    }
    resTrue.message = `Album '${album_id}' was deleted from '${username}' Album list.`;
    // Check validation of user parameters and params not empty
    userVerification.findOne({username: username, password: password},
        (err1, user) => {
            Album.findOne({album_id}, (err2, album) => { // Checking if Album exist
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
                                message: `User name '${username}' is missing or incorrect or password '${password}' is wrong.`
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
                                console.log('Album deleted from User album list');
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

// Set new genres for User. Before adding the function validate: all parameters, user existence and genre existence.
exports.setUserGenres = (req, res) => {
    const   bodyParams = req.body;
    const   username = bodyParams.username,
            password = bodyParams.password;

    let resTrue = TrueMassage(); // Prepare message for success
    let resFalse = FalseMassage(); // Prepare message for unsuccess
    resFalse.message = "Genres not added to User";

    let genresToAdd = []; // Array for genres to add

    for (let i in bodyParams) { // Parsing and validate genres parameters
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
    // Check if genres params validate and user id is a number
    if (
        genresToAdd.length == 0 || username == undefined || username == ""
        || password == undefined || password == ""
    ) {
        resFalse.error.push( // Prepare error json
            {
                name: "parameters",
                message: "Required Parameters: username=(string), password(string), " +
                    "genre_1=(string),genre_2=(string),etc."
            }
        );
        res.status(200).json( //Send json error
            resFalse
        );
        return;
    }
    // Checking for existence of User
    userVerification.findOne({username: username, password: password}, (err1, docs) => { // Checking for existence of User
            Genre.find({name: {$in: genresToAdd}}, (err2, genres) => { // Checking for existence of genres names
                // Check if some errors exist and if all genres name exists in database
                if (err1 || err2 || docs == null || genres == null || genres.length != genresToAdd.length) {
                    if (err1) {
                        // Prepare error message
                        resFalse.error.push(
                            {
                                name: "db",
                                message: `Query error: ${err1}.`
                            }
                        );
                        console.log(`query error: ${err1}`);
                    }
                    if (err2) {
                        resFalse.error.push({name: "db", message: `Query error: ${err2}.`} // Prepare error message
                        );
                        console.log(`query error: ${err2}`);
                    }
                    if (docs == null)
                        resFalse.error.push(  // Prepare error message
                            {
                                name: "account",
                                message: `User name '${username}' is missing or incorrect or password '${password}'
                                is wrong.`
                            }
                        );
                    if (genres.length != genresToAdd.length)
                        resFalse.error.push( // Prepare error message
                            {
                                name: "parameters",
                                message: "wrong name of genres"
                            }
                        );

                    res.status(200).json( //send error json
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
                                console.log('User Genres Set');
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

// Adding new user function. Before adding the function validate: all parameters valid, user name not already in use
exports.setNewUser = (req,res) => {

    const   bodyParams = req.body;
    const   username = bodyParams.username,
            password = bodyParams.password,
            firstName = bodyParams.first_name,
            lastName = bodyParams.last_name,
            email = bodyParams.email,
            dob = bodyParams.dob;

    let resTrue = TrueMassage(); // Prepare message for success
    let resFalse = FalseMassage(); // Prepare message for unsuccess

    resFalse.message = "User has not been added";

    if ( // Check validation of user parameters and check parameters not empty
    username != undefined && password != undefined && firstName != undefined
    && lastName != undefined && email != undefined && dob != undefined
    &&
    username != "" && password != "" && firstName != ""
    && lastName != "" && email != "" && dob != ""
    ) {
        // Check valid length of parameters
        if (password.length < 8 || password.length > 20) {
            resFalse.error.push(
                {
                    name: "parameters",
                    message: "The length of password must to be at least 8 characters and nor more then 20"
                }
            );
            res.status(200).json(
                resFalse
            );
            return;
        }
    } else { // Build template error message

        let message = "Undefined or empty parameters: ";
        if (username == undefined || username == "") {
            message += "user_name, ";
        }
        if (password == undefined || password == "") {
            message += "password, ";
        }
        if (firstName == undefined || firstName == "") {
            message += "first_name, ";
        }
        if (lastName == undefined || secondName == "") {
            message += "last_name, ";
        }
        if (email == undefined || email == "") {
            message += "email, ";
        }
        if (dob == undefined || dob == "") {
            message += "dob, ";
        }
        message += ")";
        message = message.split(', )')[0] + ".";

        resFalse.error.push(
            {
                name: "parameters",
                message: message
            }
        );
        res.status(200).json( // Send error massage
            resFalse
        );
        return;
    }
    resTrue.message = `User '${username}' was added`;

    // Checking for existence of User
    UserPersonalData.findOne({$or: [{username: username}, {email: email}]},
        (err1, docs) => {
            if (err1 || docs != null) {
                if (err1) {
                    resFalse.error.push({name: "db", message: `query error: ${err1}`});
                }
                if (docs != null) {
                    resFalse.error.push(
                        {
                            name: "duplicate",
                            message: `User '${username}' or E-mail '${email}' already exist. Please try again.`
                        }
                    );
                }
                res.status(200).json(
                    resFalse
                );
                return;
            } else {
                // Create new verification user for Collection
                let newUserVerification = new userVerification({
                    username: username,
                    password: password
                });
                // Save new verification user in Collection
                newUserVerification.save((err2) => {
                    if (err2) {
                        resFalse.error.push({name: "db", message: `query error: ${err2}`});
                        res.status(200).json(
                            resFalse
                        );
                        return;
                    }
                    else {
                        // Create new user Personal data for Collection
                        let newUserPersonalData = new UserPersonalData({
                            username: username,
                            first_name: firstName,
                            last_name: lastName,
                            email: email,
                            dob: dob
                        });
                        // Save new user personal data in Collection
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
                                    albums_id: [],
                                    genres: []
                                });
                                // Save new user personal data
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

//set (reset) genres function. Before adding the function validate: all parameters valid, user name exist, Genre Exists
exports.resetUserGenres = (req, res) => {
    const   bodyParams = req.body;
    const   username = bodyParams.username,
            password = bodyParams.password;

    let resTrue = TrueMassage(); // Prepare message for success
    let resFalse = FalseMassage(); // Prepare message for failure
    resFalse.message = "reset genres unsucceeded";

    let genresToAdd = [];

    for (let i in bodyParams) { // Parsing and validate genres parameters
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
    // Check validation of genre parameters. Check user id is number
    if (
        genresToAdd.length == 0 || username == undefined || username == ""
        || password == undefined || password == ""
    ) {
        resFalse.error.push(
            {
                name: "parameters",
                message: "Please check you entered all required data : username=(string), password(string), " +
                "genre_1=(string),genre_2=(string),...,genre_n=(string)"
            }
        );
        res.status(200).json(
            resFalse
        );
        return;
    }

    // Checking for existence of User
    userVerification.findOne({username: username, password: password}, (err1, docs) => {

        // Checking for genre name exist
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
                                message: `User name '${username}' is missing or incorrect or password '${password}`
                            }
                        );
                    if (genres.length != genresToAdd.length)
                        resFalse.error.push(
                            {
                                name: "parameters",
                                message: "Wrong Genre name"
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
                                resTrue.message = resTrue.message.split(', )')[0] + `) Genres reseted to User '${username}'`;

                                console.log('Genres reset for user');
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