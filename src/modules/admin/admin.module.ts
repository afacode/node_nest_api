import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { RouterModule } from '@nestjs/core';
import { ADMIN_PREFIX } from './admin.constants';

@Module({
  imports: [
    RouterModule.register([
      {
        path: ADMIN_PREFIX,
        children: [
            { path: 'account', module: AccountModule },
        ]
      },
    //   {
    //     path: ADMIN_PREFIX,
    //     module: AccountModule,
    //   },
    ]),
    AccountModule,
  ],
  providers: [],
  exports: [],
})
export class AdminModule {}
