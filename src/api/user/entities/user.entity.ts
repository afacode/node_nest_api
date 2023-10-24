import { BaseModelWithUUIDPrimary } from 'src/shared/model/base.model';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity({
  name: 'users',
})
export class User extends BaseModelWithUUIDPrimary {
  @Column({ name: 'nick_name', nullable: true })
  nikeName: string;

  @Column({ length: 50, comment: '用户名' })
  username: string;

  @Column({ select: true })
  password: string;

  @Column()
  email: string;

  @Column({ nullable: true, name: 'head_pic' })
  headPic: string;

  @Column({ nullable: true, name: 'phone_number', comment: '电话' })
  phoneNumber: string;

  @Column({ name: 'is_frozen', comment: '是否冻结', default: false })
  isFrozen: boolean;

  @Column({ name: 'is_admin', comment: '是否管理员', default: false })
  isAdmin: boolean;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];
}
