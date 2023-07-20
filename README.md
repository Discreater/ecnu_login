# ECNU 校园网定时自动登录

![version](https://img.shields.io/badge/version-v2.0-blue)

仅适用于Linux。

校园网于 2023 年 7 月更新了登录认证方式（深澜认证计费系统v5.0.8）。
- v1.0 使用 JS 脚本登录。
- v2.0 使用信息办提供的登录脚本。
  > 若不信任该程序，可使用 [v1.0](https://github.com/Discreater/ecnu_login/tree/v1.0) 脚本。

新认证方式似乎在 20 分钟没有流量传输之后就会自动断开。

下载或者 clone 本仓库
```shell
git clone https://github.com/Discreater/ecnu_login.git
```

进入 `ecnu_login` 目录

```shell
cd ecnu_login
```

安装
```shell
chmod +x ./install.sh
./install.sh
```
根据提示输入账号密码，其中需要使用到 sudo 权限以启用定时任务自动登录，账号密码会保存在 ecnu_login目录下的 `.env` 文件中。

定时任务每 20 分钟检测一次，如果已经登录则不会重复登录。

