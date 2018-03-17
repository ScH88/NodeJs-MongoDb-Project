//app.js - As the entry point of this application, this will be the first file to be executed on startup

//Retrieve all values and functions from express and assign to variable
var express = require('express');
//Instantiate the staff members controller from the 'controllers' directory
var staffMemberController = require('./controllers/staffMemberController');
//Set up our application as a new instance by firing express
var app = express();
//Set up template/view engine
app.set('view engine', 'ejs');
//Allow the use of all static files in the 'public' directory (e.g all css, js and image files)
app.use(express.static('./public'));
//Fire the staff member controller
//Pass this application to the controller, so it can access it's values
staffMemberController(app);
//Have the application listen to a port, making this project's root URL '127.0.0.1:8081'
app.listen(8081);
