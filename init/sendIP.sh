#!/bin/bash
#

BASE_DIR="$( cd "$( dirname $0 )" && pwd )"
echo $BASE_DIR

pattern="\s([0-9])+\.([0-9])+\.([0-9])+\.([0-9])+\s"
str=$(curl http://ipseeker.cn/)
myip=$(echo $str | grep -o -P $pattern)
myip=$(echo $myip | tr -d " \r\n\t")
echo "WAN IP Address: \"$myip\""

#echo python "$BASE_DIR/sendMail.py" --subject "RPi" --body "$myip"
python "$BASE_DIR/sendMail.py" --subject "RPi" --body "$myip"
