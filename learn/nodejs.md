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

## process

[process](https://nodejs.cn/api/process.html)

```js
node index.js afa=12 aa=222

process.argv
[
  '/Users/afacode/.nvm/versions/node/v18.18.0/bin/node',
  '/Users/afacode/node_nest_api/learn/node.demo/index.js',
  'afa=12',
  'aa=222'
]

// ESM 模式下永不了__dirname
process.cwd() === __dirname

// 返回描述 Node.js 进程的内存使用量（以字节为单位）的对象
process.memoryUsage()

{
  rss: 33710080,
  heapTotal: 6168576,
  heapUsed: 5428848,
  external: 427258,
  arrayBuffers: 17678
}

// pid 
process.kill(process.pid)

process.exit()
process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});

// 返回包含用户环境的对象 所有， 修改只会在当前进程生效不会修改系统环境
process.env





```







## bilibili download
[bilibili](https://github.com/Youky1/bilibili-save-nodejs.git)