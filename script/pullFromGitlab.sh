#!/bin/bash
time=$(date '+%Y-%m-%d %H:%M')
echo $time
cd /var/www/data/answer/
sudo -u www-data git pull origin master
