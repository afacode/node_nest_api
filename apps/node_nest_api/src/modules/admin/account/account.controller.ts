import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ADMIN_PREFIX } from '../admin.constants';
import { LoginService } from '../login/login.service';
import { SysUserService } from '../system/user/user.service';
import { UtilService } from '@/shared/services/util.service';
import { AdminUser } from '../adminCore/decorators/admin-user.decorator';
import { PermissionOptional } from '../adminCore/decorators/permission-optional.decorator';
import { Request } from 'express';
import { AccountInfo } from '../system/user/user.class';
import { UpdatePersonInfoDto } from './account.dto';
import { UpdatePasswordDto } from '../system/user/user.dto';

@ApiTags('账户模块')
@ApiSecurity(ADMIN_PREFIX)
@Controller()
export class AccountController {
  constructor(
    private userService: SysUserService,
    private loginService: LoginService,
    private util: UtilService,
  ) {}
  
  @ApiOperation({ summary: '获取管理员资料' })
  @ApiOkResponse({ type: AccountInfo })
  @PermissionOptional()
  @Get('info')
  async info(@AdminUser() user: {uid: number}, @Req() req: Request) {
    const rest = await this.userService.getAccountInfo(user.uid, this.util.getReqIP(req),)
    return rest;
  }

  @ApiOperation({ summary: '更改管理员资料' })
  @PermissionOptional()
  @Post('update')
  async update(
    @Body() dto: UpdatePersonInfoDto,
    @AdminUser() user: {uid: number},
  ): Promise<void> {
    await this.userService.updatePersonInfo(user.uid, dto);
  }

  @ApiOperation({ summary: '更改管理员密码' })
  @PermissionOptional()
  @Post('password')
  async password(
    @Body() dto: UpdatePasswordDto,
    @AdminUser() user: {uid: number},
  ): Promise<void> {
    await this.userService.updatePassword(user.uid, dto);
  }

  @ApiOperation({ summary: '管理员登出' })
  @PermissionOptional()
  @Post('logout')
  async logout(@AdminUser() user: {uid: number},): Promise<void> {
    await this.loginService.clearLoginStatus(user.uid);
  }


  @ApiOperation({ summary: '获取菜单列表及权限列表' })
  @PermissionOptional()
  @Get('permmenu')
  async permmenu(@AdminUser() user: {uid: number}) {
    return await this.loginService.getPermMenu(user.uid);
  }
}
