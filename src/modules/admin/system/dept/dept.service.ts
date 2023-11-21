import SysDepartment from '@/entities/admin/sys_department.entity';
import SysRoleDepartment from '@/entities/admin/sys_role_department.entity';
import SysUser from '@/entities/admin/sys_user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { includes, isEmpty } from 'lodash';
import { EntityManager, In, Repository } from 'typeorm';
import { SysRoleService } from '../role/role.service';

@Injectable()
export class SysDeptService {
  constructor(
    @InjectRepository(SysUser) private userRepositoty: Repository<SysUser>,

    @InjectRepository(SysDepartment)
    private deptRepositoty: Repository<SysDepartment>,

    @InjectRepository(SysRoleDepartment)
    private roleDeptRepositoty: Repository<SysUser>,

    @InjectEntityManager() private entityManager: EntityManager,

    private roleService: SysRoleService,
  ) {}

  /**
   * 获取所有部门
   */
  async list(): Promise<SysDepartment[]> {
    return await this.deptRepositoty.find({ order: { orderNum: 'DESC' } });
  }

  /**
   * 根据当前角色id获取部门列表
   */
  async getDepts(userId: number) {
    const roleIds = await this.roleService.getRoleIdsByUserId(userId);
    let depts: any = [];

    depts = await this.deptRepositoty
      .createQueryBuilder('dept')
      .innerJoinAndSelect('sys_role_department', 'role_dept', 'dept.id = role_dept.department_id')
      .andWhere('role_dept.role_id IN (:...roldIds)', { roldIds: roleIds })
      .orderBy('dept.order_num', 'ASC')
      .getMany();

    return depts;
  }
}
