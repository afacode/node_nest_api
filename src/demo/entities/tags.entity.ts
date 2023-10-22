import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { Demo } from "./demo.entity";

@Entity()
export class Tags {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @CreateDateColumn({type: 'timestamp'})
    createTime: Date

    @UpdateDateColumn({type: 'timestamp'})
    updateTime: Date

    @ManyToOne(() => Demo, (user)  => user.tags)
    @JoinColumn({name: 'user_id'})
    user: Demo

    @OneToOne(() =>  Demo, (demo) => demo.test)
    @JoinColumn({name:  'test_id'})
    test: Relation<Demo>
}