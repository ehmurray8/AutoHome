var Alexa = require('alexa-sdk');
var unirest = require("unirest");
var APP_ID = "amzn1.ask.skill.b507b06c-9eec-4fee-b4c0-14e66a330307"; 
var helpers = require("./helpers.js"); 
var consts = require("./constants.js"); 
var ably_info = require("./ably_info.js");

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;

    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t("WELCOME_REPROMPT"); this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'SocketIntent': function() {
        handleUserIntent(consts.SOCK_INTENT, this.event.request.intent, this);
    },
    'TVChannelIntent': function() {
        handleUserIntent(consts.CHAN_INTENT, this.event.request.intent, this);
    },
    'TVVolumeIntent': function() {
        handleUserIntent(consts.VOL_INTENT, this.event.request.intent, this);
    },
    'TVKeyIntent': function() {
        handleUserIntent(consts.KEY_INTENT, this.event.request.intent, this);
    },
    'TVInputIntent': function() {
        handleUserIntent(consts.INPUT_INTENT, this.event.request.intent, this);
    },
    'LightsIntent': function() {
        handleUserIntent(consts.LIGHTS_INTENT, this.event.request.intent, this);
    },
    'SleepIntent': function() {
        handleUserIntent(consts.SLEEP_INTENT, this.event.request.intent, this);
    },
    'AwakeIntent': function() {
        handleUserIntent(consts.AWAKE_INTENT, this.event.request.intent, this);
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t("HELP_MESSAGE");
        this.attributes.repromptSpeech = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t("HELP_MESSAGE");
        this.attributes.repromptSpeech = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    }
};

var languageStrings = {
    "en": {
        "translation": {
            "SKILL_NAME": "Auto Home",
            "WELCOME_MESSAGE": consts.WEL_SPEECH_OUT,
            "WELCOME_REPROMPT": consts.WEL_REPROMPT,
            "DISPLAY_CARD_TITLE": "Auto Home",
            "HELP_MESSAGE": "Speak a command to control sockets and TV.",
            "HELP_REPROMPT": "Commands pertain to TV Volume, TV Channel, TV Input, Remote Key, and Sockets.",
            "STOP_MESSAGE": "Goodbye!",
            "REPEAT_MESSAGE": "Try saying repeat.",
            "NOT_FOUND_MESSAGE": "I\'m sorry, I currently do not know ",
        }
    }
};


function handleUserIntent(cardTitle, intent, handler) {
    var speechOutput = "";
    var numSlot = "";
    var dirSlot = "";

    var publish = true;
    var body = {};
    var func_key = consts.FUNC_KEY;
    var dir = consts.DIR_KEY;
    var num = consts.NUM_KEY;

    console.log(cardTitle);

    if(cardTitle === consts.SOCK_INTENT) {
        body[func_key] = consts.SOCK_FUNC;
        var sockType = consts.SOCK_TYPE_KEY;
        var sockState = consts.SOCK_STATE_KEY;
        var socketSlot = intent.slots.socket; 
        if(socketSlot.value == consts.TV_SOCKET) 
        { 
            speechOutput = "TV Power"; 
            body[sockType] = consts.TV_SOCKET;
        } else {
            var stateSlot = intent.slots.state;
            speechOutput = "Turn " + stateSlot.value + " " + socketSlot.value;
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
                speechOutput = "Channel Direction was " + dirSlot.value + ", and Number was " + numSlot.value;
                body[dir] = dirSlot.value.toUpperCase();
                body[num] = Number(numSlot.value);
            } else {
                speechOutput = "Channel " + dirSlot.value + "by 1";
                body[dir] = dirSlot.value.toUpperCase();
                body[num] = 1;
            }
        } else {
            var chanSlot = intent.slots.channel;
            speechOutput = "Change channel to channel " + chanSlot.value;
            body[chan] = helpers.convertChannel(chanSlot.value);
        }
    } else if (cardTitle === consts.VOL_INTENT) {
        body[func_key] = consts.VOL_FUNC;
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(numSlot.value) {
            speechOutput = "Volume Direction was " + dirSlot.value + ", and Number was " + numSlot.value;
            body[dir] = dirSlot.value.toUpperCase();
            body[num] = Number(numSlot.value);
        } else {
            speechOutput = "Volume " + dirSlot.value + "by 1.";
            body[dir] = dirSlot.value.toUpperCase();
            body[num] = 1;
        }
    } else if (cardTitle === consts.INPUT_INTENT) {
        body[func_key] = consts.INPUT_FUNC;
        numSlot = intent.slots.number;
        dirSlot = intent.slots.direction;
        if(numSlot.value) {
            speechOutput = "Input Direction was " + dirSlot.value + ", and Number was " + numSlot.value;
            body[dir] = dirSlot.value.toUperCase();
            body[num] = Number(numSlot.value);
        } else {
            speechOutput = "Input " + dirSlot.value + "by 1.";
            body[dir] = dirSlot.value.toUpperCase();
            body[num] = 1;
        }
    } else if (cardTitle === consts.KEY_INTENT) {
        body[func_key] = consts.KEY_FUNC;
        var type = "Key Type";
        var keySlot = intent.slots.key;
        speechOutput = "You pressed key " + keySlot.value;
        body[type] = helpers.convertKey(keySlot.value);
    } else if (cardTitle === consts.LIGHTS_INTENT) {
        body[func_key] = consts.LIGHTS_FUNC;
        var state = "State";
        stateSlot = intent.slots.state;
        speechOutput = "Lights " + stateSlot.value;
        body[state] = stateSlot.value;
    } else if (cardTitle === consts.SLEEP_INTENT) {
        body[func_key] = consts.SLEEP_FUNC;
    } else if (cardTitle === consts.AWAKE_INTENT) {
        body[func_key] = consts.AWAKE_FUNC;
    } else {
        speechOutput = "Invalid Command";
        publish = false;
    }

    if (publish) {
        var req = unirest("POST", "https://rest.ably.io/channels/" + ably_info.ABLY_CHAN + "/messages");
        var finished = false;

        req.headers({
                "cache-control": "no-cache",
                "authorization": ably_info.ABLY_AUTH,
                "content-type": "application/json"
        });

        req.type("json");
        req.send({
            "name": "Test",
            "data": body 
        });

        req.end(function (res) {
            if (res.error) throw new Error(res.error);
            console.log("Ending...");
            console.log(res.body);
            console.log("Published: %s", JSON.stringify(body));
            //handler.emit(':tell', speechOutput);
            handler.emit(':tell', "");
        });
    }   
}
