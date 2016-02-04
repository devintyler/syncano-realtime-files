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
var apiKey = 'YOUR_API_KEY'; // make sure it has the 'ignore_acl' switched on when created!
var instanceName = 'YOUR_INSTANCE'; // the Syncano instance name you created
var channel = 'YOUR_CHANNEL'; // the channel you set up
var className = 'YOUR_CLASS'; // the class with the files you set up

// Global Variables
var instance = new Syncano({apiKey: apiKey, instance: instanceName}); // creates Syncano object
var realtime = instance.channel(channel).watch(); // **** your real time object from Syncano //
var fileForm = $('#fileUpload'); // jQuery file select ID
var fileUploadForm = $('#fileUploadForm'); // jQuery file form ID
var filesRow = $('#filesRow'); // jQuery file block ID
var files = []; // file array



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
instance.class(className).dataobject().list()
    .then(function(res){ // if getting data is successful
        if (res.objects.length < 1){ // if there are files
            filesRow.html('<div id="noFiles" class="small-12 columns text-center"><h4 class="vertical">Upload A File First</h4></div>');
        } else { // if there are no files
            files = res.objects;

            for (i = 0; i < files.length; i++){ // go through each file object
                addFileBlock(res.objects[i]); // add file to UI
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
        "name": fileForm[0].files[0].name,
        "file": {
            filename: fileForm[0].files[0].name,
            data: fileForm[0].files[0]
        },
        "channel": channel
    };

    // add data object to Syncano
    instance.class(className).dataobject().add(object)
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
    filesRow.append('<div id="' + data.id + '" class="small-6 medium-4 large-3 columns" style="display:none"><div class="file text-center">' +
        '<h4>' + data.name + '</h4>' +
        '<a href=' + data.file.value + ' target="_blank"><p>Download</p></a>' +
        '<a class="removeText" onclick="removeFile(' + data.id + ')">Remove</a>' +
        '</div></div>');

    $('#' + JSON.stringify(data.id)).fadeIn();
}

function removeFile(id) { // remove file from UI code
    instance.class(className).dataobject(id).delete()
        .then(function(res){
            //console.log(res);
        })
        .catch(function(err){
            console.log(err);
        });
}

// Foundation Templating
$(document).foundation();