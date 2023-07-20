#!/bin/sh
if [ -f ./.env ]
then
  source ./.env
fi

ping -c 1 www.bilibili.com > /dev/null 2>&1
if [ $? -eq 0 ];then
	echo "Already connected to the Internet."
else
	echo "login..."
	./auth_client -u $ACCOUNT -p $PASSWORD
fi
