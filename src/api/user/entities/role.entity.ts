import { BaseModelWithUUIDPrimary } from "src/shared/model/base.model";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Permission } from "./permission.entity";


@Entity({name: 'roles'})
export class Role extends BaseModelWithUUIDPrimary {
    @Column({comment: '角色名'})
    name: string

    @ManyToMany(() => Permission)
    @JoinTable({
        name: 'role_permissions'
    })
    permissions:  Permission[]
}