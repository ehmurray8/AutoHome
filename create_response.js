var helpers = require("./helpers.js"); 

function getResponse(intent, session, callback, context) {
    var cardTitle = intent.name;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var numSlot = "";
    var dirSlot = "";
    var response = "";
    var folderName = "/";

    if(cardTitle === "SocketIntent") {
        var socketSlot = intent.slots.socket;
        if(socketSlot.value == "TV") {
            speechOutput = "TV Power function requested.";
            folderName += "tvkey_" + "POWER";
        } else {
            var stateSlot = intent.slots.state;
            speechOutput = "Turn " + stateSlot.value + " " + socketSlot.value;
            folderName += "socket_" + helpers.convertSocket(socketSlot.value) 
               + "_" + stateSlot.value;
        }
    } else if(cardTitle === "TVChannelIntent") {
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(dirSlot.value) {
            if(numSlot.value) {
                speechOutput = "Channel Direction was " + dirSlot.value +
                    ", and Number was " + numSlot.value + ".";
                folderName += "tvchan_" + dirSlot.value + "_" + numSlot.value;
            } else {
                speechOutput = "Channel " + dirSlot.value + " by 1.";
                folderName += "tvchan_" + dirSlot.value;
            }
        } else {
            var chanSlot = intent.slots.channel;
            speechOutput = "Change channel to channel " +
               helpers.convertChannel(chanSlot.value)} ".";
            folderName += "tvchan_" + helpers.convertChannel(chanSlot.value);
        }
    } else if (cardTitle === "TVVolumeIntent") {
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(numSlot.value) {
            speechOutput = "Volume Direction was " + dirSlot.value + 
               " and Number was " + numSlot.value + ".";
            folderName += "tvvolume_" + dirSlot.value + "_" + numSlot.value;
        } else {
            speechOutput = "Volume " + dirSlot.value  + " by 1.";
            folderName += "tvvolume_" + dirSlot.value;
        }
    } else if (cardTitle === "TVInputIntent") {
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(numSlot.value) {
            speechOutput = "Input Direction was " + dirSlot.value + 
               ", and Number was " + numSlot.value + ".";
            folderName += "tvinput_" + dirSlot.value + "_" + numSlot.value;
        } else {
            speechOutput = "Input " + dirSlot.value + " by 1.";
            folderName += "tvinput_" + dirSlot.value;
        }
    } else if (cardTitle === "TVKeyIntent") {
        var keySlot = intent.slots.key;
        speechOutput = "You pressed key " + helpers.convertKey(keySlot.value)+ ".";
        folderName += "tvkey_" + helpers.convertKey(keySlot.value);
    } else {
        speechOutput = "Invalid Command.";
    }

    repromptText = "Another Command?";

    dropbox_post(context, folderName);

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function dropbox_post(context, folderName) {
    var access_token = "M6jFx4joPvoAAAAAAAAAfYYXa_leASaFgHILerQ5ozH6iUdFgI_TR4PyCloVzByR"
    var req = unirest("POST", "https://api.dropboxapi.com/2/files/create_folder");

	req.headers({
  	  "content-type": "application/json",
          "authorization": "Bearer " + access_token
	});

	req.type("json");

	var obj = {};
	obj.path = folderName;
	obj.autorename= false;

    var json= JSON.stringify(obj);
    console.log(json);
	req.send(json);
	console.log(req);
    req.end(function (res) {
		if (res.error) throw new Error(res.error);
        context.succeed("Finish");
		console.log(res.body);
	});
}
