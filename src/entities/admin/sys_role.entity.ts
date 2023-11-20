import { Column, Entity } from "typeorm";
import { BaseModelWithIDPrimary, BaseModelWithUUIDPrimary } from "../base.model";
import { ApiProperty } from "@nestjs/swagger";

/**
 * **索引**
 * ${UNIQUE} label
 * ${UNIQUE} name
 */
@Entity({name: 'sys_role'})
export default class SysRole extends BaseModelWithIDPrimary {
    @Column({name: 'user_id',comment: '创建人'})
    @ApiProperty()
    userId: string

    @Column({name: 'name', unique: true, comment: '角色名称'})
    @ApiProperty()
    name: string

    @Column({ length: 50, unique: true, comment: '标签' })
    @ApiProperty()
    label: string;

    @Column({ nullable: true, default: '' })
    @ApiProperty()
    remark: string;
}