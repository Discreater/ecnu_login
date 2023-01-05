# ECNU 校园网定时自动登录

**适用于Linux。**

systemd 定时任务方案，需要**保存公共数据库密码**，建议仅在个人服务器上使用自动登录。

1. clone或下载所有文件
2. 修改 `ecnu_login.sh` 文件
   - username 后的 xxx 改为学号
   - password 后的 xxx 改为你的密码
3. 保存 `ecnu_login.sh` 到用户目录下： `/home/username/ecnu_loing.sh` (或其他目录）
4. 修改 `ecnu_login.service`
   - ExecStart 后的路径为你存放 `ecnu_login.sh` 的路径
   - User 后改为你的 Linux 用户名
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
