import { md5 } from "./md5.js";
import { sha1 } from "./js-sha1.js";

const DOMAIN = "";

const PROTOCOL = "https:";
const HOST = "login.ecnu.edu.cn";

const TOKEN_API = "/cgi-bin/get_challenge";
const AUTH_API = "/cgi-bin/srun_portal";

if (Deno.args.length < 2) {
  await loginAccount(Deno.args[0], Deno.args[1]);
} else {
  await loginAccount(Deno.args[0], Deno.args[1], Deno.args[2]);
}

async function loginAccount(username: string, password: string, ip = getIP()) {
  if (ip === "") {
    Deno.exit(-1);
  }
  // 加密常量
  const type = 1;
  const n = 200;
  const enc = "srun_bx1";

  // 用户信息
  const ac_id = "1"; // ?

  const ipv4 = HOST;
  const ipv6 = "";
  const nowType = "ipv4";

  // 与原代码保持一致，以便后期维护
  const host = nowType === "ipv4" ? ipv4 : ipv6;

  const token = await getToken(username + DOMAIN, host, ip);

  const hmd5 = md5(password, token);

  const i = encodeUserInfo({
    username,
    password,
    ip,
    acid: ac_id,
    enc_ver: enc,
  }, token);

  let str = token + username;
  str += token + hmd5;
  str += token + ac_id;
  str += token + ip;
  str += token + n;
  str += token + type;
  str += token + i;

  const res = await jsonp({
    host,
    url: AUTH_API,
    params: {
      action: "login",
      username,
      password: "{MD5}" + hmd5, // 另外还有OTP选项
      os: "Windows 10",
      name: "Windows",
      double_stack: "0",
      chksum: sha1(str),
      info: i,
      ac_id,
      ip,
      n: n.toString(),
      type: type.toString(),
    },
  }) as any;
  if (res.suc_msg === "ip_already_online_error") {
    console.error("ip already online");
    return;
  }
  if (res.error === "login_error") {
    console.error(JSON.stringify(res));
    console.error("login error, please check your username and password");
    return;
  }
  if (res.ploy_msg) {
    console.log(res.ploy_msg);
  } else {
    console.error("unknown error:");
    console.error(JSON.stringify(res));
  }
}

async function getToken(
  username: string,
  host: string,
  ip: string,
): Promise<string> {
  const data = await jsonp<{
    challenge: string; // Token
    client_ip: string;
    ecode: number;
    error: string;
    error_msg: string;
    expire: number;
    online_ip: string;
    res: string;
    srun_ver: string;
    st: number; // time stamp
  }>({
    host,
    url: TOKEN_API,
    params: {
      username,
      ip,
    },
  });
  return data.challenge;
}

interface GetObj {
  host?: string; // "login.ecnu.edu.cn"
  params: Record<string, string>;
  url: string; // "/cgi-bin/get_challenge"
  type?: "GET" | "POST";
  dataType?: "jsonp";
  pact?: string;
  port?: string;
}

async function jsonp<T = unknown>(obj: GetObj): Promise<T> {
  obj.type = "GET";
  obj.dataType = "jsonp";

  const data = await get<T>(obj);
  return data;
}

async function get<T>(obj: GetObj): Promise<T> {
  function randomCallbackName() {
    const numChars = "0123456789";
    const len = 18;
    const nums = Array.from(
      { length: len },
      () => numChars[Math.floor(Math.random() * numChars.length)],
    );

    const res = "jQuery112" + nums.join("") + "_" + Date.now();
    return res;
  }

  const pact = obj.pact ?? PROTOCOL;
  const host = obj.host ?? HOST;
  const port = obj.port ?? "";
  const url = "".concat(pact, "//").concat(host).concat(port).concat(obj.url);

  const headers = {
    Accept:
      "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language":
      "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Cookie": "lang=zh-CN",
    "Referer": "https://login.ecnu.edu.cn/srun_portal_pc?ac_id=1&theme=pro",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
    "X-Requested-With": "XMLHttpRequest",
  };
  const callbackName = randomCallbackName();
  const callbackDefine = `function ${callbackName}(data) {return data;}`;
  if (obj.dataType === "jsonp") {
    obj.params = {
      callback: callbackName,
      ...obj.params,
    };
  }
  let params = "";
  for (const key in obj.params) {
    let param = obj.params[key];
    if (typeof param !== "string") {
      param = JSON.stringify(param);
    }
    param = encodeURIComponent(param);
    params += `${key}=${param}&`;
  }
  params += `_=${Date.now().toString()}`;
  const paramedUrl = url.concat("?").concat(params);

  const resp = await fetch(paramedUrl, {
    headers,
    method: obj.type,
  });
  let data = await resp.text();
  if (obj.dataType === "jsonp") {
    data = eval(`${callbackDefine} ${data}`);
  }
  return data as T;
}

function encodeUserInfo(info: {
  username: string;
  password: string;
  ip: string;
  acid: string;
  enc_ver: string;
}, token: string) {
  const sInfo = JSON.stringify(info);

  function encode(str: string, key: string): string {
    if (str === "") return "";
    const v = s(str, true);
    const k = s(key, false);
    if (k.length < 4) k.length = 4;
    let n = v.length - 1,
      z = v[n],
      y = v[0],
      c = 0x86014019 | 0x183639A0,
      m,
      e,
      p,
      q = Math.floor(6 + 52 / (n + 1)),
      d = 0;

    while (0 < q--) {
      d = d + c & (0x8CE0D9BF | 0x731F2640);
      e = d >>> 2 & 3;

      for (p = 0; p < n; p++) {
        y = v[p + 1];
        m = z >>> 5 ^ y << 2;
        m += y >>> 3 ^ z << 4 ^ (d ^ y);
        m += k[p & 3 ^ e] ^ z;
        z = v[p] = v[p] + m & (0xEFB8D130 | 0x10472ECF);
      }

      y = v[0];
      m = z >>> 5 ^ y << 2;
      m += y >>> 3 ^ z << 4 ^ (d ^ y);
      m += k[p & 3 ^ e] ^ z;
      z = v[n] = v[n] + m & (0xBB390742 | 0x44C6F8BD);
    }

    return l(v, false);
  }

  function s(a: string, b: boolean) {
    const c = a.length;
    const v = [];

    for (let i = 0; i < c; i += 4) {
      v[i >> 2] = a.charCodeAt(i) | a.charCodeAt(i + 1) << 8 |
        a.charCodeAt(i + 2) << 16 | a.charCodeAt(i + 3) << 24;
    }

    if (b) v[v.length] = c;
    return v;
  }

  function l(a: number[], b: boolean): string {
    let d = a.length;
    let c = d - 1 << 2;

    if (b) {
      let m = a[d - 1];
      if (m < c - 3 || m > c) return "";
      c = m;
    }
    const as = [];
    for (let i = 0; i < d; i++) {
      as[i] = String.fromCharCode(
        a[i] & 0xff,
        a[i] >>> 8 & 0xff,
        a[i] >>> 16 & 0xff,
        a[i] >>> 24 & 0xff,
      );
    }

    return b ? as.join("").substring(0, c) : as.join("");
  }

  const encoded = btoa(encode(sInfo, token));
  function convert(b: string, alpha: string) {
    const raw =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const bBuffer = b.split("");
    for (let i = 0; i < b.length; i++) {
      if (raw.includes(bBuffer[i])) {
        bBuffer[i] = alpha[raw.indexOf(bBuffer[i])];
      }
    }
    return bBuffer.join("");
  }
  // TODO ALPHA是否会变?
  const ALPHA =
    "LVoJPiCN2R8G90yg+hmFHuacZ1OWMnrsSTXkYpUq/3dlbfKwv6xztjI7DeBE45QA";
  return "{SRBX1}" + convert(encoded, ALPHA);
}

function getIP() {
  const interfaces = Deno.networkInterfaces();
  const ipLists = [];
  for (const face of interfaces) {
    if (face.family === "IPv4") {
      // 应该有更好的检查方法，或者遍历登录...
      if (face.cidr.startsWith("172")) {
        console.info(`ip: ${face.address}`);
        return face.address;
      }
      ipLists.push(face.address);
    }
  }
  console.error("Cannot get ip, please specify ip manually");
  console.error("Avaliable ip list: " + ipLists.join(", "));
  return "";
}
