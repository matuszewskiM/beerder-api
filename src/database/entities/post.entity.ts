import { AccountEntity } from 'src/database/entities/account.entity';
import { Comment } from 'src/database/entities/comment.entity';
import { Category } from 'src/database/entities/category.entity';
import {
	Column,
	ManyToMany,
	JoinTable,
	PrimaryGeneratedColumn,
	ManyToOne,
	OneToMany,
	Entity,
} from 'typeorm';

@Entity()
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@ManyToOne(() => AccountEntity)
	author: AccountEntity;

	@Column()
	imagePath: string;

	@Column()
	date: Date;

	@OneToMany(() => Comment, (comment) => comment.post)
	@JoinTable()
	comments: Comment[];

	@ManyToMany(() => Category)
	@JoinTable()
	categories: Category[];

	@ManyToMany(() => AccountEntity)
	@JoinTable()
	upvoters: AccountEntity[];
}
