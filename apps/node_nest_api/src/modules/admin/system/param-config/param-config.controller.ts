import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ADMIN_PREFIX } from '../../admin.constants';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SysParamConfigService } from './param-config.service';
import SysConfig from '@/entities/admin/sys_config.entity';
import { PageOptionsDto } from '@/common/dto/page.dto';
import { PaginatedResponseDto } from '@/common/class/res.class';
import { CreateParamConfigDto, DeleteParamConfigDto, InfoParamConfigDto, UpdateParamConfigDto } from './param-config.dto';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('参数配置模块')
@Controller('param-config')
export class SysParamConfigController {
  constructor(private paramConfigService: SysParamConfigService) {}

  @ApiOperation({ summary: '分页获取参数配置列表' })
  @ApiOkResponse({ type: [SysConfig] })
  @Get('page')
  async page(@Query() dto: PageOptionsDto): Promise<PaginatedResponseDto<SysConfig>> {
    const list = await this.paramConfigService.getConfigListByPage(dto.page, dto.limit);
    const count = await this.paramConfigService.getConfigCount();

    return {
      list,
      pagination: {
        total: count,
        size: dto.limit,
        page: dto.page,
      },
    };
  }

  @ApiOperation({ summary: '新增参数配置' })
  @Post('add')
  async add(@Body() dto: CreateParamConfigDto) {
    await this.paramConfigService.isExistKey(dto.key);
    await this.paramConfigService.add(dto);
  }

  @ApiOperation({ summary: '查询单个参数配置信息' })
  @ApiOkResponse({ type: SysConfig })
  @Post('info')
  async info(@Body() dto: InfoParamConfigDto) {
    return this.paramConfigService.findOne(dto.id);
  }

  @ApiOperation({ summary: '更新单个参数配置' })
  @Post('update')
  async update(@Body() dto: UpdateParamConfigDto) {
    await this.paramConfigService.update(dto);
  }

  @ApiOperation({ summary: '删除指定的参数配置-array' })
  @Post('delete')
  async delete(@Body() dto: DeleteParamConfigDto) {
    await this.paramConfigService.delete(dto.ids);
  }
}
