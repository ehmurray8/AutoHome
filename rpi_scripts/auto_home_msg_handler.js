/*
 * Runs on RPI and receives messages sent by Alexa or Android.
 */

var shell = require('shelljs');
var Ably = require('ably');
var ably_info = require('./ably_info.js');
var scriptspath = "~/autohome/rpi_scripts/";
var scriptName = "";
var params = "";

var realtime = new Ably.Realtime({key:ably_info.ABLY_KEY});
var channel = realtime.channels.get(ably_info.ABLY_CHAN);

function subscribe() {
   
    channel.subscribe(
        function(message) {
            console.log("New Message!!", message.data);
            message = message.data;
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
                    scriptName = "key";
                    params = "POWER";
                }
            }

            shell.exec("sudo " + scriptsPath + scriptName + " " + params);
        }
    ); 
}

if (require.main === module) {
    subscribe();
}
