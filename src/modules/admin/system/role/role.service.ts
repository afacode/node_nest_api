import SysMenu from '@/entities/admin/sys_menu.entity';
import SysRole from '@/entities/admin/sys_role.entity';
import SysRoleDepartment from '@/entities/admin/sys_role_department.entity';
import SysRoleMenu from '@/entities/admin/sys_role_menu.entity';
import SysUserRole from '@/entities/admin/sys_user_role.emtity';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { difference, filter, includes, isEmpty, map } from 'lodash';

@Injectable()
export class SysRoleService {
  constructor(
    @InjectRepository(SysRole) private roleRepository: Repository<SysRole>,

    @InjectRepository(SysRoleMenu)
    private roleMenuRepository: Repository<SysRoleMenu>,

    @InjectRepository(SysRoleDepartment)
    private roleDepartmentRepository: Repository<SysRoleDepartment>,

    @InjectRepository(SysUserRole)
    private userRoleRepository: Repository<SysUserRole>,

    @InjectEntityManager() private entityManager: EntityManager,

    @InjectRepository(SysMenu) private menuRepository: Repository<SysMenu>,
  ) {}

  /**
   * 获取所有角色
   */
  async list() {
    return await this.roleRepository.findAndCount();
  }

  /**
   * 根据角色获取所有菜单
   */
  async getMenus(uid: string) {}

  /**
   * 根据角色获取角色信息
   */
  async getRoleInfoAllById(roleId: number) {
    const roleInfo = await this.roleRepository.findOne({
      where: {
        id: roleId,
      },
    });
    const menus = await this.roleMenuRepository.find({ where: { roleId: roleId } });

    const depts = await this.roleDepartmentRepository.find({
      where: { roleId: roleId },
    });

    return { roleInfo, menus, depts };
  }

  async info(roleId: number) {
    return await this.getRoleInfoAllById(roleId);
  }

  /**
   * 根据用户id查找角色信息
   */
  async getRoleIdsByUserId(userId: number): Promise<number[]> {
    const result = await this.userRoleRepository.find({ where: { userId: userId } });
    if (!isEmpty(result)) {
      return map(result, (v) => {
        return v.roleId;
      });
    }

    return [];
  }
}
