//Create a server using express
var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var aws = require('aws-sdk');
var fs = require('fs');
var S3_LINK = 'https://s3.ap-south-1.amazonaws.com/tataearts/';
var moment = require('moment');
moment().format();
var multer = require('multer');
var upload = multer();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//Sets middleware to json body
app.use(bodyParser.json());
//Setting the port as 80 as we have configured 80 as default port for http on EC2 instance
var PORT = process.env.PORT || 80;
//We need to set location of our static files
app.use(express.static(path.join(__dirname, "../../client")));
//Adding a favicon for the website 
app.use(favicon(path.join(__dirname,'../../client','src/img','tataelogo.jpg')));
//Setup connection with mongodb instance
mongoose.connect('mongodb://localhost/tataearts');
//Logic to validate successfull connection with mongodb
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to mongodb successfully...");
});
//Create a Schema for CustomerQuery
var customerQuery = mongoose.Schema({
    name :           String,
    contactNumber :  Number,
    description :    String
});
//Construct a model from schema
var CustomerQuery = mongoose.model('CustomerQuery', customerQuery);

//Set Aws Configuration
aws.config.loadFromPath(path.join(__dirname, './AwsConfig.json'));

//Logic to Upload files to AWS S3 Bucket
var s3 = new aws.S3();
//API for accepting files uploaded from client
app.post('/addArtImages', upload.any(), function(req, res){
	console.log('Image Files received by server for uploading to S3 bucket...');
	console.log(req.files);
  //Once the file(s) are received upload to s3 bucket, Use a loop to upload the files
  for(i=0; i<req.files.length; i++){
    uploadFile('Art/' + moment.unix(moment()) +'.jpg', req.files[i]); 
  }
  res.json({ upload: successful });
});

//API to get list of Art Images on s3
app.get('/getArtImages', function(req, res) {
  //console.log("Trying to fetch list of images...");
  getListOfObjects(res);
});

//API to raise customer queries and store in mongodb
app.post('/askQuery', function(req, res){
  console.log("Trying to store the query raised in database...");
  console.log("The content being received as query is : " + req.body);
  var query = new CustomerQuery(req.body);
  query.save(function (err) {
    if (err) return handleError(err);
    res.sendStatus(200);
  });
});

//API to return admin panel
app.get('/uploadPanel', function(req, res) {
	res.sendFile(path.join(__dirname, '../../client', 'upload.html')); // load the single view file (angular will handle the page changes on the front-end)
});

//Configure our basic server to respond index page/Landing page
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../client', 'index.html')); // load the single view file (angular will handle the page changes on the front-end)
});

//Start the server
app.listen(PORT);
console.log('Server is up and running on port ' + PORT);

//Function to upload a single file to amazon s3 bucket
function uploadFile(remoteFilename, file) {
  //console.log('Attempting to upload file to s3..');
  var metaData = file.mimetype;
  
  s3.putObject({
    ACL: 'public-read',
    Bucket: 'tataearts',
    Key: remoteFilename,
    Body: file.buffer,
    ContentType: metaData
  }, function(error, response) {
    console.log('uploaded file[' + file.originalname + '] to [' + remoteFilename + '] as [' + metaData + ']');
  });
}

//Function to get content type by file
function getContentTypeByFile(fileName) {
  var rc = 'application/octet-stream';
  var fileNameLowerCase = fileName.toLowerCase();

  if (fileNameLowerCase.indexOf('.html') >= 0) rc = 'text/html';
  else if (fileNameLowerCase.indexOf('.css') >= 0) rc = 'text/css';
  else if (fileNameLowerCase.indexOf('.json') >= 0) rc = 'application/json';
  else if (fileNameLowerCase.indexOf('.js') >= 0) rc = 'application/x-javascript';
  else if (fileNameLowerCase.indexOf('.png') >= 0) rc = 'image/png';
  else if (fileNameLowerCase.indexOf('.jpg') >= 0) rc = 'image/jpg';

  return rc;
}

//Function to list the objects in the bucket
function getListOfObjects(res){
  var artImages = [];
  var params = {
    Bucket: 'tataearts', /* required */
    Prefix: 'Art/1'
  };
  //Call 'listObjects' function to get list of images in Art Folder 
  s3.listObjects(params, function(err, data) {
    if (err) 
    {
      console.log(err, err.stack); // an error occurred
    }
    else     
    {
      console.log(data.Contents);// successful response
      for(i=0; i<data.Contents.length; i++)
      {
         //console.log(data.Contents[i].Key);
         //Before pushing append the 'S3_LINK' at the start
         artImages.push(S3_LINK + data.Contents[i].Key);
      }
      res.send(artImages);
    }
  });
}