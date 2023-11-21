import { ADMIN_PREFIX } from '@/modules/admin/admin.constants';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SysMenuService } from './menu.service';
import { AdminUser } from '../../adminCore/decorators/admin-user.decorator';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('菜单权限模块')
@Controller('menu')
export class SysMenuController {
  constructor(private menuService: SysMenuService) {}

  @ApiOperation({ summary: '获取对应权限的菜单列表' })
  @Get('list')
  async list(@AdminUser() user: {uid: number}) {
    return await this.menuService.getMenus(user.uid);
  }
}
