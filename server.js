'use strict';
const   express     = require('express'),
        bodyParser  = require('body-parser'),
        app         = express(),
		 controller = require('./controllers/routes_controller'),
        port        = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', port);
app.get('/', (req, res) =>{
	res.status(200).sendFile(__dirname + "/public/api.html");
});
app.use('/', express.static('./public'));//for API
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.set("Content-Type", "application/json");
    next();
});
/*** All routes ***/
app.get('/get_all_genres', controller.getAllGenres);//implemented
app.post('/set_user_genres',controller.setUserGenres);//implemented
app.post('/reset_user_genres',controller.resetUserGenres);//implemented
app.post('/set_new_user', controller.setNewUser);//implemented
app.get('/get_user_personal_data/:username', controller.getUserPersonalData);//implemented
app.get('/get_user_albums_by_genres/:username', controller.getUserAlbumsByGenres);//implemented
app.get('/get_album/:album_id', controller.getAlbum);//implemented
app.get('/get_all_albums', controller.getAllAlbums);//implemented
app.post('/set_user_album', controller.setUserAlbum);//implemented
app.get('/info', controller.info);//implemented
app.post('/del_user_album', controller.delUserAlbum);//implemented need to check
app.get('/get_user_albums/:username', controller.getUserAlbums);//implemented need to check
app.get('/get_user_genres/:username', controller.getUserGenres);//user=id for discover !!!!!No it to implement
app.get('/get_random_songs');

//app.post('/set_user_verification', controller.setUsereVerification);//not for first submission

//friendly 404 PAGE
app.all('*', (req,res) => {
	console.log('Wrong Page Address - friendly 404. Check theURL Address');
	res.status(404).send('Got Lost? This is a friendly 404 Page');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});