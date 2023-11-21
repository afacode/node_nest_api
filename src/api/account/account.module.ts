import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { SystemModule } from '@/modules/admin/system/system.module';
import { LoginModule } from '../login/login.module';

@Module({
  imports: [SystemModule, LoginModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
