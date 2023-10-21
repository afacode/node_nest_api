import { BaseModelWithUUIDPrimary } from "src/common/base.model";
import { Column, Entity } from "typeorm";

@Entity()
export class User  extends  BaseModelWithUUIDPrimary{
    @Column()
    mobile: string

    @Column()
    name: string

    @Column({select: false})
    password: string

    @Column({nullable: true})
    address: string
}
