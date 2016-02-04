// INSTRUCTIONS //
// Note: Be sure to follow the instructions in the mini hack
// Mini Hacks Link: [http://syncano-community.github.io/minihacks/]
//
// 1. Fill out the "User Variables" with your Syncano credentials
//      - All details can be found on the Syncano Dashboard
//      - (you'll need to create an API key)
//      - you can use an API key with "ignore_acl" instead of account
// 2. Add two functions to watch the 'create' and 'delete' of your class
//      - Find hints under '// Real Time Set Up' below
// 2. Set up a server in this directory
//      - link to easy server for mac/linux/pc
// 3. Add and remove files! (Don't worry, only you have access to them)
//
// You can also look through this file to see how the code works!

// User Variables
var accountKey = 'YOUR_ACCOUNT_KEY';
var apiKey = 'YOUR_API_KEY';
var instanceName = 'YOUR_INSTANCE';
var channel = 'YOUR_CHANNEL';
var className = 'YOUR_CLASS';

// Global Variables
var syncano = new Syncano({accountKey: accountKey});
var apiSyncano = new Syncano({apiKey: apiKey, instance: instanceName});
var instance = syncano.instance(instanceName);
var realtime = apiSyncano.channel(channel).watch();
var fileForm = $('#fileUpload');
var fileUploadForm = $('#fileUploadForm');
var filesRow = $('#filesRow');
var files = [];

// **** Real Time Set Up ****
// Hints:
//  - use the 'realtime' variable
//  - Put this code inside the "on create" call
//      addFileBlock(data);
//  - Put this code inside the "on delete" call
//      var fileID = $('#' + JSON.stringify(data.id));
//      fileID.fadeOut('fast', function(){
//          $(this).remove();
//      });

realtime.on('create', function(data) {
    addFileBlock(data);
});

realtime.on('delete', function(data) {
    var fileID = $('#' + JSON.stringify(data.id));
    fileID.fadeOut('fast', function(){
        $(this).remove();
    });
});


// Syncano Set Up
instance.class(className).dataobject().list()
    .then(function(res){
        if (res.objects.length < 1){
            filesRow.html('<div class="small-12 columns text-center"><h4 class="vertical" id="noFiles">Upload A File First</h4></div>');
        } else {
            files = res.objects;

            for (i = 0; i < files.length; i++){
                addFileBlock(res.objects[i]);
            }
        }
    })
    .catch(function(err){
        console.log(err);
    });

// Listeners
fileForm.on('change', function(e){
    $('#selectedFile').text(e.target.files[0].name);

    $('#fileFormSubmit').attr('disabled', false);
});

fileUploadForm.on('submit', function(e){
    e.preventDefault();

    var object = {
        "name": fileForm[0].files[0].name,
        "file": {
            filename: fileForm[0].files[0].name,
            data: fileForm[0].files[0]
        },
        "channel": channel
    };

    instance.class(className).dataobject().add(object)
        .then(function(res){

        })
        .catch(function(err){
            console.log(err);
        });

    fileForm.wrap('<form>').closest('form').get(0).reset();
    fileForm.unwrap();

    $('#selectedFile').text('');
});

// Functions
function addFileBlock(data) {
    filesRow.append('<div id="' + data.id + '" class="small-6 medium-4 large-3 columns" style="display:none"><div class="file text-center">' +
        '<h4>' + data.name + '</h4>' +
        '<a href=' + data.file.value + ' target="_blank"><p>Download</p></a>' +
        '<a class="removeText" onclick="removeFile(' + data.id + ')">Remove</a>' +
        '</div></div>');

    $('#' + JSON.stringify(data.id)).fadeIn();
}

function removeFile(id) {
    instance.class(className).dataobject(id).delete()
        .then(function(res){
            //console.log(res);
        })
        .catch(function(err){
            console.log(err);
        });
}

// Templating
$(document).foundation();