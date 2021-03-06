var Ably = require("ably");
var exec = require("child_process").exec;
var spawn = require("child_process").spawn;
var ably_info = require("./ably_info.js"); 
var scriptsPath = "/home/pi/AutoHome/rpi_scripts/";

var realtime = new Ably.Realtime({key: ably_info.ABLY_KEY});
var channel = realtime.channels.get(ably_info.ABLY_CHAN);

channel.subscribe(function(msg) {
    console.log(msg);
    handle_msg(msg);
}); 

function handle_msg(message) {

    var scriptName = "";
    var params = "";

    var func = "";
    var valid = true;
    try {
        message = message.data;
        func = message["Function Name"];
    } catch (e) {
        func = "Invalid.";
    }
    if (func == "Channel") {
        scriptName = "chng_channel";
        if(message.hasOwnProperty("Channel Number")) {
            var chanNum = message["Channel Number"];        
            params = chanNum.toString().split('').join(' ');
        } else {
            params = message["Direction"].toLowerCase() + " " + Number(message["Number"]);
        }
    } else if (func == "Volume") {
        scriptName = "chng_volume";
        params = message["Direction"].toLowerCase() + " " + Number(message["Number"]);
    } else if (func == "Input") {
        scriptName = "chng_input";
        params = message["Direction"].toLowerCase() + " " + Number(message["Number"]);
    } else if (func == "Key") {
        scriptName = "key";
        params = message["Key Type"];
    } else if (func == "Socket") {
        scriptName = "socket";
        if (message.hasOwnProperty("Socket State")) {
            var socketType = message["Socket Type"];
            if (socketType == "power" || socketType == "Power" || socketType == "POWER") {
                scriptName = "power_script";
                params = message["Socket State"].toLowerCase();
            } else {
                params = Number(message["Socket Type"]) + " " + message["Socket State"].toLowerCase(); 
            }
        } else {
            scriptName = "key";
            params = "POWER";
        }
    } else if (func == "Lights") {
        scriptName = "lights_script";
        params = message.State.toLowerCase();
    } else if (func == "Sleep") {
        scriptName = "sleep_script";
    } else if (func == "Awake") {
        scriptName = "alarm_script"; 
    } else if (func == "Power") {
        scriptName = "power_script";
        params = message.State.toLowerCase();
    } else {
        console.log(func);
        valid = false;        
    }

    
    if(valid) { 
        var cmd = scriptsPath + scriptName + " " + params;
        spawn('bash', cmd.split(' '), {stdio: 'inherit'});
    }
}
