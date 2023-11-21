import { ADMIN_PREFIX } from '@/modules/admin/admin.constants';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AdminUser } from '../../adminCore/decorators/admin-user.decorator';
import { SysRoleService } from './role.service';
import { SysMenuService } from '../menu/menu.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('角色模块')
@Controller('role')
export class SysRoleController {
  constructor(
    private menuService: SysMenuService,
    private roleService: SysRoleService,
    
) {}

  @ApiOperation({ summary: '获取角色列表' })
  @Get('list')
  async list() {
    return await this.roleService.list();
  }
}