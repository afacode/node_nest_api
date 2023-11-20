import SysConfig from '@/entities/admin/sys_config.entity';
import SysDepartment from '@/entities/admin/sys_department.entity';
import SysLoginLog from '@/entities/admin/sys_login_log.entity';
import SysMenu from '@/entities/admin/sys_menu.entity';
import SysRole from '@/entities/admin/sys_role.entity';
import SysRoleDepartment from '@/entities/admin/sys_role_department.entity';
import SysRoleMenu from '@/entities/admin/sys_role_menu.entity';
import SysTask from '@/entities/admin/sys_task.entity';
import SysTaskLog from '@/entities/admin/sys_task_log.entity';
import SysUser from '@/entities/admin/sys_user.entity';
import SysUserRole from '@/entities/admin/sys_user_role.emtity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysUserService } from './user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SysUser,
      SysDepartment,
      SysUserRole,
      SysMenu,
      SysRoleMenu,
      SysRole,
      SysRoleDepartment,
      SysUserRole,
      SysLoginLog,
      SysTask,
      SysTaskLog,
      SysConfig,
    ]),
  ],
  controllers: [],
  providers: [
    SysUserService,
  ],
  exports: [
    TypeOrmModule,
    SysUserService,
  ],
})
export class SystemModule {}
