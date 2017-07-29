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

