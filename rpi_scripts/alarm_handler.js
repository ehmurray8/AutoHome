var Ably = require("ably");
var shell = require('shelljs');
var ably_info = require("./ably_info.js"); 
var schedule = require("node-schedule");

var scriptsPath = "/home/pi/AutoHome/rpi_scripts/";

var realtime = new Ably.Realtime({key: ably_info.ABLY_KEY});
var channel = realtime.channels.get(ably_info.ALARM_CHAN);

var alarm = null;

channel.subscribe(function(msg) {
    handle_msg(msg);
}); 
function handle_msg(message) {
    var alarmTime;
    var valid = true;
    try {
        message = message.data;
        alarmTime = message.Alarm;
    } catch (e) {
        valid = false;
    }
    if (!valid){
        console.log(func);
        valid = false;
    } else {
        var date;
        try {
            date = new Date(int(alarm_time));
            var currDate = new Date();
            if(date - currDate > 1000) {
                if(alarm != null) {
                    alarm.cancel();
                }
                alarm = schedule.scheduleJob(date, function(){
                    var scriptName = "alarm_script";
                    var cmd = "sudo " + scriptsPath + scriptName;
                    shell.exec(cmd);             
                    alarm = null;
                });
            }
        } catch(e) {
            valid = false;
        }
    }
}
