#!/bin/sh
login() {
        username=xxxxx
	password='xxxxxx'
        curl -X POST https://login.ecnu.edu.cn/include/auth_action.php -H "Content-Type: application/x-www-form-urlencoded" -d "action=login&username=$username&password=$password&ac_id=1&save_me=0&ajax=1" --ciphers 'DEFAULT:!DH'
}

ping -c 1 www.bilibili.com > /dev/null 2>&1
if [ $? -eq 0 ];then
	echo "Network ok"
else
	login
fi
