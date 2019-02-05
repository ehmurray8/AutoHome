module.exports = {
    // --------------- Helpers that build all of the responses -----------------------

    buildSpeechletResponse: function(title, output, repromptText, shouldEndSession) {
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
    },

    buildResponse:function(sessionAttributes, speechletResponse) {
        return {
            version: "1.0",
            sessionAttributes: sessionAttributes,
            response: speechletResponse
        };
    },

    convertSocket:function(socketStr) {
        socketStr = socketStr.toLowerCase();
        console.log(socketStr);
        if (socketStr == "tv") {
            return "1";
        } else if (socketStr == "front light") {
            return "2";
        } else if (socketStr == "fan") {
            return "3";
        } else if (socketStr == "left light") {
            return "4";
        } else if (socketStr == "right light") {
            return "5";
        } else {
            return socketStr;
        }
    },
};
