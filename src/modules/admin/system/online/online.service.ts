import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';

import { EntityManager } from 'typeorm';
import { UAParser } from 'ua-parser-js';
import { SysUserService } from '../user/user.service';
import { WSService } from '@/modules/ws/ws.service';
import { WSGateway } from '@/modules/ws/ws.gateway';
import { ApiException } from '@/common/exceptions/api.exception';
import { EVENT_KICK } from '@/modules/ws/ws.constants';
import { OnlineUserInfo } from './online.class';

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
    Logger.log(JSON.stringify(onlineIds), '在线用户ids');

    return await this.findLastLoginInfoList(onlineIds, currentUid);
  }

  // 根据用户id列表查找最近登录信息和用户信息
  async findLastLoginInfoList(ids: number[], currentUid: number): Promise<OnlineUserInfo[]> {
    const rootUserId = await this.userService.findRootUserId();
    const result = await this.entityManager.query(
      `
        SELECT * from sys_login_log 
          INNER JOIN sys_user 
          ON sys_login_log.user_id = sys_user.id
          WHERE sys_login_log.created_at IN (
            SELECT MAX(created_at) as createdAt FROM sys_login_log GROUP BY user_id
          ) AND sys_user.id IN (?)
    `,
      [ids],
    );
    if (result) {
      const parser = new UAParser();
      return result.map((e) => {
        const u = parser.setUA(e.ua).getResult();
        return {
          id: e.id,
          ip: e.ip,
          username: `${e.name}（${e.username}）`,
          isCurrent: currentUid === e.id,
          time: e.created_at,
          os: `${u.os.name} ${u.os.version}`,
          browser: `${u.browser.name} ${u.browser.version}`,
          disable: currentUid === e.id || e.id === rootUserId,
        };
      });
    }
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
