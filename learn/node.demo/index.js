const os = require('node:os');
const process = require('node:process');
const { exec, execSync, spawn, spawnSync, execFile, execFileSync, fork } = require('node:child_process');



// console.log(os.hostname())
// console.log(os.homedir())
// console.log(os.arch())
// console.log(os.cpus().length)
// console.log(os.networkInterfaces())

// console.log(process.platform)
// console.log(process.argv)
// console.log(process.cwd())
// console.log(process.memoryUsage());

// process.exit()
// process.on('exit', (code) => {
//   console.log(`About to exit with code: ${code}`);
// });
// process.kill(process.pid)

// console.log(process.env)



// Buffer
// exec('node -v', (err, stdout, stderr) => {
//     if (err) {
//         return err
//     }
//     console.log(stdout.toString())
// })

// const nodeVersion = execSync('node -v')


// execSync('mkdir demoDir')
// execSync('open chrome https://www.baidu.com')

// const ls = spawn('ls', ['-lh', '/usr']);

// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// ls.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`);
// });

// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// }); 


// const childProcess = fork('./child.js')

// childProcess.send('我是主进城发送的消息')

// childProcess.on('message', (msg) => {
//     console.log('主进程收到消息:', msg)
// })

// 发布订阅模式
const EventEmitter = require('node:events')
// const bus = new EventEmitter()
// // 默认监听10个
// bus.setMaxListeners(20)

// bus.emit('count', 10)

// bus.on('count', (msg) => {
//     console.log(msg)
// })
// bus.on('count', (msg) => {
//     console.log(msg)
// })
// bus.on('count', (msg) => {
//     console.log(msg)
// })
// bus.on('count', (msg) => {
//     console.log(msg)
// })
// bus.off('count')

// bus.once('count', () => {})


const fs = require('node:fs');
const fsPromise = require('node:fs/promises');

// 读文件
// 异步  同步  promise
// fs.readFile('./child.js', {
//     encoding: 'utf-8',
//     flag: 'r',
// }, (err, data) => {
//     // Buffer
// })

// const data = fs.readFileSync('./child.js')

// fsPromise.readFile('./child.js').then(result => {
//     console.log(result.toString('utf-8'))
// })

// const readStream = fs.createReadStream('./child.js')

// readStream.on('data', (chunk) => {
//     console.log(chunk.toString())
// })

// readStream.on('end', () => {
//     console.log('end')
// })

// fs.mkdirSync('./test/demo', {recursive: true})

// fs.renameSync('./test', './test2')

// fs.rmSync('./test2', {recursive: true})

// fs.watch('./child.js', (event, fileName) => {
//     console.log(event, fileName)
// })

// 写文件

// fs.writeFileSync('./write.txt', 'dddddd append \n', {
//     flag: 'a', //append
// })
// fs.appendFileSync('./write.txt', 'appendFileSync \n')

// 大量数据分批插入

// const writeStream = fs.createWriteStream('./write.txt')
// const text = [
//     '如果为 true，则执行递归删除。',
//     '在递归模式下，操作将在失败时重试',
//     '异步地删除文件和目录',
// ] 

// text.forEach(item => {
//     writeStream.write(item+'\n')
// })
// writeStream.end()

// writeStream.on('finish', () => {
//     console.log('writeStream finish')
// })

// 软连接 与 硬连接
// 硬连接 共享文件， 备份文件
// fs.linkSync('./write.txt', './write2.txt')
// 软连接 类似快捷方式
// fs.symlinkSync('./write.txt', './write3.txt')