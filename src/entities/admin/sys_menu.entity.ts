import { Column, Entity } from "typeorm";
import { BaseModelWithIDPrimary, BaseModelWithUUIDPrimary } from "../base.model";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'sys_menu'})
export default class SysMenu extends BaseModelWithIDPrimary {
    @Column({name: 'parent_id', nullable: true, comment: '父菜单ID'})
    @ApiProperty()
    parentId: number

    @Column({name: 'name', comment: '菜单名称'})
    @ApiProperty()
    name: string

    @Column({name: 'router', nullable: true, comment: '菜单地址'})
    @ApiProperty()
    router: string

    @Column({name: 'perms', nullable: true, comment: '权限标识'})
    @ApiProperty()
    perms: string

    @Column({
        name: 'type', 
        type: 'tinyint',
        width: 1,
        default: 0,
        comment: '类型: 0=目录 1=菜单 2=权限',
    })
    @ApiProperty()
    type: number

    @Column({ name: 'icon', nullable: true, comment:'对应图标' })
    @ApiProperty()
    icon: string;

    @Column({ name: 'order_num', type: 'int', default: 0, nullable: true })
    @ApiProperty()
    orderNum: number;

    @Column({ name: 'view_path', nullable: true, comment: '视图地址，对应vue文件' })
    @ApiProperty()
    viewPath: string;

    @Column({ type: 'boolean', nullable: true, default: true, comment: '路由缓存' })
    @ApiProperty()
    keepalive: boolean;

    @Column({ name: 'is_show', type: 'boolean', nullable: true, default: true, comment:'是否显示在菜单栏' })
    @ApiProperty()
    isShow: boolean;

    @Column({ name: 'is_ext', type: 'boolean', nullable: true, default: false })
    @ApiProperty()
    isExt: boolean;

    @Column({ name: 'open_mode', type: 'tinyint', nullable: true, default: 1 })
    @ApiProperty()
    openMode: number;
}