import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  // DeleteUserDto,
  InfoUserDto,
  PageSearchUserDto,
  // PasswordUserDto,
  // UpdateUserDto,
  UserDetailInfo,
} from './user.dto';
import { ADMIN_PREFIX } from '../../admin.constants';
import { AdminUser } from '../../adminCore/decorators/admin-user.decorator';
import { SysUserService } from './user.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('管理员模块')
@Controller('user')
export class SysUserController {
  constructor(private userService: SysUserService) {}

  @ApiOperation({
    summary: '新增管理员',
  })
  @Post('add')
  async add(@Body() dto: CreateUserDto) {
    await this.userService.add(dto);
  }

  @ApiOperation({
    summary: '查询管理员信息',
  })
  @ApiOkResponse({ type: UserDetailInfo })
  @Get('info')
  async info(@Query() dto: InfoUserDto): Promise<UserDetailInfo> {
    return await this.userService.info(dto.userId);
  }

  @ApiOperation({
    summary: '分页获取管理员列表',
  })
  @Post('page')
  async page(
    @Body() dto: PageSearchUserDto,
    @AdminUser() user,
  ) {
    return {name: '分页获取管理员列表'}
    // const [list, total] = await this.userService.page(user.uid, dto);
    // return {
    //     list,
    //     pagination: {
    //       total,
    //       page: dto.page,
    //       size: dto.limit,
    //     },
    //   };
  }
}
