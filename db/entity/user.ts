import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column()
  nickname!: string;

  @Column()
  avator!: string;

  @Column()
  job!: string;

  @Column()
  introduce!: string;
}