import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User.entity";

@Entity("notes")
export class Note {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "boolean", default: false })
  complete: boolean;

  @Column({ type: "varchar", nullable: false })
  description: string;

  @Column({ type: "simple-array", nullable: true })
  tags: string[];

  @Column({ name: "limit_date", type: "timestamp", nullable: false })
  limitDate: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
  notes: any;
}
