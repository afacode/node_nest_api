import { Column, Entity } from "typeorm";
import { BaseModelWithIDPrimary, BaseModelWithUUIDPrimary } from "../base.model";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'sys_department'})
export default class SysDepartment extends BaseModelWithIDPrimary {
    @Column({name: 'parent_id', nullable: true, comment: '上级部门ID'})
    @ApiProperty()
    parentId: number

    @Column({name: 'name', comment: '部门名称'})
    @ApiProperty()
    name: string

    @Column({name: 'order_num', type: 'int', nullable: true, default: 0, comment: '排序'})
    @ApiProperty()
    orderNum: number  
}