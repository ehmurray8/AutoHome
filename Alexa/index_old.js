var PubNub = require("pubnub");
var helpers = require("./helpers.js");
var consts = require("./constants.js");

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
	try {
        console.log("event.session.application.applicationId=" +
                event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your 
         * skill's application ID to prevent someone else from configuring a skill that sends requests to this function.  */
        /*if (event.session.application.applicationId 
               !== "amzn1.ask.skill.b507b06c-9eec-4fee-b4c0-14e66a330307") {
             context.fail("Invalid Application ID");
        }*/

        if (event.session.new) {
            onSessionStarted(
               {requestId: event.request.requestId}, event.session);
            console.log("NEW");
        }

        if (event.request.type === "LaunchRequest") {
            console.log("START LAUNCH");
            onLaunch(event.request,
                event.session,  
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(helpers.buildResponse(
                    sessionAttributes, speechletResponse));
                });
            console.log("END LAUNCH");
        } else if (event.request.type === "IntentRequest") {
            console.log("START INTENT");
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) 
                    {}, context);
            console.log("END INTENT");
        } else if (event.request.type === "SessionEndedRequest") {
            console.log("SESSION END");
            callback(null, "Success");
            //onSessionEnded(event.request, event.session);
            //context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
        console.log("ERROR");
        //context.succeed();
    }
};

/*
 * PubNub Publish.
 */
function publishCommand(message) {
    pubnub = new PubNub({
            publishKey : consts.PUBNUB_KEY_P,
            subscribeKey : consts.PUBNUB_KEY_S
        });
    console.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
    var publishConfig = {
        channel : consts.PUBNUB_CHANNEL,
        message : message
    };

    pubnub.publish(publishConfig, function(status, response) {
        console.log(status, response);
    });
}


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
    if (consts.CHAN_INTENT === intentName || consts.VOL_INTENT === intentName ||
           consts.SOCK_INTENT === intentName || consts.INPUT_INTENT === intentName ||
           consts.KEY_INTENT === intentName) {
        getResponse(intent, session, callback, context);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
        context.succeed(helpers.buildResponse(sessionAttributes, speechletResponse));
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
        context.succeed(helpers.buildResponse(sessionAttributes, speechletResponse));
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
    var cardTitle = consts.WEL_TITLE;
    var speechOutput = consts.WEL_SPEECH_OUT;
    var repromptText = consts.WEL_REPROMPT;
    var shouldEndSession = false;

    callback(sessionAttributes,
        helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = consts.END_TITLE;
    var speechOutput = consts.END_SPEECH_OUT;
    
	// Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, helpers.buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function getResponse(intent, session, callback, context) {
    var cardTitle = intent.name;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var numSlot = "";
    var dirSlot = "";

    var publish = true;
    var body = {};
    var func_key = consts.FUNC_KEY;
    var dir = consts.DIR_KEY;
    var num = consts.NUM_KEY;
    if(cardTitle === consts.SOCK_INTENT) {
        body[func_key] = consts.SOCK_FUNC;
        var sockType = consts.SOCK_TYPE_KEY;
        var sockState = consts.SOCK_STATE_KEY;
        var socketSlot = intent.slots.socket; if(socketSlot.value == consts.TV_SOCKET) { speechOutput = "TV Power function requested."; body[sockType] = consts.TV_SOCKET;
        } else {
            var stateSlot = intent.slots.state;
            speechOutput = "Turn " + stateSlot.value + " " + helpers.convertSocket(socketSlot.value) + ".";
            body[sockType] = helpers.convertSocket(socketSlot.value);
            body[sockState] = stateSlot.value.toUpperCase();
        }
    } else if(cardTitle === consts.CHAN_INTENT) {
        body[func_key] = consts.CHAN_FUNC;
        var chan = consts.CHAN_NUM_KEY;
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(dirSlot.value) {
            if(numSlot.value) {
                speechOutput = "Channel Direction was " + dirSlot.value + ", and Number was " + numSlot.value + ".";
                body[dir] = dirSlot.value.toUpperCase();
                body[num] = Number(numSlot.value);
            } else {
                speechOutput = "Channel " + dirSlot.value + "by 1.";
                body[dir] = dirSlot.value.toUpperCase();
                body[num] = 1;
            }
        } else {
            var chanSlot = intent.slots.channel;
            speechOutput = "Change channel to channel " + helpers.convertChannel(chanSlot.value) + ".";
            body[chan] = helpers.convertChannel(chanSlot.value);
        }
    } else if (cardTitle === consts.VOL_INTENT) {
        body[func_key] = consts.VOL_FUNC;
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(numSlot.value) {
            speechOutput = "Volume Direction was " + dirSlot.value + ", and Number was " + numSlot.value + ".";
            body[dir] = dirSlot.value.toUpperCase();
            body[num] = Number(numSlot.value);
        } else {
            speechOutput = "Volume " + dirSlot.value + "by 1.";
            body[dir] = dirSlot.value.toUpperCase();
            body[num] = 1;
        }
    } else if (cardTitle === consts.INPUT_INTENT) {
        body[func_key] = consts.CHAN_FUNC;
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(numSlot.value) {
            speechOutput = "Input Direction was " + dirSlot.value + ", and Number was " + numSlot.value + ".";
            body[dir] = dirSlot.value.toUperCase();
            body[num] = Number(numSlot.value);
        } else {
            speechOutput = "Input ${dirSlot.value} by 1.";
            body[dir] = dirSlot.value.toUpperCase();
            body[num] = Number(numSlot.value);
        }
    } else if (cardTitle === consts.KEY_INTENT) {
        body[func_key] = "Key";
        var type = "Key Type";
        var keySlot = intent.slots.key;
        speechOutput = "You pressed key " + helpers.convertKey(keySlot.value) + ".";
        body[type] = helpers.convertKey(keySlot.value);
    } else {
        speechOutput = "Invalid Command.";
        publish = false;
    }

    if (publish) {
        try {
            publishCommand(body);
        } catch (e) {
        }
    }

    repromptText = "Another Command?";
    console.log(repromptText);

    callback(sessionAttributes,
        helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, true));//shouldEndSession));
}
