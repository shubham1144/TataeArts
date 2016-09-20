//Create a server using express
var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var aws = require('aws-sdk');
var fs = require('fs');
var S3_LINK = 'https://s3.ap-south-1.amazonaws.com/tataearts/';
var multer = require('multer');
var upload = multer();
//Setting the port as 80 as we have configured 80 as default port for http on EC2 instance
var PORT = process.env.PORT || 80;
//We need to set location of our static files
app.use(express.static(path.join(__dirname, "../../client")));
//Adding a favicon for the website 
app.use(favicon(path.join(__dirname,'../../client','src/img','tataelogo.jpg')));
//Set Aws Configuration
aws.config.loadFromPath(path.join(__dirname, './AwsConfig.json'));
//Logic to Upload files to AWS S3 Bucket
var s3 = new aws.S3();
//Testing file upload to amazon s3 bucket
app.get('/testSingleFileUpload', function(req, res){
	console.log('Testing file upload to amazon s3 bucket...');
	uploadFile('Art/image1.jpg', 'tataelogo.jpg');
});
//API for accepting files uploaded from client
app.post('/ArtImages', upload.any(), function(req, res){
	console.log('Image Files received by server for uploading to S3 bucket...');
	console.log(req.files);
  //Once the file(s) are received upload to s3 bucket, Use a loop to upload the files
  for(i=0; i<req.files.length; i++){
    uploadFile('Art/' + 'image' + i + '.jpg', req.files[i]); 
  }
});
//Configure our basic server to respond admin panel
app.get('/uploadPanel', function(req, res) {
	res.sendFile(path.join(__dirname, '../../client', 'upload.html')); // load the single view file (angular will handle the page changes on the front-end)
});
//Configure our basic server to respond index page
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, '../../client', 'index.html')); // load the single view file (angular will handle the page changes on the front-end)
});
//Start the server
app.listen(PORT);
console.log('Server is up and running on port ' + PORT);

//A function to upload a single file to amazon s3 bucket
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
    //console.log(arguments);
    //On successful upload store the link in mongodb
    //Insert into db value (S3_LINK + remoteFilename);
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