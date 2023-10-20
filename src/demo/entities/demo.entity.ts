import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Demo {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    password: string

    @Column()
    age: number
}
