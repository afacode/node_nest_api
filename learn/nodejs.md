## global API

```js
__dirname
__filename
Buffer
process

global.xxxx
globalThis.xxx   es2020支持
```



## path

[path doc](https://nodejs.cn/api/path.html)

```js
path.posix.basename('/tmp/myfile.html');
path.win32.basename('C:\\temp\\myfile.html');
path.basename('/tmp/myfile.html');

path.dirname('/tmp/myfile.html');

path.extname('/tmp/myfile.html');

path.join('/a', '/b');

path.resolve('/a', '/b'); // 解析为绝对路径 
// 都是绝对路径，返回最后一个
// 一个相对路径，返回当前工作路径据对路径
// 一个相对 一个绝对。返回 绝对 + 相对拼接
path.resolve(__dirname, './index.html');

path.parse('/home/user/dir/file.txt');
{ 
  root: '/',
  dir: '/home/user/dir',
  base: 'file.txt',
  ext: '.txt',
  name: 'file' 
} 

path.format({ 
  root: '/',
  dir: '/home/user/dir',
  base: 'file.txt',
  ext: '.txt',
  name: 'file' 
})

path.sep
// 提供特定于平台的路径片段分隔符：
// Windows 上是 \
// POSIX 上是 /

```

## os

[os doc](https://nodejs.cn/api/os.html)

```js
os.homedir();// 返回当前用户的主目录的字符串路径
// POSIX $HOME  win %USERPROFILE%

os.hostname(); // 以字符串形式返回操作系统的主机名
// private.local

os.arch();
// 返回为其编译 Node.js 二进制文件的操作系统 CPU 架构

os.cpus();

os.networkInterfaces(); // 返回包含已分配网络地址的网络接口的对象

```

