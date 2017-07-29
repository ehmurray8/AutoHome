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
            response = "sudo ~/Documents/tv_scripts/key POWER;";
            folderName += "tvkey_" + "POWER";
        } else {
            var stateSlot = intent.slots.state;
            speechOutput = "Turn ${stateSlot.value} ${socketSlot.value}";
            response = "sudo ~/Documents/socket_scripts/socket ${convertSocket(socketSlot.value)} ${stateSlot.value}";
            folderName += "socket_" + convertSocket(socketSlot.value) + "_" + stateSlot.value;
        }
    } else if(cardTitle === "TVChannelIntent") {
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(dirSlot.value) {
            if(numSlot.value) {
                speechOutput = "Channel Direction was ${dirSlot.value}, and Number was ${numSlot.value}.";
                response = "sudo ~/Documents/tv_scripts/chng_channel ${dirSlot.value} ${numSlot.value}";
                folderName += "tvchan_" + dirSlot.value + "_" + numSlot.value;
            } else {
                speechOutput = "Channel ${dirSlot.value} by 1.";
                response = "sudo ~/Documents/tv_scripts/chng_channel ${dirSlot.value}`;
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



