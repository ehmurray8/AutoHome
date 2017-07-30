var PubNub = require('pubnub');
var shell = require('shelljs');

var scriptsPath = "~/AutoHome/rpi_scripts/";
var scriptName = "";
var params = "";

function subscribe() {
   
    pubnub = new PubNub({
        subscribeKey : 'sub-c-906b4314-7409-11e7-91f5-0619f8945a4f'
    });
       
    pubnub.addListener({
        status: function(statusEvent) {
            //if (statusEvent.category === "PNConnectedCategory") {
            //    publishSampleMessage();
            //
        },
        message: function(message) {
            console.log("New Message!!", message);
            var innerMsg = message.message;
            var func = innerMsg["Function Name"];
            if (func == "Channel") {
                scriptName = "chng_channel";
                if(innerMsg.hasOwnProperty("Channel Number")) {
                    var chanNum = innerMsg["Channel Number"];        
                    params = chanNum.toString().split('').join(' ');
                } else {
                    params = innerMsg["Direction"].toLowerCase() + " " + Number(innnerMsg["Number"]);
                }
            } else if (func == "Volume") {
                scriptName = "chng_volmue";
                params = innerMsg["Direction"].toLowerCase() + " " + Number(innnerMsg["Number"]);
            } else if (func == "Input") {
                scriptName = "chng_input";
                params = innerMsg["Direction"].toLowerCase() + " " + Number(innnerMsg["Number"]);
            } else if (func == "Key") {
                scriptName = "key";
                params = innerMsg["Key Type"];
            } else if (func == "Socket") {
                scriptName = "socket";
                if (innerMsg.hasOwnProperty("Socket State")) {
                    params = Number(innerMsg["Socket Type"]) + " " + innerMsg["Socket State"].toLowerCase(); 
                } else {
                    scriptName = "Key";
                    params = "POWER";
                }
            }

            shell.exec(scriptsPath + scriptName + " " + params);
        },
        presence: function(presenceEvent) {
            // handle presence
        }
    }); 

    console.log("Subscribing..");
    pubnub.subscribe({
        channels: ['auto_home'] 
    });
}

if (require.main === module) {
    subscribe();
}
