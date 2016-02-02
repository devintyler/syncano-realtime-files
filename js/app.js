// Templating
$(document).foundation();

// Global Variables
var accountKey = 'YOUR_ACCOUNT_KEY';
var apiKey = 'YOUR_API_KEY';
var instanceName = 'YOUR_INSTANCE';
var channel = 'YOUR_CHANNEL';
var className = 'YOUR_CLASS';

var syncano = new Syncano({accountKey: accountKey});
var apiSyncano = new Syncano({apiKey: apiKey, instance: instanceName});
var instance = syncano.instance(instanceName);
var realtime = apiSyncano.channel(channel).watch();
var fileForm = $('#fileUpload');
var fileUploadForm = $('#fileUploadForm');
var filesRow = $('#filesRow');
var files = [];

// Real Time Set Up
realtime.on('create', function(data) {
    filesRow.append('<div id="' + data.id + '" class="small-6 medium-4 large-3 columns" style="display:none"><div class="file text-center">' +
        '<h4>' + data.name + '</h4>' +
        '<a href=' + data.file.value + ' target="_blank"><p>Download</p></a></div></div>');

    $('#' + JSON.stringify(data.id)).fadeIn();
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
                filesRow.append('<div id="' + res.objects[i].id + '" class="small-6 medium-4 large-3 columns"><div class="file text-center">' +
                    '<h4>' + res.objects[i].name + '</h4>' +
                    '<a href=' + res.objects[i].file.value + ' target="_blank"><p>Download</p></a></div></div>');
            }
        }
    })
    .catch(function(err){
        console.log(err);
    });

// Listeners
fileForm.on('change', function(e){
    $('#selectedFile').text(e.target.files[0].name);
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
});