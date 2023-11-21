import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { RouterModule } from '@nestjs/core';
import { ADMIN_PREFIX } from './admin.constants';
import { LoginModule } from './login/login.module';
import { SystemModule } from './system/system.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: ADMIN_PREFIX,
        children: [{ path: 'account', module: AccountModule }],
      },
      {
        path: ADMIN_PREFIX,
        module: LoginModule,
      },
    ]),
    SystemModule,
    AccountModule,
    LoginModule,
  ],
  providers: [],
  exports: [SystemModule],
})
export class AdminModule {}
