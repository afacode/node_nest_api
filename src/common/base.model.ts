import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export class BaseModel {
    @CreateDateColumn({type: 'timestamp', name:  'create_at'})
    createAt: Date

    @UpdateDateColumn({type: 'timestamp', name: 'update_at'})
    updateAt: Date
}

export class BaseModelWithUUIDPrimary extends  BaseModel {
    @PrimaryGeneratedColumn('uuid')
    id: number
}