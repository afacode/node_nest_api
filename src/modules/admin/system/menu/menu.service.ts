import SysMenu from '@/entities/admin/sys_menu.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysRoleService } from '../role/role.service';

@Injectable()
export class SysMenuService {
  constructor(
    @InjectRepository(SysMenu) private menuRepository: Repository<SysMenu>,

    private roleService: SysRoleService,
    
  ) {}

  /**
   * 获取所有菜单
   */
  async list() {
    return await this.menuRepository.find();
  }

  /**
   * 根据用户获取所有菜单
   */
  async getMenus(userId: number) {
    const roleIds = await this.roleService.getRoleIdsByUserId(userId);
    let menus: SysMenu[] = [];
    // 超管 全部返回 todo
    // [1,2,3] roleIds
    menus = await this.menuRepository
    .createQueryBuilder('menu')
    .innerJoinAndSelect(
      'sys_role_menu', 
      'role_menu',
      'menu.id = role_menu.menu_id',
    )
    .andWhere('role_menu.role_id IN (:...roldIds)', { roldIds: roleIds })
    .orderBy('menu.order_num', 'DESC')
    .getMany();
    
    return menus;
  }
}
