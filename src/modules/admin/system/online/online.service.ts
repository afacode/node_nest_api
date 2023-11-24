import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';

import { EntityManager } from 'typeorm';
// import { UAParser } from 'ua-parser-js';
import { SysUserService } from '../user/user.service';
import { WSService } from '@/modules/ws/ws.service';
import { WSGateway } from '@/modules/ws/ws.gateway';
import { ApiException } from '@/common/exceptions/api.exception';
import { EVENT_KICK } from '@/modules/ws/ws.constants';

@Injectable()
export class SysOnlineService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    private userService: SysUserService,
    private jwtService: JwtService,
    private wsService: WSService,
    private wsGateWay: WSGateway,
  ) {}

  async listOnlineUser(currentUid: number) {
    const onlineSockets = await this.wsService.getOnlineSockets();
    if (!onlineSockets || onlineSockets.length <= 0) {
      return [];
    }

    const onlineIds = onlineSockets.map((socket) => {
      const token = socket.handshake.query?.token as string;
      return this.jwtService.verify(token).uid;
    });
    console.log(onlineIds, 'online onlineIds');

    // todo
    return [];
  }

  async kickUser(uid: number, currentUid: number): Promise<void> {
    const rootUserId = await this.userService.findRootUserId();
    if (uid === rootUserId) {
      throw new ApiException(10013);
    }
    const currentUserInfo = await this.userService.getAccountInfo(currentUid);
    // 先把用户redis内容删除todo
    const socket = await this.wsService.findSocketIdByUid(uid);
    this.wsGateWay.socketServer.to(socket.id).emit(EVENT_KICK, {
      operater: currentUserInfo.name,
    });

    socket.disconnect();
  }
}
