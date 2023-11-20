import { Column, Entity } from "typeorm";
import { BaseModelWithIDPrimary, BaseModelWithUUIDPrimary } from "../base.model";
import { ApiProperty } from "@nestjs/swagger";

// 登录日志表
@Entity({name: 'sys_login_log'})
export default class SysLoginLog extends BaseModelWithIDPrimary {
    @Column({ name: 'user_id', comment: '登录的用户id', nullable: true, })
    @ApiProperty()
    userId: number;

    @Column({ nullable: true })
    @ApiProperty()
    ip: string;

    @Column({
        name: 'login_location',
        comment: '登录地点',
        length: 255,
        default: '',
    })
    @ApiProperty()
    loginLocation: string;

    @Column({ type: 'datetime', nullable: true, comment: '登陆时间' })
    @ApiProperty()
    time: Date;

    @Column({ length: 500, nullable: true, comment: 'user-agent' })
    @ApiProperty()
    ua: string;
}