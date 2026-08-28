import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    name: 'completion_status',
    type: 'enum',
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending',
  })
  completionStatus: TaskStatus;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'create_time', type: 'datetime' })
  createTime: Date;

  @UpdateDateColumn({ name: 'last_update_time', type: 'datetime' })
  lastUpdateTime: Date;
}
