import { Transform } from 'class-transformer';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseModel {
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', select: false })
  deletedAt: Date;
}

export class BaseModelWithUUIDPrimary extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;
}

export class BaseModelWithIDPrimary extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
}
