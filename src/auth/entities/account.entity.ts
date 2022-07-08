import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class AccountEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nickname!: string;

	@Column({ select: false })
	password!: string;
}
