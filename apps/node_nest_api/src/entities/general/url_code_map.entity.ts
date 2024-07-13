import { Column, Entity } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { BaseModelWithIDPrimary } from '../base.model';

@Entity('url_code_map')
export class UrlCodeMap  extends BaseModelWithIDPrimary {
    @ApiProperty()
    @Column({
        length: 10,
        comment: '压缩码',
        name: 'short_url',
    })
    shortUrl: string;

    @ApiProperty()
    @Column({
        length: 200,
        comment: '原始 url',
        name: 'long_url',
    })
    longUrl: string;
}