import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { camelCase, isEmpty } from 'lodash';
// import {} from './user.dto'
//   CreateUserDto,
//   PageSearchUserDto,
//   UpdatePasswordDto,
//   UpdateUserDto,
//   UpdateUserInfoDto,
import SysUser from '@/entities/admin/sys_user.entity';
import { EntityManager, Repository } from 'typeorm';
import SysDepartment from '@/entities/admin/sys_department.entity';
import SysUserRole from '@/entities/admin/sys_user_role.emtity';
import { ApiException } from '@/common/exceptions/api.exception';

@Injectable()
export class SysUserService {
  constructor(
    @InjectRepository(SysUser) private userRepository: Repository<SysUser>,

    @InjectRepository(SysDepartment)
    private departmentRepository: Repository<SysDepartment>,

    @InjectRepository(SysUserRole)
    private userRoleRepository: Repository<SysUserRole>,

    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async info(id: number) {
    const user: SysUser = await this.userRepository.findOne({ where: { id } });
    if (isEmpty(user)) {
      throw new ApiException(10017);
    }

    // 部门
    const departmentRow: SysDepartment = await this.departmentRepository.findOne({
      where: {
        id: user.departmentId,
      },
    });
    if (isEmpty(departmentRow)) {
      throw new ApiException(10018);
    }

    // 获取角色
    const roleRows: Array<SysUserRole> = await this.userRoleRepository.find({
      where: {
        userId: user.id,
      },
    });
    const roles = roleRows.map((e) => {
      return e.roleId;
    });

    delete user.password;

    return { ...user, roles, departmentName: departmentRow.name };
  }

  async page() {}

  /**
   * 根据用户名查找已经启用的用户
   */
  async findUserByUserName(username: string) {
    return await this.userRepository.findOne({
      where: {
        username,
        status: 1
      },
    });
  }
}
