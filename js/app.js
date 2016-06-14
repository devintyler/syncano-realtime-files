// INSTRUCTIONS //
// Note: Be sure to follow the instructions in the mini hack
// Mini Hacks Link: [http://syncano-community.github.io/minihacks/]
//
// 1. Fill out the "User Variables" with your Syncano credentials
//      - All details can be found on the Syncano Dashboard
//      - you'll need to create an API key with "ignore_acl" switch (in the Dashboard)
// 2. Add two functions to watch the 'create' and 'delete' of your class
//      - Find hints under '// **** Real Time Set Up ****' below
// 2. Open 'index.html' in any browser
// 3. Add and remove files! (Don't worry, only you have access to them)
//
// You can also look through this file to see how the code works!
// Note: if something doesn't work, check your console!


// User Variables
var apiKey = '8dd14357dbff5baba2dcca804ac51b8f3f8703ff'; // make sure it has the 'ignore_acl' switched on when created!
var instanceName = 'syncano-file-manager'; // the Syncano instance name you created
var channelName = 'file-tracker'; // the channel you set up
var className = 'uploads'; // the class with the files you set up

// Global Variables
var instance = Syncano({apiKey: apiKey}); // creates Syncano object
var DataObject = instance.DataObject;
var realtime = instance.Channel; // **** your real time object from Syncano //
var channel = {
    instanceName:instanceName,
    name:channelName
};
var poll = realtime.please().poll(channel);
var fileForm = $('#fileUpload'); // jQuery file select ID
var fileUploadForm = $('#fileUploadForm'); // jQuery file form ID
var filesRow = $('#filesRow'); // jQuery file block ID
var files = []; // file array

poll.on('create', function(data){
    addFileBlock(data);
});

poll.on('delete', function(data){
    var fileID = $('#' + JSON.stringify(data.payload.id));
    fileID.fadeOut('fast', function(){
        $(this).remove();
    });
});

// **** Real Time Set Up ****
// Hints:
//  - use the 'realtime' variable
//  - Put this code below inside the Syncano channel watch create function - example: realtime.on('create'...)
//      addFileBlock(data);
//  - Put this code inside the Syncano channel watch create function - example: realtime.on('delete'...)
//      var fileID = $('#' + JSON.stringify(data.id));
//      fileID.fadeOut('fast', function(){
//          $(this).remove();
//      });

// **** PUT YOUR REAL TIME CODE HERE ****



// Syncano Set Up
// lists your current data
var fileQuery = {
    instanceName:instanceName,
    className: className
};
DataObject.please().list(fileQuery)
    .then(function(res){ // if getting data is successful
        if (res.length < 1){ // if there are files
            filesRow.html('<div id="noFiles" class="small-12 columns text-center"><h4 class="vertical">Upload A File First</h4></div>');
        } else { // if there are no files
            files = res;

            for (i = 0; i < files.length; i++){ // go through each file object
                addFileBlock(res[i]); // add file to UI
            }
        }
    })
    .catch(function(err){ // if data is wrong
        console.log(err);
    });

// Listeners
fileForm.on('change', function(e){ // when a file is selected
    $('#selectedFile').text(e.target.files[0].name); // show the name

    $('#fileFormSubmit').attr('disabled', false); // enable submit button
});

fileUploadForm.on('submit', function(e){ // when you submit the file
    e.preventDefault();

    var object = { // Syncano file object {name, file details, channel details}
        instanceName: instanceName,
        className: className,
        "name": fileForm[0].files[0].name,
        file: Syncano.file(fileForm[0].files[0]),
        "channel": channelName
    };

    // add data object to Syncano
    DataObject.please().create(object)
        .then(function(res){

        })
        .catch(function(err){
            console.log(err);
        });

    // Code for resetting the file form using jQuery
    fileForm.wrap('<form>').closest('form').get(0).reset();
    fileForm.unwrap();

    $('#selectedFile').text('');
    $('#fileFormSubmit').attr('disabled', true);
});

// Functions
function addFileBlock(data) { // add file to UI code
    if($("#noFiles").length > 0) {
        $('#noFiles').remove();
    }
    if(data.payload){
        var newData = data.payload;
    }
    if(newData.name.length > 30){
        newData.name = newData.name.substring(0,30) + "...";
    }
    filesRow.append('<div id="' + newData.id + '" class="small-6 medium-4 large-3 columns" style="display:none"><div class="file text-center">' +
        '<h4>' + newData.name + '</h4>' +
        '<a href=' + newData.file.value + ' target="_blank"><p>Download</p></a>' +
        '<a class="removeText" onclick="removeFile(' + newData.id + ')">Remove</a>' +
        '</div></div>');

    $('#' + JSON.stringify(newData.id)).fadeIn();
}

function removeFile(id) { // remove file from UI code
    var deleteQuery = {
        instanceName: instanceName,
        className: className,
        id: id
    };
    DataObject.please().delete(deleteQuery)
        .then(function(res){

        })
        .catch(function(err){
            console.log(err);
        });
}

// Foundation Templating
$(document).foundation();