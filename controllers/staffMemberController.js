//Retrieve all values and functions from body-parser and assign to variable
var bodyParser = require('body-parser');
//Retrieve all values and functions from mongoose and assign to variable
var mongoose = require ('mongoose');
//Connect to the database
//<dbuser> resplaced with ScH and <dbpassword> replaced with 1234
mongoose.connect('mongodb://ScH:1234@ds261128.mlab.com:61128/staff-profiles');
//Create a schema - a blueprint in other words
var staffMemberSchema = new mongoose.Schema({
  name:String,
  job:String,
  fullDetails:String
});
//Create a model, giving the name of the collection/table in the mongodb database above to get/send data to and from...
//...and the staff member Schema
var StaffMemberModel = mongoose.model('staff-profiles', staffMemberSchema);
/*
//Now, define the following 3 Staff Member Model instances, each one being an array of values, and then save, creating them in the database...
//...Each save has a callback function, which if an error occurs, it is thrown. Otherwise, write to console
//note-These are commented out, as they must only be called once in order to populate the collection/table. Otherwise, duplicates will be created
var item1 = StaffMemberModel({
  name:'Bob',
  job:'Waiter',
  fullDetails:'Has left school aged 16, but never been in further education. Has chosen being a waiter because of his love of food. Would occasionally sneak some of the food for himself.'
}).save(function(error) {
  if (error) throw error;
  console.log('Item Saved');
});
var item2 = StaffMemberModel({
  name:'Kenny',
  job:'Policeman',
  fullDetails:'Has always wanted to become a policeman ever since he was a child, watching his favourite characters on television. He kept a nice record of arrests since signing on the force since 18, but was nearly killed at age 25.'
}).save(function(error) {
  if (error) throw error;
  console.log('Item Saved');
});
var item3 = StaffMemberModel({
  name:'Sara',
  job:'Assistant',
  fullDetails:'Assistant to an upcoming film director, to be exact. She managed to get the role via mutual connections. Sara has always loved movies, even being able to memorize every line in The Godfather Pt1.'
}).save(function(error) {
  if (error) throw error;
  console.log('Item Saved');
});
*/
//Create application/x-www-form-urlencoded parser
//This is a piece of middleware which formats key-pair arrays, for example, from mainContent.name = name to...
//...maincontent: { name: name }, allowing for easier variable retrieval
var urlencodedParser = bodyParser.urlencoded({extended:false});
//If required from outside this file, return this function
module.exports = function(app){
  //For if the user types in '/staff-members' after the root URL
  app.get('/staff-members', function(request, response) {
    //Get all StaffMemberModels from the model's respective mongodb collection/table and pass them to the view
    //To find a specific item instead, type in StaffMemberModel.find({item:'Get milk'})
    StaffMemberModel.find({}, function(error, dataRetrieved){
      //If an error is encountered, throw the error
      if (error) throw error;
      //render the 'staff-members' ejs file from the 'views' directory, passing it all the StaffMemberModels in...
      //...an array under the keyname 'staffArray'
      response.render('staff-members', {staffArray:dataRetrieved});
    });
  });
  //For when a POST request is sent to the 'staff-members' page, operate on it using the urlEncodedParser middleware
  //Then fire a callback method, with the request (the data sent here) and response parameters
  app.post('/staff-members', urlencodedParser, function(request, response) {
    //Get the type of form being submitted by retrieving the postType hidden input from the request body, where the form is found
    var type = request.body.postType;
    //Create an array for the staff member values to be inserted, by retrieving the name, job and fullDetails variables from the request body/form
    //Because the keys have the same names as mongoDb database field names, in the event of editing/updating, the mongoDb values will be replaced by these
    var staffObj = {
      name:request.body.name,
      job:request.body.job,
      fullDetails:request.body.fullDetails
    };
    //If the form type is "create-new-staff"
    if (type == "create-new-staff") {
      //Pass the staffObj array to the StaffMemberModel and save, creating the new entry. Then fire a callback method
      var newStaff = StaffMemberModel(staffObj).save(function(error, data) {
        //If an error is found, throw the error
        if (error) throw error;
        //Send the data back to the front-end as JSON code
        response.json(data);
      });
    //Otherwise, if the form type is "edit-staff"
    } else if (type == "edit-staff") {
      //Use findOneAndUpdate to update the target field, which we find using an instance of ObjectId(using the hidden objId from the form)...
      //...In the second parameter, pass the staffObj to replace the target field's name, job and fullDetails fields. Then, fire the callback method
      var editStaff = StaffMemberModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(request.body.objId)},
      staffObj, function(error, data) {
        //If an error is found, throw the error
        if (error) throw error;
        //Send the data back to the front-end as JSON code
        response.json(data);
      });
    }
  });
  //
  app.delete('/staff-members/:id', function(request, response) {
    //Find the target data entry where it's Id is equa; to a new instance of object ID (using the id from the url parameters)
    //When found, delete that object, then fire a callback method
    StaffMemberModel.find({
      _id: new mongoose.Types.ObjectId(request.params.id)
    }).remove(function(error, data) {
      //If an error is found, throw that error
      if (error) throw error;
      //Send the data back to the front-end as JSON code
      response.json(data);
    });
  });
  //For if the user types in '/staff-members' after the root URL
  app.get('/member-full-details/:id', urlencodedParser, function(request, response) {
    //Retrieve the requested data item from mongodb, where the object ID is equal to the passed Id cast to ObjectId
    StaffMemberModel.find({
      _id: new mongoose.Types.ObjectId(request.params.id)
    }, function(error, dataRetrieved){
      //If an error is encountered, throw the error
      if (error) throw error;
      //Render the 'member-full-details' ejs file from the 'views' directory, passing it all the staff member details in...
      //...an array under the keyname 'staffDetails'
      response.render('member-full-details', {staffDetails:dataRetrieved[0]});
    });
  });
};
