import { ADMIN_PREFIX } from '@/modules/admin/admin.constants';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AdminUser } from '../../adminCore/decorators/admin-user.decorator';
import { SysRoleService } from './role.service';
import { SysMenuService } from '../menu/menu.service';
import { CreateRoleDto, DeleteRoleDto, InfoRoleDto, PageSearchRoleDto, UpdateRoleDto } from './role.dto';
import { ApiException } from '@/common/exceptions/api.exception';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('角色模块')
@Controller('role')
export class SysRoleController {
  constructor(
    private menuService: SysMenuService,
    private roleService: SysRoleService,
  ) {}

  @ApiOperation({ summary: '获取角色列表' })
  @Get('list')
  async list() {
    return await this.roleService.list();
  }

  @ApiOperation({ summary: '分页查询角色信息' })
  @Get('page')
  async page(@Query() dto: PageSearchRoleDto) {
    const [list, total] = await this.roleService.page(dto);
    return {
      list,
      pagination: {
        size: dto.limit,
        page: dto.page,
        total,
      },
    };
  }

  @ApiOperation({ summary: '删除角色' })
  @Post('delete')
  async delete(@Body() dto: DeleteRoleDto): Promise<void> {
    // 角色下有用户不能删
    const count = await this.roleService.countUserIdByRole(dto.roleIds);
    if (count > 0) {
      throw new ApiException(10008);
    }

    await this.roleService.delete(dto.roleIds);
  }

  @ApiOperation({ summary: '新增角色' })
  @Post('add')
  async add(@Body() dto: CreateRoleDto, @AdminUser() user: { uid: number }) {
    await this.roleService.add(dto, user.uid);
  }

  @ApiOperation({ summary: '更新角色 todo' })
  @Post('update')
  async update(@Body() dto: UpdateRoleDto): Promise<void> {
    await this.roleService.update(dto);
    // await this.menuService.refreshOnlineUserPerms(); // todo
  }

  @ApiOperation({ summary: '获取角色信息' })
  @Get('info')
  async info(@Query() dto: InfoRoleDto) {
    return await this.roleService.info(dto.roleId);
  }
}
