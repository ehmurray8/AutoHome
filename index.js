var resp = require("./helpers.js");

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
	try {
        console.log("event.session.application.applicationId=" +
                event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your 
         * skill's application ID to prevent someone else from
         * configuring a skill that sends requests to this function.
         */
        /*if (event.session.application.applicationId 
               !== "amzn1.ask.skill.b507b06c-9eec-4fee-b4c0-14e66a330307") {
             context.fail("Invalid Application ID");
        }*/

        if (event.session.new) {
            onSessionStarted(
               {requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,  
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(
                    sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) 
                    {}, context);
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
    if ("TVChannelIntent" === intentName || "TVVolumeIntent" === intentName ||
           "SocketIntent" === intentName || "TVInputIntent" === intentName ||
           "TVKeyIntent" === intentName) {
        resp.getResponse(intent, session, callback, context);
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

    var body = {};
    var func_key = "Function Name";
    var dir = "Direction";
    var num = "Number";
    if(cardTitle === "SocketIntent") {
        body[func_key] = "Socket";
        var sockType = "Socket Type";
        var sockState = "Socket State";
        var socketSlot = intent.slots.socket;
        if(socketSlot.value == "TV") {
            speechOutput = "TV Power function requested.";
            body[sockType] = "TV";
        } else {
            var stateSlot = intent.slots.state;
            speechOutput = "Turn ${stateSlot.value} ${socketSlot.value}";
            body[sockType] = socketSlot.value;
            body[sockState] = stateSlot.value.toUpperCase();
        }
    } else if(cardTitle === "TVChannelIntent") {
        body[func_key] = "Channel";
        var chan = "Channel Number";
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(dirSlot.value) {
            if(numSlot.value) {
                speechOutput = "Channel Direction was ${dirSlot.value}, and Number was ${numSlot.value}.";
                body[dir] = dirSlot.value.toUpperCase();
                body[num] = Number(numSlot.value);
            } else {
                speechOutput = "Channel ${dirSlot.value} by 1.";
                body[dir] = dirSlot.value.toUpperCase();
                body[num] = 1;
            }
        } else {
            var chanSlot = intent.slots.channel;
            speechOutput = "Change channel to channel ${convertChannel(chanSlot.value)}.";
            body[chan] = chanSlot.value;
        }
    } else if (cardTitle === "TVVolumeIntent") {
        body[func_key] = "Volume";
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(numSlot.value) {
            speechOutput = "Volume Direction was ${dirSlot.value}, and Number was ${numSlot.value}.";
            body[dir] = dirSlot.value.toUpperCase();
            body[num] = Number(numSlot.value);
        } else {
            speechOutput = "Volume ${dirSlot.value} by 1.";
            body[dir] = dirSlot.value.toUpperCase();
            body[num] = 1;
        }
    } else if (cardTitle === "TVInputIntent") {
        body[func_key] = "Input";
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(numSlot.value) {
            speechOutput = "Input Direction was ${dirSlot.value}, and Number was ${numSlot.value}.";
            body[dir] = dirSlot.value.toUperCase();
            body[num] = Number(numSlot.value);
        } else {
            speechOutput = "Input ${dirSlot.value} by 1.";
            body[dir] = dirSlot.value.toUpperCase();
            body[num] = Number(numSlot.value);
        }
    } else if (cardTitle === "TVKeyIntent") {
        body[func_key] = "Key";
        var type = "Key Type";
        var keySlot = intent.slots.key;
        speechOutput = "You pressed key ${convertKey(keySlot.value)}.";
        body[type] = keySlot.value;
    } else {
        speechOutput = "Invalid Command.";
    }

    repromptText = "Another Command?";

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
