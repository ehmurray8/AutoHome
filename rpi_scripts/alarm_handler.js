var Ably = require("ably");
var shell = require('shelljs');
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
                    shell.exec(cmd);             
                    alarm = null;
                });
                if(musicJob != null) {
                    musicJob.cancel();
                }
                if(music != null) {
                    date += 15000;
                    musicJob = schedule.scheduleJob(date, function(){
                        var req = "curl -X POST   'https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?accept=audio%2Fwav&text=";
                        var tail = "' -H 'authorization: Basic YjY5MmFkMzUtZDVhYi00NTQxLWE2ZmItMmZhZWI1NmE3MGJjOmI0czg4SUp5WEVGZw==' > command.wav";
                        music = encodeURIComponent(music.trim());
                        music = "Wake%20up!%20Wake%20up!%20Wake%20up!%20Wake%20up!%20Wake%20up!%20Wake%20up!%20Alexa%20Play%20" + music;
                        var fullReq = req + music + tail;
                        shell.exec(fullReq);
                        shell.exec("ffmpeg -i command.wav command.ogg");
                        shell.exec("omxplayer -o hdmi command.ogg");
                        shell.exec("rm command.ogg");
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
