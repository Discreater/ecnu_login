#!/bin/bash
before_dir=`pwd`

cd "$(dirname "$0")"

read -p "Username: " account
read -s -p "Password: " password
echo ""

wd=`pwd`

chmod +x ./auth_client
cp .auth-setting $HOME

# logout and relogin to check account and password.
logout_results=`./auth_client -u $account auth --logout 2>&1`
if [[ $login_results =~ "error" ]]; then
    echo "Logout failed"
    exit -1
else
    echo "Logout success"
fi
login_results=`./auth_client -u $account -p $password 2>&1`
if [[ $login_results =~ "error" ]]; then
    echo "Login failed"
    exit -1
else
    echo "Login success"
fi

rm -f .env
echo "ACCOUNT=$account" >> .env
echo "PASSWORD=$password" >> .env

cp ecnu_login.service.template ecnu_login.service
wd=$wd envsubst < ecnu_login.service.template > ecnu_login.service

sudo cp ./ecnu_login.service /etc/systemd/system/
sudo cp ./ecnu_login.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now ecnu_login.timer

cd $before_dir