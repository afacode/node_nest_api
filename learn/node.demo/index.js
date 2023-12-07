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


const childProcess = fork('./child.js')

childProcess.send('我是主进城发送的消息')

childProcess.on('message', (msg) => {
    console.log('主进程收到消息:', msg)
})