import { Column, Entity } from "typeorm";
import { BaseModelWithIDPrimary, BaseModelWithUUIDPrimary } from "../base.model";
import { ApiProperty } from "@nestjs/swagger";

// 系统角色部门关系
@Entity({name: 'sys_role_department'})
export default class SysRoleDepartment extends BaseModelWithIDPrimary {
    @Column({ name: 'role_id', comment: '角色ID' })
    @ApiProperty()
    roleId: number;

    @Column({ name: 'department_id', comment: '部门ID' })
    @ApiProperty()
    departmentId: number;
}