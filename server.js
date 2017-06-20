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
app.get('/get_user_genres');//user=id for discover !!!!!No it to implement

app.get('/get_user_albums_by_genres/:user_id', controller.getUserAlbumsByGenres);//implemented

app.get('/get_random_songs');

app.get('/set_user_album/:user_id/:album_id', controller.setUserAlbum);//implemented
app.get('/del_user_album/:user_id/:album_id', controller.delUserAlbum);//implemented
app.get('/get_user_albums/:user_id', controller.getUserAlbums);//implemented


app.get('set_user_data');//not for first submission
app.get('/get_user_data/:user_id', controller.getUserData);//implemented


app.get('set_album');//for admin
app.get('/get_album/:album_id' ,controller.getAlbum);//implemented

app.get('/get_all_albums', controller.getAllAlbums);//implemented

app.get('get_discover_album');//(user=id,genresForDiscover=[genres]) not for implement to first submission

//friendly 404 PAGE
app.all('*', (req,res) => {
	console.log('Wrong Page Address - friendly 404. Check theURL Address');
	res.status(404).send('Got Lost? This is a friendly 404 Page');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});