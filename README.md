# ECNU network login script

1. clone或下载所有文件。
2. 修改 `ecnu_login.sh` 文件
   - username 后的 xxx 改为学号
   - password 后的 xxx 改为你的密码
3. 保存 `ecnu_login.sh` 到用户目录下： `/home/username/ecnu_loing.sh` (或其他目录）
4. 修改 `ecnu_login.service` 中的 ExecStart 后的路径为你存放 ecnu_login.sh 的路径
5. 复制 `ecnu_login.service` 和 `ecnu_login.timer` 到 `/etc/systemd/system/` 目录下 (sudo 权限）
   ```sh
   sudo cp ecnu_login.service /etc/systemd/system/
   sudo cp ecnu_login.timer /etc/systemd/system/
   ```
6. 启用定时任务
   ```sh
   sudo systemctl start ecnu_login.timer
   sudo systemctl enable ecnu_login.timer
   ```
