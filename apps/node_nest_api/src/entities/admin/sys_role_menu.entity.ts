import { Column, Entity } from "typeorm";
import { BaseModelWithIDPrimary, BaseModelWithUUIDPrimary } from "../base.model";
import { ApiProperty } from "@nestjs/swagger";

// 系统角色菜单关系
@Entity({name: 'sys_role_menu'})
export default class SysRoleMenu extends BaseModelWithIDPrimary {
    @Column({ name: 'role_id', comment: '角色ID' })
    @ApiProperty()
    roleId: number;

    @Column({ name: 'menu_id', comment: '菜单ID' })
    @ApiProperty()
    menuId: number;
}