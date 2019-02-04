var Ably = require("ably");
var exec = require('child_process').exec;
var ably_info = require("./ably_info.js"); 
var schedule = require("node-schedule");

var scriptsPath = "/home/pi/AutoHome/rpi_scripts/";

var realtime = new Ably.Realtime({key: ably_info.ABLY_KEY});
var channel = realtime.channels.get(ably_info.ALARM_CHAN);

var alarm = null;
var musicJob = null;

channel.subscribe(function(msg) {
    handle_msg(msg);
}); 

function handle_msg(message) {
    var alarmTime;
    var valid = true;
    var music = null;
    try {
        message = message.data;
        alarmTime = message.Alarm;
    } catch (e) {
        valid = false;
    }

    try {
        music = message.Music;
    } catch(e) {
    }

    if (!valid){
        valid = false;
    } else {
        var date;
        try {
            date = new Date(alarmTime);
            var currDate = new Date();
            if(date - currDate > 1000) {
                if(alarm != null) {
                    alarm.cancel();
                }
                alarm = schedule.scheduleJob(date, function(){
                    var scriptName = "alarm_script";
                    var cmd = "sudo " + scriptsPath + scriptName;
                    exec(cmd);             
                    alarm = null;
                });
                if(musicJob != null) {
                    musicJob.cancel();
                }
                if(music != null) {
                    date += 15000;
                    musicJob = schedule.scheduleJob(date, function(){
                        musicJob = null;
                        music = null;
                    });
                }
            }
        } catch(e) {
            valid = false;
            console.log(e);
        }
    }
}
