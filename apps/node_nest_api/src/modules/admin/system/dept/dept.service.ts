import SysDepartment from '@/entities/admin/sys_department.entity';
import SysRoleDepartment from '@/entities/admin/sys_role_department.entity';
import SysUser from '@/entities/admin/sys_user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { includes, isEmpty } from 'lodash';
import { EntityManager, In, Repository } from 'typeorm';
import { SysRoleService } from '../role/role.service';
import { ROOT_ROLE_ID } from '../../admin.constants';
import { DeptDetailInfo } from './dept.class';
import { MoveDept, UpdateDeptDto } from './dept.dto';

@Injectable()
export class SysDeptService {
  constructor(
    @InjectRepository(SysUser) private userRepositoty: Repository<SysUser>,

    @InjectRepository(SysDepartment)
    private deptRepositoty: Repository<SysDepartment>,

    @InjectRepository(SysRoleDepartment)
    private roleDeptRepositoty: Repository<SysUser>,

    @InjectEntityManager() private entityManager: EntityManager,

    @Inject(ROOT_ROLE_ID) private rootRoleId: number,
    private roleService: SysRoleService,
  ) {}

  /**
   * 获取所有部门
   */
  async list(): Promise<SysDepartment[]> {
    return await this.deptRepositoty.find({ order: { orderNum: 'DESC' } });
  }

  /**
   * 根据ID查找部门信息
   */
  async info(deptId: number): Promise<DeptDetailInfo> {
    const dept = await this.deptRepositoty.findOne({
      where: {
        id: deptId,
      },
    });

    // 上级部门
    let parentDept = null;
    if (dept.parentId) {
      parentDept = await this.deptRepositoty.findOne({
        where: {
          id: dept.parentId,
        },
      });
    }
    return { department: dept, parentDepartment: parentDept };
  }

  /**
   * 更新部门信息
   */
  async update(param: UpdateDeptDto): Promise<void> {
    await this.deptRepositoty.update(param.id, {
      parentId: param.parentId === -1 ? undefined : param.parentId,
      name: param.name,
      orderNum: param.orderNum,
    });
  }

  /**
   * 转移部门
   */
  async transfer(userIds: number[], deptId: number): Promise<void> {
    await this.userRepositoty.update({ id: In(userIds) }, { departmentId: deptId });
  }

  /**
   * 新增部门
   */
  async add(deptName: string, parentDeptId: number): Promise<void> {
    await this.deptRepositoty.insert({
      name: deptName,
      parentId: parentDeptId === -1 ? null : parentDeptId,
    });
  }

  /**
   * 移动排序
   */
  async move(depts: MoveDept[]): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      for (let i = 0; i < depts.length; i++) {
        await manager.update(
          SysDepartment,
          { id: depts[i].id },
          { parentId: depts[i].parentId },
        );
      }
    });
  }

  /**
   * 根据ID删除部门
   */
  async delete(departmentId: number): Promise<void> {
    await this.deptRepositoty.delete(departmentId);
  }

  /**
   * 根据部门查询关联的用户数量
   */
  async countUserByDeptId(deptId: number): Promise<number> {
    return await this.userRepositoty.count({ where: { departmentId: deptId } });
  }

  /**
   * 根据部门查询关联的角色数量
   */
  async countRoleByDeptId(deptId: number): Promise<number> {
    return await this.roleDeptRepositoty.count({ where: { departmentId: deptId } });
  }

  /**
   * 查找当前部门下的子部门数量
   */
  async countChildDept(deptId: number): Promise<number> {
    return await this.deptRepositoty.count({ where: { parentId: deptId } });
  }

  /**
   * 根据当前角色id获取部门列表
   */
  async getDepts(userId: number) {
    const roleIds = await this.roleService.getRoleIdsByUserId(userId);
    let depts: any = [];

    if (includes(roleIds, this.rootRoleId)) {
      depts = await this.deptRepositoty.find();
    } else {
      // sys_role_department 系统角色部门关系  sys_department 部门
      // WHERE role_dept.role_id IN (roldIds)
      depts = await this.deptRepositoty
        .createQueryBuilder('dept')
        .innerJoinAndSelect('sys_role_department', 'role_dept', 'dept.id = role_dept.department_id')
        .andWhere('role_dept.role_id IN (:...roldIds)', { roldIds: roleIds })
        .orderBy('dept.order_num', 'ASC')
        .getMany();
    }

    return depts;
  }
}
