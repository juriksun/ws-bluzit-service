'use strict';
const   express     = require('express'),
        bodyParser  = require('body-parser'),
        app         = express(),
		 controller = require('./controllers/routes_controller'),
        port        = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', port);
app.use('/', express.static('./public'));//for API
app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    //res.set('Content-Type', 'application/json');  //Dont need it, cause API contained in this WS
    next();
});


/*** All routes ***/
app.get('/', (req, res) =>{ res.status(200).sendFile(__dirname + "/public/api.html")});
app.use('/set_new_user', controller.setNewUser);
app.use('/set_user_genres',controller.setUserGenres);
app.use('/reset_user_genres',controller.resetUserGenres);
app.use('/set_user_album', controller.setUserAlbum);
app.use('/del_user_album', controller.delUserAlbum);
app.use('/get_user_verification', controller.getUserVerification);
app.use('/get_user_albums_by_genres/:username', controller.getUserAlbumsByGenres);
app.use('/get_all_genres', controller.getAllGenres);
app.use('/get_user_personal_data/:username', controller.getUserPersonalData);
app.use('/get_album/:album_id', controller.getAlbum);
app.use('/get_user_albums/:username', controller.getUserAlbums);
app.use('/get_user_genres/:username', controller.getUserGenres);
//app.get('/get_random_songs');//implemented
app.use('/get_all_albums', controller.getAllAlbums);
app.use('/info', controller.info);

//friendly 404 PAGE
app.all('*', (req,res) => {
	console.log('Wrong Page Address - friendly 404. Check theURL Address');
	res.status(404).send('Got Lost? This is a friendly 404 Page');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});