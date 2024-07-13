import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { KickDto, OnlineUserInfoDto } from './online.dto';
import { AdminUser } from '../../adminCore/decorators/admin-user.decorator';
import { LogDisabled } from '../../adminCore/decorators/log-disabled.decorator';
import { ADMIN_PREFIX } from '../../admin.constants';
import { ApiException } from '@/common/exceptions/api.exception';
import { SysOnlineService } from './online.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('在线用户模块')
@Controller('online')
export class SysOnlineController {
  constructor(private onlineService: SysOnlineService) {}

  @ApiOperation({ summary: '查询当前在线用户' })
  @ApiOkResponse({ type: [OnlineUserInfoDto] })
  @LogDisabled()
  @Get('list')
  async list(@AdminUser() user: { uid: number }) {
    return await this.onlineService.listOnlineUser(user.uid);
  }

  @ApiOperation({ summary: '踢掉指定在线用户' })
  @Post('kick')
  async kick(@Body() dto: KickDto, @AdminUser() user: { uid: number }) {
    if (dto.id === user.uid) {
      throw new ApiException(10012);
    }

    await this.onlineService.kickUser(dto.id, user.uid);
  }
}
