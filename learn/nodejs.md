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

## EventEmitter events

[events](https://nodejs.cn/api/events.html)

```js
// 发布订阅模式
const EventEmitter = require('node:events')
const bus = new EventEmitter()
// 默认监听10个
bus.setMaxListeners(20)

bus.emit('count', 10)

bus.on('count', (msg) => {
    console.log(msg)
})
bus.on('count', (msg) => {
    console.log(msg)
})
bus.on('count', (msg) => {
    console.log(msg)
})
bus.on('count', (msg) => {
    console.log(msg)
})
bus.off('count')

bus.once('count', () => {})
```

## util

[util](https://nodejs.cn/api/util.html)

```js

```

## fs

[fs](https://nodejs.cn/api/fs.html)

```js
const fs = require('node:fs');
const fsPromise = require('node:fs/promises');

// 读文件
// 异步  同步  promise  stream
fs.readFile('./child.js', {
    encoding: 'utf-8',
    flag: 'r',
}, (err, data) => {
    // Buffer
})

const data = fs.readFileSync('./child.js')

fsPromise.readFile('./child.js').then(result => {
    console.log(result.toString('utf-8'))
})

// 读取大文件
const readStream = fs.createReadStream('./child.js')
readStream.on('data', (chunk) => {
    console.log(chunk.toString())
})
readStream.on('end', () => {
    console.log('end')
})

// =============
recursive 多层，多个
fs.mkdirSync('./test/demo', {recursive: true})
fs.renameSync('./test', './test2')
fs.rmSync('./test2', {recursive: true})

fs.watch('./child.js', (event, fileName) => {
    console.log(event, fileName)
})


// 写文件
fs.writeFileSync('./write.txt', 'dddddd append \n', {
    flag: 'a', //append
})
fs.appendFileSync('./write.txt', 'appendFileSync \n')

// 大量数据分批插入
const writeStream = fs.createWriteStream('./write.txt')
const text = [
    '如果为 true，则执行递归删除。',
    '在递归模式下，操作将在失败时重试',
    '异步地删除文件和目录',
] 

text.forEach(item => {
    writeStream.write(item+'\n')
})
writeStream.end()

writeStream.on('finish', () => {
    console.log('writeStream finish')
})


// 软连接 与 硬连接
// 硬连接 共享文件， 备份文件
fs.linkSync('./write.txt', './write2.txt')
// 软连接 类似快捷方式
fs.symlinkSync('./write.txt', './write3.txt')


```



## pngquant

```js

```

## 短链
[shortUrl源码](https://github.com/afacode/node_nest_api/blob/master/src/modules/general/shortUrl/shortUrl.controller.ts)



## markdown转html

[juejin](https://juejin.cn/post/7310787455112445987)

```




```






## bilibili download
[bilibili](https://github.com/Youky1/bilibili-save-nodejs.git)

## nestjs email 发送

[nest-modules/mailer](https://github.com/nest-modules/mailer)

## typeorm

### 使用Exclude()来隐藏数据

```js
@Exclude()
password: string;
```



