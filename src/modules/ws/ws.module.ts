import SysRoleMenu from '@/entities/admin/sys_role_menu.entity';
import SysUserRole from '@/entities/admin/sys_user_role.emtity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WSGateway } from './ws.gateway';
import { AuthService } from './auth.service';
import { WSService } from './ws.service';

const providers = [WSGateway, AuthService, WSService,]

@Module({
  imports: [TypeOrmModule.forFeature([SysUserRole, SysRoleMenu])],
  providers: [...providers],
  exports: [...providers],
})
export class WSModule {}