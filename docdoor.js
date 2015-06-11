var exec = require('child_process').exec;
var config = require('config');
var fs=require('fs');
var request=require('request')

// var word = config.get('docdoor.word');
// var client = config.get('docdoor.client');
// var server = config.get('docdoor.server');

var express = require('express'),
    bodyParser = require('body-parser'),
    multer  = require('multer'), 
    app = express();

var user="";
var token="";

// send content from fileNameFull as fileName, to file under id
function sendFile(fileNameFull, fileName,  id){
	var endPoint="http://localhost:8000/producta/files/"+id; // not realy needed TODO check server side
	var req = request.post({url: endPoint, headers:{"x-key":user, "x-access-token":token }},  function (err, resp, body) {
		if (err) {
			console.log('Error!:');
			console.log(err);
		} else {
			console.log('URL: ' + body);
		}
	});
	var form = req.form();
	form.append('fileData', fs.createReadStream(fileNameFull), {contentType: 'application/msword'});
	form.append('fileDesc', '{"_id":"'+id+'", "name": "'+fileName+'"}');
}

// get template from fileId and save it as id.doc
function getFile(fileId, id, callback){
	var endPoint="http://localhost:8000/producta/files/"+fileId+"?x_key="+user+"&access_token="+token; // not realy needed TODO check server side
	var fileName=id+".doc";
	var fileNameFull= "c:\\temp\\"+fileName;    // word.temp+fileName;
console.log(endPoint);
	var destination = fs.createWriteStream(fileNameFull);
	var req = request(endPoint).pipe(destination).on('error', function (err) {
		if (err) {
			console.log('Error!:');
			console.log(err);
		}
	}).on('finish', function(){
			console.log("The file "+fileNameFull+" was saved!");
			callback(fileNameFull, fileName);
	});
}

var fileNameDod;
if (process.argv[1].toUpperCase().indexOf(".DOD")>0) {
	fileNameDod=process.argv[1];
} else if (process.argv[2].toUpperCase().indexOf(".DOD")>0){
	fileNameDod=process.argv[2];
} else {
	//exit
}

function winWordBookmarks(fileNameFull, value, keysList, idx, fileName){
	if (idx<keysList.length) {
		exec('start/w project2.exe '+keysList[idx]+' "'+value[keysList[idx]]+'" '+fileNameFull, function(error, stdout, stderr){
			if (!error) {
				idx++;
				winWordBookmarks(fileNameFull, value, keysList, idx, fileName);
			} else {
                            console.log(error);
                        }
		})
	} else {
		var startLine2= 'start/w '+fileNameFull;  //word.app+" "+fileNameFull;
		exec(startLine2, function callback(error, stdout, stderr){
		    console.log("Editing done! Sending file back to server!");
		    sendFile(fileNameFull, fileName, desc._id );
		});
	}
	// done
}

var desc=JSON.parse(fs.readFileSync(fileNameDod, 'utf8'));
user=desc.username;
token=desc.token;
value=desc.value
// desc.fileId - id of temaplte, desc._id id of dod future document fila
// callback give us full name with and without path
getFile(desc.fileId, desc._id, function(fileNameFull, fileName){
	var isWin = /^win/.test(process.platform);
	if (isWin) { // For now only on windows arhitecture 
console.log(value);
		winWordBookmarks(fileNameFull, value, Object.keys(value),0, fileName);
	}
})

