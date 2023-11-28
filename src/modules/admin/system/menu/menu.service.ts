import SysMenu from '@/entities/admin/sys_menu.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { concat, includes, isEmpty, uniq } from 'lodash';
import { IsNull, Not, Repository } from 'typeorm';
import { SysRoleService } from '../role/role.service';
import { ROOT_ROLE_ID } from '../../admin.constants';
import { MenuItemAndParentInfoResult } from './menu.class';
import { WSService } from '@/modules/ws/ws.service';
import { CreateMenuDto } from './menu.dto';
import { ApiException } from '@/common/exceptions/api.exception';
import { RedisService } from '@/shared/redis/redis.service';

@Injectable()
export class SysMenuService {
  constructor(
    @InjectRepository(SysMenu) private menuRepository: Repository<SysMenu>,
    @Inject(ROOT_ROLE_ID) private rootRoleId: number,
    private roleService: SysRoleService,
    private wsService: WSService,
    private redisService: RedisService,
  ) {}

  /**
   * 获取所有菜单
   */
  async list() {
    return await this.menuRepository.find();
  }

  /**
   * 保存或新增菜单
   */
  async save(menu: CreateMenuDto & { id?: number }): Promise<void> {
    await this.menuRepository.save(menu);
    this.wsService.noticeUserToUpdateMenusByRoleIds([this.rootRoleId]);
  }

  /**
   * 根据用户获取所有菜单
   */
  async getMenus(userId: number) {
    const roleIds = await this.roleService.getRoleIdsByUserId(userId);

    console.log(roleIds, '有菜单', includes(roleIds, this.rootRoleId), this.rootRoleId);
    let menus: SysMenu[] = [];
    // 超管 全部返回 array, value
    if (includes(roleIds, this.rootRoleId)) {
      menus = await this.list();
    } else {
      // [1,2,3] roleIds
      menus = await this.menuRepository
        .createQueryBuilder('menu')
        .innerJoinAndSelect('sys_role_menu', 'role_menu', 'menu.id = role_menu.menu_id')
        .andWhere('role_menu.role_id IN (:...roldIds)', { roldIds: roleIds })
        .orderBy('menu.order_num', 'DESC')
        .getMany();
    }

    return menus;
  }

  async getPerms(userId: number) {
    const roleIds = await this.roleService.getRoleIdsByUserId(userId);

    let perms: any[] = [];
    let result: any = null;

    if (includes(roleIds, this.rootRoleId)) {
      result = await this.menuRepository.find({
        where: { perms: Not(IsNull()), type: 2 },
      });
      // mysql => NOT(IS NULL)
    } else {
      result = await this.menuRepository
        .createQueryBuilder('menu')
        .innerJoinAndSelect('sys_role_menu', 'role_menu', 'menu.id = role_menu.menu_id')
        .andWhere('role_menu.role_id IN (:...roldIds)', { roldIds: roleIds })
        .andWhere('menu.type = 2')
        .andWhere('menu.perms IS NOT NULL')
        .getMany();
    }
    if (!isEmpty(result)) {
      result.forEach((e) => {
        perms = concat(perms, e.perms.split(','));
      });
      perms = uniq(perms);
    }
    return perms;
  }

  /**
   * 获取某个菜单的信息
   * @param menuId menu id
   */
  async getMenuItemInfo(menuId: number): Promise<SysMenu> {
    const menu = await this.menuRepository.findOne({ where: { id: menuId } });
    return menu;
  }

  /**
   * 检查菜单创建规则是否符合
   */
  async check(dto: CreateMenuDto & { menuId?: number }): Promise<void | never> {
    if (dto.type === 2 && dto.parentId === -1) {
      // 无法直接创建权限，必须有ParentId
      throw new ApiException(10005);
    }
    if (dto.type === 1 && dto.parentId !== -1) {
      const parent = await this.getMenuItemInfo(dto.parentId);
      if (isEmpty(parent)) {
        throw new ApiException(10014);
      }
      if (parent && parent.type === 1) {
        // 当前新增为菜单但父节点也为菜单时为非法操作
        throw new ApiException(10006);
      }
    }
    //判断同级菜单路由是否重复
    if (!Object.is(dto.type, 2)) {
      // 查找所有一级菜单
      const menus = await this.menuRepository.find({
        where: { parentId: Object.is(dto.parentId, -1) ? null : dto.parentId },
      });
      const router = dto.router.split('/').filter(Boolean).join('/');
      const pathReg = new RegExp(`^/?${router}/?$`);
      const isExist = menus.some((n) => pathReg.test(n.router) && n.id !== dto.menuId);
      if (isExist) {
        // 同级菜单路由不能重复
        throw new ApiException(10004);
      }
    }
  }

  // 查找当前菜单下的子菜单，目录以及菜单
  async findChildMenus(menuId: number): Promise<any> {
    const allMenus: any = [];
    const menus = await this.menuRepository.find({ where: { parentId: menuId } });

    for (let i = 0; i < menus.length; i++) {
      if (menus[i].type !== 2) {
        // 子目录下是菜单或目录，继续往下级查找
        const c = await this.findChildMenus(menus[i].id);
        allMenus.push(c);
      }
      allMenus.push(menus[i].id);
    }
    return allMenus;
  }

  // 删除多项菜单
  async deleteMenuItem(menuIds: number[]): Promise<void> {
    await this.menuRepository.delete(menuIds);
    this.wsService.noticeUserToUpdateMenusByMenuIds(menuIds);
  }

  // 获取某个菜单以及关联的父菜单的信息
  async getMenuItemAndParentInfo(menuId: number): Promise<MenuItemAndParentInfoResult> {
    const menu = await this.menuRepository.findOne({
      where: {
        id: menuId,
      },
    });
    let parentMenu: SysMenu | undefined = undefined;
    if (menu && menu.parentId) {
      parentMenu = await this.menuRepository.findOne({ where: { id: menu.parentId } });
    }
    return { menu, parentMenu };
  }

  /**
   * 刷新所有在线用户的权限
   */
  async refreshOnlineUserPerms(): Promise<void> {
    const onlineUserIds: string[] = await this.redisService.getAllKeys('admin:token:*');

    if (onlineUserIds && onlineUserIds.length > 0) {
      for (let i = 0; i < onlineUserIds.length; i++) {
        const uid = onlineUserIds[i].split('admin:token:')[1];
        const perms = await this.getPerms(parseInt(uid));
        await this.redisService.set(`admin:perms:${uid}`, JSON.stringify(perms));
      }
    }
  }
}
