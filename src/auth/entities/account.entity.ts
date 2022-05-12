import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Alcohols } from '../enums/alcohols.enum';
import { City } from '../enums/city.enum';
import { Hobbies } from '../enums/hobbies.enum';

@Entity({ name: 'accounts' })
export class AccountEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	login!: string;

	@Column()
	password!: string;

	@Column()
	name!: string;

	@Column({ array: true })
	hobbies!: Hobbies;

	@Column()
	description!: string;

	@Column({ array: true })
	alcohols!: Alcohols;

	@Column('int', { array: true, default: [] })
	blacklist: number[];

	@Column('int', { array: true, default: [] })
	whitelist: number[];

	@Column()
	city!: City;
}
