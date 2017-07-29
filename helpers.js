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
    },

    convertChannel:function(chanStr) {
        if ("TBN" == chanStr || chanStr == "2") {
            return 2;
        } else if ("NBC" == chanStr || chanStr == "203") {
            return 203;
        } else if ("The CW" == chanStr || chanStr == "204") {
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
        } else if ("Nickelodeon" == chanStr || chanStr == "13") {
            return 13;
        } else if ("HSN" == chanStr || chanStr == "16") {
            return 16;
        } else if ("Cartoon Network" == chanStr || chanStr == "23") {
            return 23;
        } else if ("Lifetime" == chanStr || chanStr == "25") {
            return 25;
        } else if ("MTV" == chanStr || chanStr == "29") {
            return 29;
        } else if ("FOX Spots Ohio" == chanStr || chanStr == "30") {
            return 30;
        } else if ("Golf Channel" == chanStr || chanStr == "31") {
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
        } else if ("Bravo" == chanStr || chanStr == "37") {
            return 37;
        } else if ("Food Network" == chanStr || chanStr == "38") {
            return 38;
        } else if ("HGTV" == chanStr || chanStr == "39") {
            return 39;
        } else if ("Turner Classic Movies" == chanStr || chanStr == "40") {
            return 40;
        } else if ("Freeform" == chanStr || chanStr == "41") {
            return 41;
        } else if ("TLC" == chanStr || chanStr == "42") {
            return 42;
        } else if ("National Geographic" == chanStr || chanStr == "43") {
            return 43;
        } else if ("SyFy" == chanStr || chanStr == "44") {
            return 44;
        } else if ("A&E" == chanStr || chanStr == "45") {
            return 45;
        } else if ("History Channel" == chanStr || chanStr == "46") {
            return 46;
        } else if ("Discovery Channel" == chanStr || chanStr == "47") {
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
        } else if ("Animal Planet" == chanStr || chanStr == "54") {
            return 54;
        } else if ("FOX News Channel" == chanStr || chanStr == "55") {
            return 55;
        } else if ("Tennis Channel" == chanStr || chanStr == "56") {
            return 56;
        } else if ("SportsTime Ohio" == chanStr || chanStr == "57") {
            return 57;
        } else if ("Spike" == chanStr || chanStr == "58") {
            return 58;
        } else if ("BET" == chanStr || chanStr == "59") {
            return 59;
        } else if ("CMT" == chanStr || chanStr == "60") {
            return 60;
        } else if ("Travel Channel" == chanStr || chanStr == "61") {
            return 61;
        } else if ("The Weather Channel" == chanStr || chanStr == "62") {
            return 62;
        } else if ("FX" == chanStr || chanStr == "64") {
            return 64;
        } else if ("Lifetime Movie Network" == chanStr || chanStr == "65") {
            return 65;
        } else if ("TV Land" == chanStr || chanStr == "66") {
            return 66;
        } else if ("TruTV" == chanStr || chanStr == "67") {
            return 67;
        } else if ("OWN" == chanStr || chanStr == "68") {
            return 68;
        } else if ("MTV2" == chanStr || chanStr == "69") {
            return 69;
        } else if ("FS1" == chanStr || chanStr == "70") {
            return 70;
        } else if ("Hallmark Movies and Mysteries" == chanStr || chanStr == "71") {
            return 71;
        } else if ("WE TV" == chanStr || chanStr == "72") {
            return 72;
        } else  if ("WGN America" == chanStr || chanStr == "73") {
            return 73;
        } else if ("Sundance" == chanStr || chanStr == "74") {
            return 74;
        } else if ("IFC" == chanStr || chanStr == "75") {
            return 75;
        } else if ("FXM" == chanStr || chanStr == "77") {
            return 77;
        } else if ("FOX Sports Ohio" == chanStr || chanStr == "78") {
            return 78;
        } else if ("Hallmark Channel" == chanStr || chanStr == "81") {
            return 81;
        } else if ("FOX Business" == chanStr || chanStr == "82") {
            return 82;
        } else if ("Investigation Discovery" == chanStr || chanStr == "83") {
            return 83;
        } else if ("Big Ten Network" == chanStr || chanStr == "87") {
            return 87;
        } else if ("NBC Sports Network" == chanStr || chanStr == "88") {
            return 88;
        }
    }
};
