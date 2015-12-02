#!/bin/sh
#

# Set up for mjpg-streamer
#

#LINUX_VER=$(uname -r)
#sudo apt-get install linux-headers-$LINUX_VER

# for gcc make gdb libc 
sudo apt-get install build-essential -y

# dependencies
sudo apt-get install -y subversion libv4l-dev libjpeg8-dev libmath++-dev imagemagick

cd $HOME/Downloads

# get loatest mjpeg-streamer 178 ?
svn co https://mjpg-streamer.svn.sourceforge.net/svnroot/mjpg-streamer/mjpg-streamer

cd mjpg-streamer
make USE_LIBV4L2=true clean all

# install to /usr/local
sudo mv mjpg-streamer /usr/local

export LD_LIBRARY_PATH=.
#./start.sh
#./mjpg_streamer -o "output_http.so -w ./www"