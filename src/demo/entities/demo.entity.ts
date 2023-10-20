import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Demo {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    // select 查询不显示
    @Column({select: false, comment: '密码', nullable: true})
    password: string

    @Column({nullable: true})
    age: number

    @Column()
    @Generated('uuid')
    uuid: string

    @CreateDateColumn({type: 'timestamp'})
    createTime: Date

    @Column({type: 'simple-array', nullable:  true})
    hobby:  string[]

    @Column({type: 'simple-json', nullable:  true})
    json: {address: string, age:  number}
}

//  https://typeorm.nodejs.cn/find-options

//  mysql所有 类型
// int, smallint, mediumint, bigint, 
// float, double, dec, decimal, numeric,
// date, datetime, timestamp, time, year, char, varchar, nvarchar, 
// text, tinytext, mediumtext, blob, longtext, tinyblob, mediumblob, l
// ongblob, enum, json, binary, geometry, point, linestring, polygon,
//  multipoint, multilinestring, multipolygon, geometrycollection
