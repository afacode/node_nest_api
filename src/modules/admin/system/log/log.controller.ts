import { ADMIN_PREFIX } from '../../admin.constants';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { LoginLogInfo, TaskLogInfo } from './log.class';
import { LogDisabled } from '../../adminCore/decorators/log-disabled.decorator';
import { ApiOkResponsePaginated, PaginatedResponseDto } from '@/common/class/res.class';
import { AdminUser } from '../../adminCore/decorators/admin-user.decorator';
import { PageOptionsDto } from '@/common/dto/page.dto';
import { SysLogService } from './log.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('日志模块')
@Controller('log')
export class SysLogController {
  constructor(private logService: SysLogService) {}

  @ApiOperation({ summary: '登录日志' })
  @ApiOkResponsePaginated(LoginLogInfo)
  @LogDisabled()
  @Get('login/page')
  async loginLogPage(@Query() dto: PageOptionsDto) {
    const list = await this.logService.pageGetLoginLog(dto.page, dto.limit);
    const count = await this.logService.countLoginLog();
    return {
      list,
      pagination: {
        total: count,
        size: dto.limit,
        page: dto.page,
      },
    };
  }

  @ApiOperation({ summary: '任务日志' })
  @ApiOkResponse({ type: [TaskLogInfo] })
  @LogDisabled()
  @Get('task/page')
  async taskPage(
    @Query() dto: PageOptionsDto,
  ): Promise<PaginatedResponseDto<TaskLogInfo>> {
    const list = await this.logService.page(dto.page, dto.limit);
    const count = await this.logService.countTaskLog();
    return {
      list,
      pagination: {
        total: count,
        size: dto.limit,
        page: dto.page,
      },
    };
  }
}
