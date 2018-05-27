#!/bin/bash

PATH=/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/sbin:/usr/local/bin

host=`/bin/hostname -I`
if [[ $host =~ 10.0.0.* ]]; then
    /sbin/route add default gw 10.0.0.1
fi

exit 1
