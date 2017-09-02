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

    convertKey:function(keyStr) {
        keyStr = keyStr.replace(/ /g,'');
        keyStr = keyStr.toUpperCase();

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
    },

    convertSocket:function(socketStr) {
        socketStr = socketStr.toLowerCase();
        if (socketStr == "overhead light") {
            return "2";
        } else if (socketStr == "fan") {
            return "3";
        } else if (socketStr == "ac" || socketStr == "air conditioning") {
            return "4";
        } else if (socketStr == "lamp") {
            return "5";
        } else {
            return socketStr;
        }
    },

    convertChannel:function(chanStr) {
        chanStr = chanStr.toUpperCase();
        if ("TBN" == chanStr || chanStr == "2") {
            return 2;
        } else if ("NBC" == chanStr || chanStr == "203") {
            return 203;
        } else if ("THE CW" == chanStr || chanStr == "204") {
            return 204;
        } else if ("ABC" == chanStr || chanStr == "206") {
            return 206;
        } else if ("PBS" == chanStr || chanStr == "205") {
            return 205;
        } else if ("FOX" == chanStr || chanStr == "208") {
            return 208;
        } else if ("CBS" == chanStr || chanStr == "201") {
            return 201;
        } else if ("USA" == chanStr || chanStr == "12") {
            return 12;
        } else if ("NICKELODEON" == chanStr || chanStr == "13") {
            return 13;
        } else if ("HSN" == chanStr || chanStr == "16") {
            return 16;
        } else if ("CARTOON NETWORK" == chanStr || chanStr == "23") {
            return 23;
        } else if ("LIFETIME" == chanStr || chanStr == "25") {
            return 25;
        } else if ("MTV" == chanStr || chanStr == "29") {
            return 29;
        } else if ("FOX SPORTS OHIO" == chanStr || chanStr == "30") {
            return 30;
        } else if ("GOLF CHANNEL" == chanStr || chanStr == "31") {
            return 31;
        } else if ("FXX" == chanStr || chanStr == "32") {
            return 32;
        } else if ("ESPN" == chanStr || chanStr == "33") {
            return 33;
        } else if ("ESPN 2" == chanStr || chanStr == "34") {
            return 34;
        } else if ("TNT" == chanStr || chanStr == "35") {
            return 35;
        } else if ("AMC" == chanStr || chanStr == "36") {
            return 36;
        } else if ("BRAVO" == chanStr || chanStr == "37") {
            return 37;
        } else if ("FOOD NETWORK" == chanStr || chanStr == "38") {
            return 38;
        } else if ("HGTV" == chanStr || chanStr == "39") {
            return 39;
        } else if ("TURNER CLASSIC MOVIES" == chanStr || chanStr == "40") {
            return 40;
        } else if ("FREEFORM" == chanStr || chanStr == "41") {
            return 41;
        } else if ("TLC" == chanStr || chanStr == "42") {
            return 42;
        } else if ("NATIONAL GEOGRAPHIC" == chanStr || chanStr == "43") {
            return 43;
        } else if ("SYFY" == chanStr || chanStr == "44") {
            return 44;
        } else if ("A&E" == chanStr || chanStr == "45") {
            return 45;
        } else if ("HISTORY CHANNEL" == chanStr || chanStr == "46") {
            return 46;
        } else if ("DISCOVERY CHANNEL" == chanStr || chanStr == "47") {
            return 47;
        } else if ("TBS" == chanStr || chanStr == "49") {
            return 49;
        } else if ("CNBC" == chanStr || chanStr == "50") {
            return 50;
        } else if ("CNN" == chanStr || chanStr == "51") {
            return 51;
        } else if ("HLN" == chanStr || chanStr == "52") {
            return 52;
        } else if ("MSNBC" == chanStr || chanStr == "53") {
            return 53;
        } else if ("ANIMAL PLANET" == chanStr || chanStr == "54") {
            return 54;
        } else if ("FOX NEWS CHANNEL" == chanStr || chanStr == "55") {
            return 55;
        } else if ("TENNIS CHANNEL" == chanStr || chanStr == "56") {
            return 56;
        } else if ("SPORTSTIME OHIO" == chanStr || chanStr == "57") {
            return 57;
        } else if ("SPIKE" == chanStr || chanStr == "58") {
            return 58;
        } else if ("BET" == chanStr || chanStr == "59") {
            return 59;
        } else if ("CMT" == chanStr || chanStr == "60") {
            return 60;
        } else if ("TRAVEL CHANNEL" == chanStr || chanStr == "61") {
            return 61;
        } else if ("THE WEATHER CHANNEL" == chanStr || chanStr == "62") {
            return 62;
        } else if ("FX" == chanStr || chanStr == "64") {
            return 64;
        } else if ("LIFETIME MOVIE NETWORK" == chanStr || chanStr == "65") {
            return 65;
        } else if ("TV LAND" == chanStr || chanStr == "66") {
            return 66;
        } else if ("TRUTV" == chanStr || chanStr == "67") {
            return 67;
        } else if ("OWN" == chanStr || chanStr == "68") {
            return 68;
        } else if ("MTV2" == chanStr || chanStr == "69") {
            return 69;
        } else if ("FS1" == chanStr || chanStr == "70") {
            return 70;
        } else if ("HALLMARK MOVIES AND MYSTERIES" == chanStr || chanStr == "71") {
            return 71;
        } else if ("WE TV" == chanStr || chanStr == "72") {
            return 72;
        } else  if ("WGN AMERICA" == chanStr || chanStr == "73") {
            return 73;
        } else if ("SUNDANCE" == chanStr || chanStr == "74") {
            return 74;
        } else if ("IFC" == chanStr || chanStr == "75") {
            return 75;
        } else if ("FXM" == chanStr || chanStr == "77") {
            return 77;
        } else if ("FOX SPORTS OHIO" == chanStr || chanStr == "78") {
            return 78;
        } else if ("HALLMARK CHANNEL" == chanStr || chanStr == "81") {
            return 81;
        } else if ("FOX BUSINESS" == chanStr || chanStr == "82") {
            return 82;
        } else if ("INVESTIGATION DISCOVERY" == chanStr || chanStr == "83") {
            return 83;
        } else if ("BIG TEN NETWORK" == chanStr || chanStr == "87") {
            return 87;
        } else if ("NBC SPORTS NETWORK" == chanStr || chanStr == "88") {
            return 88;
        }
    }
};
