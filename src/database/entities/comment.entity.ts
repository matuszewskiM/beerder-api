import { AccountEntity } from 'src/database/entities/account.entity';
import { Post } from 'src/database/entities/post.entity';
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('comment')
export class Comment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	body: string;

	@Column()
	date: Date;

	@ManyToOne(() => AccountEntity)
	author: AccountEntity;

	@ManyToMany(() => AccountEntity)
	@JoinTable()
	upvoters: AccountEntity[];

	@ManyToOne(() => Post)
	post: Post;
}
