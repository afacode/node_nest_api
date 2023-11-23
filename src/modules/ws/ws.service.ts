import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { In, Repository } from 'typeorm';
import SysRoleMenu from '@/entities/admin/sys_role_menu.entity';
import SysUserRole from '@/entities/admin/sys_user_role.emtity';
import { WSGateway } from './ws.gateway';

@Injectable()
export class WSService {
  constructor(
    private jwtService: JwtService,

    @InjectRepository(SysRoleMenu)
    private roleMenuRepository: Repository<SysRoleMenu>,

    @InjectRepository(SysUserRole)
    private userRoleRepository: Repository<SysUserRole>,

    private wsGateWay: WSGateway,
  ) {}

  //   获取当前在线用户
  async getOnlineSockets() {
    const onlineSockets = await this.wsGateWay.socketServer.fetchSockets();
    return onlineSockets;
  }

  // 根据uid查找socketid
  async findSocketIdByUid(uid: number) {
    const onlineSockets = await this.getOnlineSockets();
    const socket = onlineSockets.find((socket) => {
      const token = socket.handshake.query?.token as string;
      const tokenUid = this.jwtService.verify(token).uid;
      return tokenUid === uid;
    });
    return socket;
  }

  // 后续一些消息通知等
}
