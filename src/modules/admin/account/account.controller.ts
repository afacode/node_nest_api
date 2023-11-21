import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ADMIN_PREFIX } from '../admin.constants';
import { LoginService } from '../login/login.service';
import { SysUserService } from '../system/user/user.service';
import { UtilService } from '@/shared/services/util.service';
import { AdminUser } from '../adminCore/decorators/admin-user.decorator';
import { PermissionOptional } from '../adminCore/decorators/permission-optional.decorator';

@ApiTags('账户模块')
@ApiSecurity(ADMIN_PREFIX)
@Controller()
export class AccountController {
  constructor(
    private userService: SysUserService,
    private loginService: LoginService,
    private utils: UtilService,
  ) {}
  
  @ApiOperation({ summary: '获取管理员资料' })
  @PermissionOptional()
  @Get('info')
  async info() {
    return { name: 'afacode' };
  }

  @ApiOperation({ summary: '获取菜单列表及权限列表' })
  @PermissionOptional()
  @Get('permmenu')
  async permmenu(@AdminUser() user: {uid: number}) {
    return await this.loginService.getPermMenu(user.uid);
  }
}
