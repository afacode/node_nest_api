import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EVENT_OFFLINE, EVENT_ONLINE } from './ws.constants';
import { AuthService } from './auth.service';

/**
 * WebSokcet网关，不含权限校验，Socket端只做通知相关操作
 * 第一个参数可以传递一个端口号，如果不传默认和http监听的端口一样
 */
@WebSocketGateway(3001, {
  namespace: 'admin',
  path: '/ws-api',
  cors: {
    orign: '*',
  },
})
export class WSGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  private wss: Server;

  get socketServer(): Server {
    return this.wss;
  }

  constructor(private authService: AuthService) {}
  /**
   * 当 WebSocket Gateway 初始化完成时
   * OnGatewayInit 强制执行afterInit()方法
   */
  afterInit() {
    // this.wss.emit('wssConnect', 'success');
  }

  /**
   * OnGatewayConnection 强制执行handleConnection()
   * @param socket
   * 上线广播
   */
  async handleConnection(socket: Socket) {
    try {
      // 登陆成功后广播
      this.authService.checkUserAuthToken(socket?.handshake?.query?.token);
    } catch (error) {
      socket.disconnect();
    }
    socket.broadcast.emit(EVENT_ONLINE);
  }

  /**
   * OnGatewayDisconnect 强制执行handleDisconnect()
   * @param socket
   *  下线广播
   */
  async handleDisconnect(socket: Socket) {
    socket.broadcast.emit(EVENT_OFFLINE);
  }
}
