import { Column, Entity } from "typeorm";
import { BaseModelWithIDPrimary, BaseModelWithUUIDPrimary } from "../base.model";
import { ApiProperty } from "@nestjs/swagger";

// 系统用户角色关系
@Entity({name: 'sys_user_role'})
export default class SysUserRole extends BaseModelWithIDPrimary {
    @Column({ name: 'user_id', comment: '用户ID' })
    @ApiProperty()
    userId: number;

    @Column({ name: 'role_id', comment: '角色ID' })
    @ApiProperty()
    roleId: number;
}