var Ably = require("ably");
var shell = require('shelljs');
var ably_info = require("./ably_info.js"); 

var scriptsPath = "/home/pi/AutoHome/rpi_scripts/";

var realtime = new Ably.Realtime({key: ably_info.ABLY_KEY});
var channel = realtime.channels.get(ably_info.ABLY_CHAN);

channel.subscribe(function(msg) {
    console.log("Received: " + JSON.stringify(msg.data));
    handle_msg(msg);
});

channel.publish("Test", {"key":"value"});


function handle_msg(message) {

    var scriptName = "";
    var params = "";
    var params2 = "";

    var func = "";
    var valid = true;
    var multFuncs = false
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
            params = Number(message["Socket Type"]) + " " + message["Socket State"].toLowerCase(); 
        } else {
            scriptName = "key";
            params = "POWER";
        }
    } else if (func == "Lights") {
        multFuncs = true;
        scriptName = "socket";
        params = 2 + " " + message["State"].toLowerCase();
        params2 = 5 + " " + message["State"].toLowerCase();
    } else if (func == "Sleep") {
        scriptName = "sleep";
    }  else {
        console.log(func);
        valid = false;        
    }

    
    if(valid) { 
        var cmd = "sudo " + scriptsPath + scriptName + " " + params;
        shell.exec(cmd);
        if (multFuncs) {
            shell.exec("sudo " + scriptsPath + scriptName + " " + params2);
        }
    }
}
