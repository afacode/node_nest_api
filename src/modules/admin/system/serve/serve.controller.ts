import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ADMIN_PREFIX } from '../../admin.constants';
import { PermissionOptional } from '../../adminCore/decorators/permission-optional.decorator';
import { SysServeService } from './serve.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('服务监控')
@Controller('serve')
export class SysServeController {
  constructor(private serveService: SysServeService) {}

  @ApiOperation({ summary: '获取服务器运行信息' })
  @PermissionOptional()
  @Get('stat')
  async stat() {
    return await this.serveService.getServeStat();
  }
}
