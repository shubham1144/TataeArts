//Create a server using express
var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
//Setting the port as 80 as we have configured 80 as default port for http on EC2 instance
var PORT = process.env.PORT || 80;
//We need to set location of our static files
app.use(express.static(path.join(__dirname, "../../client")));
//Adding a favicon for the website 
app.use(favicon(path.join(__dirname,'../../client','src/img','tataelogo.jpg')));

//Configure our basic server to respond index page
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, '../../client', 'index.html')); // load the single view file (angular will handle the page changes on the front-end)
});

//Start the server
app.listen(PORT);
console.log('Server is up and running on port ' + PORT);