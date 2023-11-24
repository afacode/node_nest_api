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
import { CreateUserDto } from './user.dto';
import { UtilService } from '@/shared/services/util.service';
import { ROOT_ROLE_ID } from '../../admin.constants';

@Injectable()
export class SysUserService {
  constructor(
    @InjectRepository(SysUser) private userRepository: Repository<SysUser>,

    @InjectRepository(SysDepartment)
    private departmentRepository: Repository<SysDepartment>,

    @InjectRepository(SysUserRole)
    private userRoleRepository: Repository<SysUserRole>,

    @InjectEntityManager() private entityManager: EntityManager,
    @Inject(ROOT_ROLE_ID) private rootRoleId: number,

    private util: UtilService,
  ) {}

  /**
   * 增加系统用户，如果返回false则表示已存在该用户
   * @param param Object 对应SysUser实体类
   */
  async add(param: CreateUserDto): Promise<void> {
    const exists = await this.userRepository.findOne({
      where: {
        username: param.username
      },
    });
    if (!isEmpty(exists)) {
      throw new ApiException(10001);
    }

    // 所有用户初始密码为123456
    await this.entityManager.transaction(async (manage) => {
      const salt = await this.util.generateRandomValue(32);

      const password = this.util.md5(`123456${salt}`)
      const u = manage.create(SysUser, {
        departmentId: param.departmentId,
        username: param.username,
        password,
        name: param.name,
        nickName: param.nickName,
        email: param.email,
        phone: param.phone,
        remark: param.remark,
        status: param.status,
        psalt: salt,
      });
      const result = await manage.save(u);

      const { roles } = param;
      const insertRoles = roles.map((e) => {
        return {
          roleId: e,
          userId: result.id,
        };
      });

      // 分配角色
      await manage.insert(SysUserRole, insertRoles);
    });
  }

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

  async getAccountInfo(userId: number, ip?: string) {
    const user: SysUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (isEmpty(user)) {
      throw new ApiException(10017);
    }

    return {
      name: user.name,
      nickName: user.nickName,
      email: user.email,
      phone: user.phone,
      remark: user.remark,
      headImg: user.headImg,
      loginIp: ip,
    };
  }

  /**
  * 查找超管的用户ID
  */
 async findRootUserId(): Promise<number> {
   const result = await this.userRoleRepository.findOne({
     where: { id: this.rootRoleId },
   });
   return result.userId;
 }
}
