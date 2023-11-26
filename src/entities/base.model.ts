import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  @ApiProperty({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  @ApiProperty({name: 'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', select: false })
  deletedAt: Date;
}

export class BaseModelWithUUIDPrimary extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  @ApiProperty({name: 'id == uuid'})
  id: string;
}

export class BaseModelWithIDPrimary extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  @ApiProperty({name: 'id'})
  id: number;
}
