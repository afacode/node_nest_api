import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ADMIN_PREFIX } from './admin.constants';
import { LoginModule } from './login/login.module';
import { SystemModule } from './system/system.module';
import { AuthGuard } from './adminCore/guard/auth.guard';

@Module({
  imports: [
    RouterModule.register([
      {
        path: ADMIN_PREFIX,
        children: [
          { path: 'account', module: AccountModule },
          { path: 'sys', module: SystemModule },
        ],
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
  exports: [SystemModule],
})
export class AdminModule {}
