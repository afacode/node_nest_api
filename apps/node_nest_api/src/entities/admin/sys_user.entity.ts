import { Column, Entity } from "typeorm";
import { BaseModelWithIDPrimary, BaseModelWithUUIDPrimary } from "../base.model";
import { ApiProperty } from "@nestjs/swagger";

/**
 * **索引**
 * ${UNIQUE} username
 */
@Entity({name: 'sys_user'})
export default class SysUser extends BaseModelWithIDPrimary {
    @Column({name: 'department_id', comment: '部门编号'})
    @ApiProperty()
    departmentId: number

    @Column({name: 'name', comment: '真实姓名'})
    @ApiProperty()
    name: string;

    @Column({ unique: true, comment: '登录账号' })
    @ApiProperty()
    username: string;

    @Column()
    @ApiProperty()
    password: string;

    @Column({ length: 32, comment: '密码盐值（随机生成，每个用户对应一个盐值）' })
    @ApiProperty()
    psalt: string;

    @Column({ name: 'nick_name', nullable: true })
    @ApiProperty()
    nickName: string;

    @Column({ name: 'head_img', nullable: true })
    @ApiProperty()
    headImg: string;

    @Column({ nullable: true, default: '' })
    @ApiProperty()
    email: string;

    @Column({ nullable: true, default: '' })
    @ApiProperty()
    phone: string;

    @Column({ nullable: true, default: '', comment: '备注' })
    @ApiProperty()
    remark: string;

    @Column({ type: 'tinyint', nullable: true, default: 1, comment: '状态：0：禁用，1：启用' })
    @ApiProperty()
    status: number;
}