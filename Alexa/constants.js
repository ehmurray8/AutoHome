/jshint esversion: 6 */

/* Intent Names
 */
const CHAN_INTENT = "TVChannelIntent";
const VOL_INTENT = "TVVolumeIntent";
const SOCK_INTENT = "SocketIntent";
const INPUT_INTENT = "TVInputIntent";
const KEY_INTENT = "TVKeyIntent";
const LIGHTS_INTENT = "LightsIntent";
const SLEEP_INTENT = "SleepIntent";

/*
 * General Output
 */ 
const REPROMPT = "Speak a command.";

/*
 * Welcome Response
 */
const WEL_TITLE = "Welcome";
const WEL_SPEECH_OUT = "Welcome to Auto Home, how can I help?";  
const WEL_REPROMPT = REPROMPT;

/*
 * End Response
 */
const END_TITLE = "Session Ended";
const END_SPEECH_OUT = "Task Completed";

/*
 * JSON Response Keys
 */ 
const FUNC_KEY = "Function Name";
const DIR_KEY = "Direction";
const NUM_KEY = "Number";
const SOCK_TYPE_KEY = "Socket Type";
const SOCK_STATE_KEY = "Socket State";
const CHAN_NUM_KEY = "Channel Number";

/*
 * JSON Function names
 */
const SOCK_FUNC = "Socket";
const CHAN_FUNC = "Channel";
const VOL_FUNC = "Volume";
const INPUT_FUNC = "Input";
const KEY_FUNC = "Key";
const LIGHTS_FUNC = "Lights";
const SLEEP_FUNC = "Sleep";

/*
 * Other JSON
 */ 
const TV_SOCKET = "TV";


module.exports = {
    CHAN_INTENT: CHAN_INTENT,
    VOL_INTENT: VOL_INTENT,
    SOCK_INTENT: SOCK_INTENT,
    INPUT_INTENT: INPUT_INTENT,
    KEY_INTENT: KEY_INTENT,
    LIGHTS_INTENT: LIGHTS_INTENT,
    SLEEP_INTENT: SLEEP_INTENT,
    REPROMPT: REPROMPT,            
    WEL_TITLE: WEL_TITLE,
    WEL_SPEECH_OUT: WEL_SPEECH_OUT,    
    WEL_REPROMPT: WEL_REPROMPT,
    END_TITLE: END_TITLE,
    END_SPEECH_OUT: END_SPEECH_OUT,
    FUNC_KEY: FUNC_KEY,
    DIR_KEY: DIR_KEY,
    NUM_KEY: NUM_KEY,
    SOCK_TYPE_KEY: SOCK_TYPE_KEY,
    SOCK_STATE_KEY: SOCK_STATE_KEY,
    CHAN_NUM_KEY: CHAN_NUM_KEY,
    SOCK_FUNC: SOCK_FUNC,
    CHAN_FUNC: CHAN_FUNC,
    VOL_FUNC: VOL_FUNC,
    INPUT_FUNC: INPUT_FUNC,
    KEY_FUNC: KEY_FUNC,
    LIGHTS_FUNC: LIGHTS_FUNC,
    SLEEP_FUNC: SLEEP_FUNC,
    TV_SOCKET: TV_SOCKET,
};
