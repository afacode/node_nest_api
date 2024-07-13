import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { In, Repository } from 'typeorm';
import SysRoleMenu from '@/entities/admin/sys_role_menu.entity';
import SysUserRole from '@/entities/admin/sys_user_role.emtity';
import { WSGateway } from './ws.gateway';
import { EVENT_UPDATE_MENU } from './ws.constants';
import { RemoteSocket } from 'socket.io';

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

  /**
   * 通过menuIds通知用户更新权限菜单
   */
  async noticeUserToUpdateMenusByMenuIds(menuIds: number[]): Promise<void> {
    const roleMenus = await this.roleMenuRepository.find({
      where: { menuId: In(menuIds) },
    });
    const roleIds = roleMenus.map((n) => n.roleId);
    await this.noticeUserToUpdateMenusByRoleIds(roleIds);
  }

  /**
   * 通过roleIds通知用户更新权限菜单
   */
  async noticeUserToUpdateMenusByRoleIds(roleIds: number[]): Promise<void> {
    const users = await this.userRoleRepository.find({
      where: { roleId: In(roleIds) },
    });
    if (users) {
      const userIds = users.map((n) => n.userId);
      await this.noticeUserToUpdateMenusByUserIds(userIds);
    }
  }

  
  /**
   * 通知前端重新获取权限菜单
   * @param userIds
   * @constructor
   */
  async noticeUserToUpdateMenusByUserIds(uid: number | number[]) {
    const userIds = Array.isArray(uid) ? uid : [uid];
    const sockets = await this.filterSocketIdByUidArr(userIds);
    if (sockets) {
      // socket emit event
      this.wsGateWay.socketServer
        .to(sockets.map((n) => n.id))
        .emit(EVENT_UPDATE_MENU);
    }
  }

  /**
   * 根据uid数组过滤出socketid
   */
  async filterSocketIdByUidArr(
    uids: number[],
  ): Promise<RemoteSocket<unknown, unknown>[]> {
    const onlineSockets = await this.getOnlineSockets();
    const sockets = onlineSockets.filter((socket) => {
      const token = socket.handshake.query?.token as string;
      const tokenUid = this.jwtService.verify(token).uid;
      return uids.includes(tokenUid);
    });
    return sockets;
  }
  // 后续一些消息通知等
}
