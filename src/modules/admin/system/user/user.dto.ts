import { PageOptionsDto } from '@/common/dto/page.dto';
import SysUser from '@/entities/admin/sys_user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { isEmpty } from 'lodash';

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

export class DeleteUserDto {
  @ApiProperty({
    description: '需要删除的用户ID列表',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  userIds: number[];
}

export class PageSearchUserDto extends PageOptionsDto {
  @ApiProperty({
    required: false,
    description: '部门列表',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  departmentIds: number[];

  @ApiProperty({
    required: false,
    description: '用户姓名',
  })
  @IsString()
  @IsOptional()
  name = '';

  @ApiProperty({
    required: false,
    description: '用户名',
  })
  @IsString()
  @IsOptional()
  username = '';

  @ApiProperty({
    required: false,
    description: '用户手机号',
  })
  @IsString()
  @IsOptional()
  phone = '';

  @ApiProperty({
    required: false,
    description: '用户备注',
  })
  @IsString()
  @IsOptional()
  remark = '';
}

export class InfoUserDto {
  @ApiProperty({
    description: '用户ID',
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  userId: number;
}

export class CreateUserDto {
  @ApiProperty({
    description: '所属部门编号',
  })
  @IsInt()
  @Min(0)
  departmentId: number;

  @ApiProperty({
    description: '用户姓名',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: '登录账号',
  })
  @IsString()
  @Matches(/^[a-z0-9A-Z]+$/)
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    description: '归属角色',
    type: [Number],
  })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  roles: number[];

  @ApiProperty({
    required: false,
    description: '呢称',
  })
  @IsString()
  @IsOptional()
  nickName: string;

  @ApiProperty({
    required: false,
    description: '邮箱',
  })
  @IsEmail()
  @ValidateIf((o) => !isEmpty(o.email))
  email: string;

  @ApiProperty({
    required: false,
    description: '手机号',
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    required: false,
    description: '备注',
  })
  @IsString()
  @IsOptional()
  remark: string;

  @ApiProperty({
    description: '状态',
  })
  @IsIn([0, 1])
  status: number;
}