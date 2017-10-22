# AutoHome
Home automation using Raspberry Pi, Ably and Amazon Alexa.

The project uses an Amazon Alexa skill to receive voice commands, the Alexa skills publishes messages to an Ably channel, and the Raspberry Pi is running a nodejs script listening for messages on the channel. The Raspberry pi listener script handles the messages and calls bash scripts to send IR signals to the TV using lirc, or sends RF signals using codesend to control IR sockets. The Alexa directory contains the code for the Alexa skill, and the skill config information. The rpi_scripts directory contains the bash scripts, and the nodejs listener script.

This project requires...
Accounts/Keys: an IBM Watson API key, an Ably key, an Amazon developer account, an Alexa account, and an AWS account
Hardware: Amazon Alexa, RF sockets, IR light, Raspberry Pi, and either soldering equipment or a bread board to configure the circuit
Configuration: Need to clone this repo for sending RF: https://github.com/ninjablocks/433Utils, follow these instructions for setting up lirc to send IR codes http://www.lirc.org/git.html, and then the proper gpio pins have to be configured to properly use lirc, and codesend. This tutorial contains instructions for setting up lirc http://alexba.in/blog/2013/01/06/setting-up-lirc-on-the-raspberrypi/, and run 433Utils/RPiUtils/RFSniffer to receive the RF codes.
