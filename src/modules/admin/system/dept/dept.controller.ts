import { ADMIN_PREFIX } from '@/modules/admin/admin.constants';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AdminUser } from '../../adminCore/decorators/admin-user.decorator';
import { SysDeptService } from './dept.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('部门模块')
@Controller('dept')
export class SysDeptController {
  constructor(private deptService: SysDeptService) {}

  @ApiOperation({ summary: '获取系统部门列表' })
  @Get('list')
  async list(@AdminUser() user: {uid: number}) {
    return await this.deptService.getDepts(user.uid);
  }
}
