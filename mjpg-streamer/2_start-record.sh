cd ~/src/mjpg-streamer/ 
sudo nohup ./mjpg_streamer -i "./input_uvc.so -d /dev/video0  -r 1280x720 -f 12" -o "./output_file.so -f /home/pi/tmp/" &
sudo nohup ./mjpg_streamer -i "./input_file.so -f /home/pi/tmp/" -o "./output_http.so -p 8090 -w ./www" &

