import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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
    @JoinColumn()
    user: Demo
}