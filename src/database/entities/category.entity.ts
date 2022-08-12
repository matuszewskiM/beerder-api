import { Post } from 'src/database/entities/post.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;

	@ManyToMany(() => Post)
	posts: Post[];
}
