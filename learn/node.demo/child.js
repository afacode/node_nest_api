process.on('message', (msg) => {
    console.log('收到消息:', msg)
})

process.send('我是子进程发送的消息')