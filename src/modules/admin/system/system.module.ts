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
import { SysUserController } from './user/user.controller';
import { SysMenuController } from './menu/menu.controller';
import { SysMenuService } from './menu/menu.service';
import { SysRoleController } from './role/role.controller';
import { SysRoleService } from './role/role.service';
import { SysDeptController } from './dept/dept.controller';
import { SysDeptService } from './dept/dept.service';
import { ROOT_ROLE_ID } from '../admin.constants';
import { rootRoleIdProvider } from '../adminCore/provider/root-role-id.provider';
import { SysParamConfigController } from './param-config/param-config.controller';
import { SysParamConfigService } from './param-config/param-config.service';
import { SysOnlineController } from './online/online.controller';
import { SysOnlineService } from './online/online.service';
import { WSModule } from '@/modules/ws/ws.module';
import { SysServeController } from './serve/serve.controller';
import { SysServeService } from './serve/serve.service';


const providers = [
  SysUserService,
  SysMenuService,
  SysRoleService,
  SysDeptService,
  SysParamConfigService,
  SysOnlineService,
  SysServeService,
];
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
    WSModule,
  ],
  controllers: [
    SysUserController,
    SysMenuController,
    SysRoleController,
    SysDeptController,
    SysParamConfigController,
    SysOnlineController,
    SysServeController,
  ],
  providers: [
    rootRoleIdProvider(),
    ...providers
  ],
  exports: [
    ROOT_ROLE_ID,
    TypeOrmModule,
    ...providers
  ],
})
export class SystemModule {}
