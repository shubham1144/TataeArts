//Create a server using express
var express = require('express');
var app = express();
var path = require('path');
var PORT = process.env.PORT || 80;
//We need to set location of our static files
app.use(express.static(path.join(__dirname, "../../client")));

//Configure our basic server to respond index page
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, '../../client', 'index.html')); // load the single view file (angular will handle the page changes on the front-end)
});

//Start the server
app.listen(PORT);
console.log('Server is up and running on port ' + PORT);