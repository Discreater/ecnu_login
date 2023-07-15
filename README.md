# ECNU 校园网定时自动登录

分为[手动登录](#手动登录)以及[定时任务](#定时任务)。手动登录适用于所有平台，定时任务依赖
systemd 仅适用于Linux。

校园网于 2023 年 7 月更新了登录认证方式，原 Shell 脚本方式无法使用，现改为使用
JavaScript 脚本登录.

[Q & A](#q--a)

## 前置要求

- 为了安装以及下载下面的内容，需要联网，可以网页上认证一次，或者通过已联网的设备代理。
- 下载或者 clone 本仓库
  ```shell
  git clone https://github.com/Discreater/ecnu_login.git
  ```
- `Deno`:
  JS/TS的运行时，[安装说明](https://deno.land/manual@v1.35.1/getting_started/installation),
  安装完成后根据提示将deno目录加入环境变量。

## 手动登录

进入 `ecnu_login` 目录

```shell
cd ecnu_login
```

登录认证

```shell
deno run --allow-net --allow-sys ./main.ts <username> <password> [<IP>]
```

把 `<username>` 和 `<password>` 替换为学号以及密码,
`[<IP>]`是可选的，如果不填写则会自动获取IP地址（如果自动获取IP失败请自行填写）。
示例:

```shell
deno run --allow-net --allow-sys ./main.ts 102751012222 123456 172.23.0.123
```

如果成功认证，会输出 `E0000: Login is successful.`； 如果已认证，会输出
`ip already online`。

如果失败，则会输出一大堆错误信息以及可能的
`login error, please check your username and password`。
若确认账号密码无误，可以提个 issue 并提供错误信息。

## 定时任务

**适用于Linux。**

在配置定时任务之前，请手动登录一次，确保可用。

systemd
定时任务方案，需要**保存公共数据库密码**，建议仅在个人服务器上使用自动登录。

1. 完成[手动登录](#手动登录)步骤
2. 修改 `ecnu_login.sh` 文件
   - username 后的 xxx 改为学号
   - password 后的 xxx 改为你的密码
3. 修改 `ecnu_login.service`
   - ExecStart 后的路径为改为 `ecnu_login.sh` 的路径
   - User 后改为你的 Linux 用户名
4. 复制 `ecnu_login.service` 和 `ecnu_login.timer` 到 `/etc/systemd/system/`
   目录下 (sudo 权限)
   ```sh
   sudo cp ecnu_login.service /etc/systemd/system/
   sudo cp ecnu_login.timer /etc/systemd/system/
   ```
5. 启用定时任务
   ```sh
   sudo systemctl start ecnu_login.timer
   sudo systemctl enable ecnu_login.timer
   ```

## Q & A

- 为什么用 JS: 因为新的认证方式用了 sha1、md5、替换了映射表的 base64
  编码，直接从网站上扒加密函数更简单。
- 为什么用 deno 不用 node: 因为 deno 开箱即用，而且自带了 ts
  运行时，不用安装额外的依赖。不过这个脚本对 deno 的依赖不深，很容易切换为
  node。
- 其他语言: 欢迎有兴趣的同学实现，可以参考 [`main.ts`](./main.ts)
  文件中，有任何问题都可以提 issue。理论上都可以接入定时任务。

