import { Alcohols } from '../enums/alcohols.enum';
import { Hobbies } from '../enums/hobbies.enum';

export class CreateAccountDto {
	login: string;
	password: string;
	name: string;
	hobbies: Hobbies[];
	description: string;
	alcohols: Alcohols[];
}
