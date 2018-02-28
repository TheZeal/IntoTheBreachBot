#!/bin/bash

sudo -u zeal ./redeploy.sh
echo "RESTART OF bot SERVICE"
systemctl restart into-the-breach-bot.service

