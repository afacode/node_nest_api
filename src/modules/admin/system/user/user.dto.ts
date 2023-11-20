import SysUser from '@/entities/admin/sys_user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AccountInfo {
  @ApiProperty()
  name: string;

  @ApiProperty()
  nickName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  headImg: string;

  @ApiProperty()
  loginIp: string;
}

export class UserDetailInfo extends SysUser {
  @ApiProperty({
    description: '关联角色',
  })
  roles: number[];

  @ApiProperty({
    description: '关联部门名称',
  })
  departmentName: string;
}
