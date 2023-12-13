import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseModelWithIDPrimary } from '../base.model';

@Entity({ name: 'unique_code' })
export class UniqueCode extends BaseModelWithIDPrimary {
    @ApiProperty()
    @Column({
        length: 10,
        comment: '压缩码'
    })
    code: string;

    @ApiProperty()
    @Column({
        comment: '状态, 0 未使用、1 已使用'
    })
    status: number;
}