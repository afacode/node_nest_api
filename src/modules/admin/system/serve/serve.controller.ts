import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ADMIN_PREFIX } from '../../admin.constants';
import { PermissionOptional } from '../../adminCore/decorators/permission-optional.decorator';
import { SysServeService } from './serve.service';
import { Authorize } from '../../adminCore/decorators/authorize.decorator';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('服务监控')
@Controller('serve')
export class SysServeController {
  constructor(private serveService: SysServeService) {}

  @ApiOperation({ summary: '获取服务器运行信息' })
  // @PermissionOptional()
  @Authorize()
  @Get('stat')
  async stat() {
    return await this.serveService.getServeStat();
  }

  @ApiOperation({ summary: '获取服务器全面信息' })
  // @PermissionOptional()
  @Authorize()
  @Get('status')
  async status() {
    return await this.serveService.getServeAllStatus();
  }
  
}
