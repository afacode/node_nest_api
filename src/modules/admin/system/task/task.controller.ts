import { PageOptionsDto } from '@/common/dto/page.dto';
import SysTask from '@/entities/admin/sys_task.entity';
import { ADMIN_PREFIX } from '@/modules/admin/admin.constants';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CheckIdTaskDto, CreateTaskDto, UpdateTaskDto } from './task.dto';
import { PaginatedResponseDto } from '@/common/class/res.class';
import { SysTaskService } from './task.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('任务调度模块')
@Controller('task')
export class SysTakeController {
  constructor(private taskService: SysTaskService) {}

  @ApiOperation({ summary: '获取任务列表' })
  @ApiOkResponse({ type: [SysTask] })
  @Get('page')
  async page(@Query() dto: PageOptionsDto): Promise<PaginatedResponseDto<SysTask>> {
    const list = await this.taskService.page(dto.page, dto.limit);
    const count = await this.taskService.count();
    return {
      list,
      pagination: {
        total: count,
        size: dto.limit,
        page: dto.page,
      },
    };
  }

  @ApiOperation({ summary: '查询任务详细信息' })
  @ApiOkResponse({ type: SysTask })
  @Get('info')
  async info(@Query() dto: CheckIdTaskDto): Promise<SysTask> {
    return await this.taskService.info(dto.id);
  }

  @ApiOperation({ summary: '添加任务' })
  @Post('add')
  async add(@Body() dto: CreateTaskDto): Promise<void> {}

  @ApiOperation({ summary: '更新任务' })
  @Post('update')
  async update(@Body() dto: UpdateTaskDto): Promise<void> {}


  @ApiOperation({ summary: '手动执行一次任务' })
  @Post('once')
  async once(@Body() dto: CheckIdTaskDto): Promise<void> {}

  @ApiOperation({ summary: '停止任务' })
  @Post('stop')
  async stop(@Body() dto: CheckIdTaskDto): Promise<void> {}

  @ApiOperation({ summary: '启动任务' })
  @Post('start')
  async start(@Body() dto: CheckIdTaskDto): Promise<void> {}

  @ApiOperation({ summary: '删除任务' })
  @Post('delete')
  async delete(@Body() dto: CheckIdTaskDto): Promise<void> {}
}
