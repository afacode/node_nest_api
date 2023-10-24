import { Transform } from 'class-transformer'
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export class BaseModel {
  @CreateDateColumn({ type: 'timestamp', name: 'create_at' })
  createAt: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'update_at' })
  updateAt: Date

  @DeleteDateColumn({ type: 'timestamp', name: 'delete_at', select: false })
  deleteAt: Date
}

export class BaseModelWithUUIDPrimary extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string
}

export class BaseModelWithIDPrimary extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number
}
