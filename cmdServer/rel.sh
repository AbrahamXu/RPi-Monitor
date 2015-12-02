#!/bin/sh
#

#sudo apt-get update
#sudo apt-get install -y python-dev python-pip
#sudo pip install rpi.gpio

PORT=25

PIN_EX=/sys/class/gpio/export
PIN_UNEX=/sys/class/gpio/unexport
PIN=/sys/class/gpio/gpio$PORT

mode=$1
if [ "$mode" = "on" ] ; then
    if [ -d $PIN ] ; then
        echo "Port already on"
        exit 0
    fi

    sudo /bin/sh -c "echo $PORT > $PIN_EX "
    sudo /bin/sh -c "echo out > $PIN/direction "
    sudo /bin/sh -c "echo 1 > $PIN/value "
else
    if [ ! -d $PIN ] ; then
        echo "Port not turned on"
        exit 0
    fi

    sudo /bin/sh -c "echo 0 > $PIN/value "
    sudo /bin/sh -c "echo $PORT > $PIN_UNEX "
fi

exit 0
