var unirest = require("unirest");

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
	try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*if (event.session.application.applicationId !== "amzn1.ask.skill.b507b06c-9eec-4fee-b4c0-14e66a330307") {
             context.fail("Invalid Application ID");
        }*/

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,  
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {}, context);
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};


/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback, context) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent;
    var intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("TVChannelIntent" === intentName || "TVVolumeIntent" === intentName || "SocketIntent" === intentName || "TVInputIntent" === intentName || "TVKeyIntent" === intentName) {
        getResponse(intent, session, callback, context);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
        context.succeed(buildResponse(sessionAttributes, speechletResponse));
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
        context.succeed(buildResponse(sessionAttributes, speechletResponse));
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to Auto Home, how can I help?";
    var repromptText = "Speak a command.";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Task Completed";
    
	// Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

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
            response = `sudo ~/Documents/tv_scripts/key POWER`;
            folderName += "tvkey_" + "POWER";
        } else {
            var stateSlot = intent.slots.state;
            speechOutput = `Turn ${stateSlot.value} ${socketSlot.value}`;
            response = `sudo ~/Documents/socket_scripts/socket ${convertSocket(socketSlot.value)} ${stateSlot.value}`;
            folderName += "socket_" + convertSocket(socketSlot.value) + "_" + stateSlot.value;
        }
    } else if(cardTitle === "TVChannelIntent") {
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(dirSlot.value) {
            if(numSlot.value) {
                speechOutput = `Channel Direction was ${dirSlot.value}, and Number was ${numSlot.value}.`;
                response = `sudo ~/Documents/tv_scripts/chng_channel ${dirSlot.value} ${numSlot.value}`;
                folderName += "tvchan_" + dirSlot.value + "_" + numSlot.value;
            } else {
                speechOutput = `Channel ${dirSlot.value} by 1.`;
                response = `sudo ~/Documents/tv_scripts/chng_channel ${dirSlot.value}`;
                folderName += "tvchan_" + dirSlot.value;
            }
        } else {
            var chanSlot = intent.slots.channel;
            speechOutput = `Change channel to channel ${convertChannel(chanSlot.value)}.`;
            response = `sudo ~/Documents/tv_scripts/chng_channel ${convertChannel(chanSlot.value)}`;
            folderName += "tvchan_" + convertChannel(chanSlot.value);
        }
    } else if (cardTitle === "TVVolumeIntent") {
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(numSlot.value) {
            speechOutput = `Volume Direction was ${dirSlot.value}, and Number was ${numSlot.value}.`;
            response = `sudo ~/Documents/tv_scripts/chng_volume ${dirSlot.value} ${numSlot.value}` ;
            folderName += "tvvolume_" + dirSlot.value + "_" + numSlot.value;
        } else {
            speechOutput = `Volume ${dirSlot.value} by 1.`;
            response = `sudo ~/Documents/tv_scripts/chng_volume ${dirSlot.value}`;
            folderName += "tvvolume_" + dirSlot.value;
        }
    } else if (cardTitle === "TVInputIntent") {
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(numSlot.value) {
            speechOutput = `Input Direction was ${dirSlot.value}, and Number was ${numSlot.value}.`;
            response = `sudo ~/Documents/tv_scripts/chng_volume ${dirSlot.value} ${numSlot.value}`;
            folderName += "tvinput_" + dirSlot.value + "_" + numSlot.value;
        } else {
            speechOutput = `Input ${dirSlot.value} by 1.`;
            response = `sudo ~/Documents/tv_scripts/chng_volume ${dirSlot.value}`;
            folderName += "tvinput_" + dirSlot.value;
        }

    } else if (cardTitle === "TVKeyIntent") {
        var keySlot = intent.slots.key;
        speechOutput = `You pressed key ${convertKey(keySlot.value)}.`;
        response = `sudo ~/Documents/tv_scripts/key ${convertKey(keySlot.value)}`;
        folderName += "tvkey_" + convertKey(keySlot.value);
    } else {
        speechOutput = "Invalid Command.";
    }

	var access_token = "M6jFx4joPvoAAAAAAAAAfYYXa_leASaFgHILerQ5ozH6iUdFgI_TR4PyCloVzByR"

    repromptText = "Another Command?";

	var req = unirest("POST", "https://api.dropboxapi.com/2/files/create_folder");

	req.headers({
  	  "content-type": "application/json",
          "authorization": "Bearer M6jFx4joPvoAAAAAAAAAgJ74aC0sCU-QRJBGRJO_X8oxCBDSMV3DhAzdLCfTdSv0"
	});


	var test = "/yugeFolder";
	req.type("json");

	var obj = {};
	obj.path = folderName;
	obj.autorename= false;

    var json= JSON.stringify( obj);
    console.log(json);
	req.send(json);
	console.log(req);
    req.end(function (res) {
		if (res.error) throw new Error(res.error);
        context.succeed("Finish");
		console.log(res.body);
	});
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };

}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

function convertKey(keyStr) {
    keyStr = keyStr.replace(/ /g,'');

    if (keyStr == "INPUT") {
        return "MEDIA";
    } else if (keyStr == "ASPECT") {
        return "F1";
    } else if (keyStr == "CCD") {
        return "F2"; 
    } else if (keyStr == "GAME") {
        return "F3";
    } else if (keyStr == "PICTURE") {
        return "F4";
    } 

    return keyStr;
}



function convertSocket(socketStr) {
    if (socketStr == "Bed Lamp") {
        return "2";
    } else if (socketStr == "Fan") {
        return "3";
    } else if (socketStr == "A/C" || socketStr == "Air Conditioning") {
        return "4";
    } else if (socketStr == "Desk Lamp") {
        return "5";
    } else {
        return socketStr;
    }
}

function convertChannel(chanStr) {
    if ("TBN" == chanStr || chanStr == "2") {
        return "2";
    } else if ("NBC" == chanStr || chanStr == "203") {
        return "2 0 3";
    } else if ("The CW" == chanStr || chanStr == "204") {
        return "2 0 4";
    } else if ("ABC" == chanStr || chanStr == "206") {
        return "2 0 6";
    } else if ("PBS" == chanStr || chanStr == "205") {
        return "2 0 5";
    } else if ("FOX" == chanStr || chanStr == "208") {
        return "2 0 8";
    } else if ("CBS" == chanStr || chanStr == "201") {
        return "2 0 1";
    } else if ("USA" == chanStr || chanStr == "12") {
        return "1 2";
    } else if ("Nickelodeon" == chanStr || chanStr == "13") {
        return "1 3";
    } else if ("HSN" == chanStr || chanStr == "16") {
        return "1 6";
    } else if ("Cartoon Network" == chanStr || chanStr == "23") {
        return "2 3";
    } else if ("Lifetime" == chanStr || chanStr == "25") {
        return "2 5";
    } else if ("MTV" == chanStr || chanStr == "29") {
        return "2 9";
    } else if ("FOX Spots Ohio" == chanStr || chanStr == "30") {
        return "3 0";
    } else if ("Golf Channel" == chanStr || chanStr == "31") {
        return "3 1";
    } else if ("FXX" == chanStr || chanStr == "32") {
        return "3 2";
    } else if ("ESPN" == chanStr || chanStr == "33") {
        return "3 3";
    } else if ("ESPN 2" == chanStr || chanStr == "34") {
        return "3 4";
    } else if ("TNT" == chanStr || chanStr == "35") {
        return "3 5";
    } else if ("AMC" == chanStr || chanStr == "36") {
        return "3 6";
    } else if ("Bravo" == chanStr || chanStr == "37") {
        return "3 7";
    } else if ("Food Network" == chanStr || chanStr == "38") {
        return "3 8";
    } else if ("HGTV" == chanStr || chanStr == "39") {
        return "3 9";
    } else if ("Turner Classic Movies" == chanStr || chanStr == "40") {
        return "4 0";
    } else if ("Freeform" == chanStr || chanStr == "41") {
        return "4 1";
    } else if ("TLC" == chanStr || chanStr == "42") {
        return "4 2";
    } else if ("National Geographic" == chanStr || chanStr == "43") {
        return "4 3";
    } else if ("SyFy" == chanStr || chanStr == "44") {
        return "4 4";
    } else if ("A&E" == chanStr || chanStr == "45") {
        return "4 5";
    } else if ("History Channel" == chanStr || chanStr == "46") {
        return "4 6";
    } else if ("Discovery Channel" == chanStr || chanStr == "47") {
        return "4 7";
    } else if ("TBS" == chanStr || chanStr == "49") {
        return "4 9";
    } else if ("CNBC" == chanStr || chanStr == "50") {
        return "5 0";
    } else if ("CNN" == chanStr || chanStr == "51") {
        return "5 1";
    } else if ("HLN" == chanStr || chanStr == "52") {
        return "5 2";
    } else if ("MSNBC" == chanStr || chanStr == "53") {
        return "5 3";
    } else if ("Animal Planet" == chanStr || chanStr == "54") {
        return "5 4";
    } else if ("FOX News Channel" == chanStr || chanStr == "55") {
        return "5 5";
    } else if ("Tennis Channel" == chanStr || chanStr == "56") {
        return "5 6";
    } else if ("SportsTime Ohio" == chanStr || chanStr == "57") {
        return "5 7";
    } else if ("Spike" == chanStr || chanStr == "58") {
        return "5 8";
    } else if ("BET" == chanStr || chanStr == "59") {
        return "5 9";
    } else if ("CMT" == chanStr || chanStr == "60") {
        return "6 0";
    } else if ("Travel Channel" == chanStr || chanStr == "61") {
        return "6 1";
    } else if ("The Weather Channel" == chanStr || chanStr == "62") {
        return "6 2";
    } else if ("FX" == chanStr || chanStr == "64") {
        return "6 4";
    } else if ("Lifetime Movie Network" == chanStr || chanStr == "65") {
        return "6 5";
    } else if ("TV Land" == chanStr || chanStr == "66") {
        return "6 6";
    } else if ("TruTV" == chanStr || chanStr == "67") {
        return "6 7";
    } else if ("OWN" == chanStr || chanStr == "68") {
        return "6 8";
    } else if ("MTV2" == chanStr || chanStr == "69") {
        return "6 9";
    } else if ("FS1" == chanStr || chanStr == "70") {
        return "7 0";
    } else if ("Hallmark Movies and Mysteries" == chanStr || chanStr == "71") {
        return "7 1";
    } else if ("WE TV" == chanStr || chanStr == "72") {
        return "7 2";
    } else  if ("WGN America" == chanStr || chanStr == "73") {
        return "7 3";
    } else if ("Sundance" == chanStr || chanStr == "74") {
        return "7 4";
    } else if ("IFC" == chanStr || chanStr == "75") {
        return "7 5";
    } else if ("FXM" == chanStr || chanStr == "77") {
        return "7 7";
    } else if ("FOX Sports Ohio" == chanStr || chanStr == "78") {
        return "7 8";
    } else if ("Hallmark Channel" == chanStr || chanStr == "81") {
        return "8 1";
    } else if ("FOX Business" == chanStr || chanStr == "82") {
        return "8 2";
    } else if ("Investigation Discovery" == chanStr || chanStr == "83") {
        return "8 3";
    } else if ("Big Ten Network" == chanStr || chanStr == "87") {
        return "8 7";
    } else if ("NBC Sports Network" == chanStr || chanStr == "88") {
        return "8 8";
    }
}
