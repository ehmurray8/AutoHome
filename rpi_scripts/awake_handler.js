var Ably = require("ably");
var exec = require("child_process").exec;
var spawn = require("child_process").spawn;
var ably_info = require("./ably_info.js"); 
var scriptsPath = "/home/pi/AutoHome/rpi_scripts/";

var realtime = new Ably.Realtime({key: ably_info.ABLY_KEY});

var channel = realtime.channels.get("AWAKE_CHANNEL");

channel.subscribe(function(message) {
    console.log(message);
    var scriptName = "alarm_script";
    var cmd = scriptsPath + scriptName;
    spawn('bash', cmd.split(' '), {stdio: 'inherit'});
});
