$(document).ready(function () {
  //Add an onSubmit listener to the form that has an ID value of "add-form"
  $('#add-form').on('submit', function(){
     //Create a key-pair array of values we will post to the controller
      var staff = {
        //Set a value under the name of postType, by retrieving the value of the form input whose name equals "postType"
        postType:$('form input[name="postType"]').val(),
        //Set a value under the name of name, by retrieving the value of the form input whose name equals "postType"
        name: $('form input[name="name"]').val(),
        //Set a value under the name of job, by retrieving the value of the form input whose name equals "postType"
        job: $('form input[name="job"]').val(),
        //Set a value under the name of fullDetails, by retrieving the value of the form input whose name equals "postType"
        fullDetails: $('form input[name="fullDetails"]').val()
      };
      //Create an AJAX request
      $.ajax({
        //Set the type of the request to "POST"
        type: 'POST',
        //Set the target URL as the staff-members page, which the staff-members controller will pick up
        url: '/staff-members',
        //Set the data we will send as the staff array
        data: staff,
        //Set the onSuccess callback method, for when the data is sent and staffMemberController.js has successfully added that data to mongoDb
        success: function(data){
          //Reload the current location/page
          location.reload();
        }
      });
      //Return false
      return false;
  });
  //Attach an onClick listener to all elements with the class of "edit-click"
  $('.edit-click').on('click', function(){
      //Get all form elements from inside this instance, then get the first(and only in this case) one (because calling...
      //...getElementsByTagName returns an array instead of a single element)
      var form = this.getElementsByTagName('form')[0];
      //If the display of the form is none (i.e. if the form is hidden)
      if (form.style.display=="none") {
        //Set the display css attribute of the form to "", making it appear/show
        form.style.display="";
        //Retrieve the cancel button by getting all button elements inside this instance, then retrieving the second entry (as...
        //...Retrieving the first instance returns the "edit" submit button
        var cancelButton = form.getElementsByTagName('button')[1];
        //Attach an onClick listener method to the cancel button
        cancelButton.onclick = function() {
          //Set the parent node (edit-click li tag)'s display css attribute back to "none" (note - does not work for some reason)
          //this.parentNode.style.display = "none";
          //Refresh the current window/location
          location.reload();
        };
        //Attach an onSubmit listener method to the form
        form.onsubmit = function() {
          //Create an array of key-pairs
            var staff = {
              //Add a value under the name of "postType", storing the value of the first input (the hidden post type) field in the form
              postType:form.getElementsByTagName('input')[0].value,
              //Add a value under the name of "objId", storing the value of the second input (the hidden staff member ID) field in the form
              objId:form.getElementsByTagName('input')[1].value,
              //Add a value under the name of "name", storing the value of the third input (the staff name) field in the form
              name:form.getElementsByTagName('input')[2].value,
              //Add a value under the name of "job", storing the value of the fourth input (the staff job) field in the form
              job:form.getElementsByTagName('input')[3].value,
              //Add a value under the name of "fullDetails", storing the value of the fifth input (full details) field in the form
              fullDetails:form.getElementsByTagName('input')[4].value
            };
            //Create an AJAX request
            $.ajax({
              //Set the type of this request to POST
              type: 'POST',
              //Set the target URL as the staff-members page
              url: '/staff-members',
              //Set the data we will send as the staff key-pair array
              data: staff,
              //Set an onSuccess callback method for when the data has been sent and staffMemberController.js has successfully edited the target data entry using it
              success: function(data){
                //Reload the current location/page
                location.reload();
              }
            });
            return false;
        };
      }
  });
});

function fullDetailsClick(staffID) {
  //Redirect to the member-full-details page by setting it as the window's location, passing it the passed ID to retrieve a staff member
  window.location = '/member-full-details/'+staffID;
}

function deleteClick(staffID) {
  //Create an AJAX request
  $.ajax({
    //Give this request a type of DELETE
    type: 'DELETE',
    //Set the destination URL as staff-members, plus the ID of the object to delete
    //The staff-members controller, on receiving the delete request, will retrieve the staff ID and operate using it
    url: '/staff-members/' + staffID,
    //Create an onSuccess callback method for when, using the staffId, staffMemberController.js has successfully deleted the target data entry
    success: function(data){
      //Refresh the current window/location
      location.reload();
    }
  });
}
