import SysMenu from '@/entities/admin/sys_menu.entity';
import SysRole from '@/entities/admin/sys_role.entity';
import SysRoleDepartment from '@/entities/admin/sys_role_department.entity';
import SysRoleMenu from '@/entities/admin/sys_role_menu.entity';
import SysUserRole from '@/entities/admin/sys_user_role.emtity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Like, Not, Repository } from 'typeorm';
import { difference, filter, includes, isEmpty, map } from 'lodash';
import { CreateRoleDto, PageSearchRoleDto, UpdateRoleDto } from './role.dto';
import { ROOT_ROLE_ID } from '../../admin.constants';

@Injectable()
export class SysRoleService {
  constructor(
    @Inject(ROOT_ROLE_ID) private rootRoleId: number,
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
    return await this.roleRepository.find();
  }

  // 分页加载角色信息
  async page(param: PageSearchRoleDto) {
    const { limit, page, name, label, remark } = param;
    const result = await this.roleRepository.findAndCount({
      where: {
        id: Not(this.rootRoleId),
        name: Like(`%${name}%`),
        label: Like(`%${label}%`),
        remark: Like(`%${remark}%`),
      },
      order: { id: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return result;
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

  // 根据角色Id数组删除
  async delete(roleIds: number[]): Promise<void> {
    if (includes(roleIds, this.rootRoleId)) {
      throw new Error('Not Support Delete Root');
    }

    // 开启事务
    await this.entityManager.transaction(async (manager) => {
      await manager.delete(SysRole, roleIds);
      await manager.delete(SysRoleMenu, {
        roleId: In(roleIds),
      });
      await manager.delete(SysRoleDepartment, {
        roleId: In(roleIds),
      });
    });
  }

  // 增加角色
  async add(param: CreateRoleDto, uid: number) {
    const { name, label, remark, menus, depts } = param;
    const role = await this.roleRepository.insert({
      name,
      label,
      remark,
      userId: `${uid}`,
    });
    const { identifiers } = role;
    const roleId = parseInt(identifiers[0].id);

    if (menus && menus.length > 0) {
      const insertRows = menus.map((m) => {
        return {
          roleId,
          menuId: m,
        };
      });
      await this.roleMenuRepository.insert(insertRows);
    }

    if (depts && depts.length > 0) {
      const insertRows = depts.map((d) => {
        return {
          roleId,
          departmentId: d,
        };
      });
      await this.roleDepartmentRepository.insert(insertRows);
    }

    return { roleId };
  }

  // 更新角色信息
  async update(param: UpdateRoleDto) {
    const { roleId, name, label, remark, menus, depts } = param;
    const role = await this.roleRepository.save({
      id: roleId,
      name,
      label,
      remark,
    });

    const originDeptRows = await this.roleDepartmentRepository.find({
      where: { roleId },
    });
    const originMenuRows = await this.roleMenuRepository.find({
      where: { roleId },
    });
    const originMenuIds = originMenuRows.map((e) => {
      return e.menuId;
    });
    const originDeptIds = originDeptRows.map((e) => {
      return e.departmentId;
    });
    // todo 

  }

  // 根据角色ID列表查找关联用户ID
  async countUserIdByRole(roleIds: number[]) {
    if (includes(roleIds, this.rootRoleId)) {
      throw new Error('Not Support Delete Root');
    }

    return await this.userRoleRepository.count({
      where: {
        roleId: In(roleIds),
      },
    });
  }
}
