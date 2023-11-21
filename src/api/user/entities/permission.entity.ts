import { BaseModelWithUUIDPrimary } from '@/entities/base.model';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'permissions' })
export class Permission extends BaseModelWithUUIDPrimary {
  @Column({ comment: '权限代码' })
  code: string;

  @Column({ comment: '权限描述' })
  description: string;
}
