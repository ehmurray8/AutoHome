#!/bin/bash
node /home/pi/AutoHome/rpi_scripts/auto_home_msg_handler.js &
node /home/pi/AutoHome/rpi_scripts/awake_handler.js > ~/AutoHome/rpi_scripts/logs/awake_handler
