/*jshint esversion: 6 */

/* Intent Names
 */
const CHAN_INTENT = "TVChannelIntent";
const VOL_INTENT = "TVVolumeIntent";
const SOCK_INTENT = "SocketIntent";
const INPUT_INTENT = "TVInputIntent";
const KEY_INTENT = "TVKeyIntent";

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

/*
 * Other JSON
 */ 
const TV_SOCKET = "TV";

/*
 * PubNub 
 */
const PUBNUB_KEY = "pub-c-7e9eb7ff-6ec8-4486-b03f-e0f68291b14c";
const PUBNUB_CHANNEL = "auto_home";
