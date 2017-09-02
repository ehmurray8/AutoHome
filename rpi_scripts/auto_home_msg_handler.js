var Ably = require("ably");
var shell = require('shelljs');
var ably_info = require("./ably_info.js");


var scriptspath = "~/autohome/rpi_scripts/";

var realtime = new Ably.Realtime({key: ably_info.ABLY_KEY});
var channel = realtime.channels.get(ably_info.ABLY_CHAN);

channel.subscribe(function(msg) {
    console.log("Received: " + JSON.stringify(msg.data));
    console.log(msg.data.key);
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
        var innerMsg = message.message;
        func = innerMsg["Function Name"];
    } catch (e) {
        func = "Invalid.";
    }
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
    } else if(func == "Lights") {
        multFuncs = true;
        scriptName = "socket";
        params = 2 + " " + innerMsg["State"].toLowerCase();
        params2 = 5 + " " + innerMsg["State"].toLowerCase();
    } else {
        console.log(func);
        valid = false;        
    }

    
    if(valid) { 
        shell.exec("sudo " + scriptsPath + scriptName + " " + params);
        if (multFuncs) {
            shell.exec("sudo " + scriptsPath + scriptName + " " + params);
        }
    }
}
