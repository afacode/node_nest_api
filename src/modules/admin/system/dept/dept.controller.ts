import { ADMIN_PREFIX } from '@/modules/admin/admin.constants';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AdminUser } from '../../adminCore/decorators/admin-user.decorator';
import { SysDeptService } from './dept.service';
import SysDepartment from '@/entities/admin/sys_department.entity';
import { DeptDetailInfo } from './dept.class';
import { CreateDeptDto, DeleteDeptDto, InfoDeptDto, MoveDeptDto, TransferDeptDto, UpdateDeptDto } from './dept.dto';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('部门模块')
@Controller('dept')
export class SysDeptController {
  constructor(private deptService: SysDeptService) {}

  @ApiOperation({ summary: '获取系统部门列表' })
  @ApiOkResponse({ type: [SysDepartment] })
  @Get('list')
  async list(@AdminUser() user: { uid: number }) {
    return await this.deptService.getDepts(user.uid);
  }

  @ApiOperation({ summary: '创建系统部门' })
  @Post('add')
  async add(@Body() createDeptDto: CreateDeptDto): Promise<void> {
    await this.deptService.add(createDeptDto.name, createDeptDto.parentId);
  }

  @ApiOperation({ summary: '删除系统部门' })
  @Post('delete')
  async delete(@Body() dto: DeleteDeptDto): Promise<void> {
    await this.deptService.delete(dto.departmentId);
  }

  @ApiOperation({ summary: '查询单个系统部门信息' })
  @ApiOkResponse({ type: DeptDetailInfo })
  @Get('info')
  async info(@Body() dto: InfoDeptDto): Promise<DeptDetailInfo> {
    return await this.deptService.info(dto.departmentId);
  }

  @ApiOperation({ summary: '更新系统部门' })
  @Post('update')
  async update(@Body() updateDeptDto: UpdateDeptDto): Promise<void> {
    await this.deptService.update(updateDeptDto);
  }

  @ApiOperation({ summary: '管理员部门转移' })
  @Post('transfer')
  async transfer(@Body() transferDeptDto: TransferDeptDto): Promise<void>  {
     await this.deptService.transfer(transferDeptDto.userIds, transferDeptDto.departmentId);
  }

  @ApiOperation({ summary: '部门移动排序' })
  @Post('move')
  async move(@Body() dto: MoveDeptDto): Promise<void>  {
     await this.deptService.move(dto.depts);
  }
}
