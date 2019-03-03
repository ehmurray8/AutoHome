var Ably = require("ably");
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var ably_info = require("./ably_info.js"); 
var schedule = require("node-schedule");

var scriptsPath = "/home/pi/AutoHome/rpi_scripts/";

var realtime = new Ably.Realtime({key: ably_info.ABLY_KEY});
var channel = realtime.channels.get(ably_info.ALARM_CHAN);

var alarm = null;
var musicJob = null;

channel.subscribe(function(msg) {
    console.log(msg);
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

    if (valid) {
        var date;
        try {
            if (alarmTime) {
                date = new Date(alarmTime);
                var currDate = new Date();
                if(date - currDate > 1000) {
                    if(alarm != null) {
                        alarm.cancel();
                    }
                    console.log("Scheduling job");
                    alarm = schedule.scheduleJob(date, function() {
                        console.log("Running job");
                        var scriptName = "alarm_script";
                        var cmd = scriptsPath + scriptName;
                        spawn('bash', cmd.split(' '), {stdio: 'inherit'});
                        alarm = null;
                    });
                }
            } else {
                var scriptName = "alarm_script";
                var cmd = scriptsPath + scriptName;
                spawn('bash', cmd.split(' '), {stdio: 'inherit'});
            }
        } catch(e) {
            console.log(e);
        }
    }
}
