#!/bin/sh
#

pattern="\s([0-9])+\.([0-9])+\.([0-9])+\.([0-9])+\s"
str=$(curl http://ipseeker.cn/)
myip=$(echo $str | grep -o -P $pattern)
myip=$(echo $myip | tr -d " \r\n\t")
echo "WAN IP Address: \"$myip\""

exit 0
