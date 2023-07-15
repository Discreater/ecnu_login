#!/bin/sh
login() {
	username=xxxxx
	password='xxxxxx'
	/home/path/to/deno run --allow-net --allow-sys ./main.ts $username $password
}

ping -c 1 www.bilibili.com > /dev/null 2>&1
if [ $? -eq 0 ];then
	echo "Already connected to the Internet."
else
	login
fi
