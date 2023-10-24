import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'

// 第一个参数可以传递一个端口号，如果不传默认和http监听的端口一样
@WebSocketGateway({
  cors: {
    orign: '*'
  }
})
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  currentUsers = 0;

  // 当 WebSocket Gateway 初始化完成时，我们向所有客户端广播当前的用户人数。
  afterInit() {
    this.server.emit('usersCount', this.currentUsers);
  }

  // 当有新的 WebSocket 连接时，我们增加当前用户人数并广播更新。
  handleConnection(socket: Socket) {
    this.incrementUsersCount();
    console.log('handleConnection', this.currentUsers)
    this.server.emit('usersCount', this.currentUsers);
  }
  // 当 WebSocket 连接断开时，我们减少当前用户人数并广播更新。
  handleDisconnect(socket: Socket) {
    this.decrementUsersCount();
    this.server.emit('usersCount', this.currentUsers);
  }

  incrementUsersCount() {
    this.currentUsers++;
  }

  decrementUsersCount() {
    this.currentUsers--;
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data, @ConnectedSocket() client: Socket) {
    console.log(data, 'message 实现发布消息');
    // client.emit('实现发布消息')
    this.server.emit('onMessage', {
      msg: '实现发布消息',
      content: data
    })
  }
}
