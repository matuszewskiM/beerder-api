import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsAlpha,
	IsAlphanumeric,
	IsArray,
	IsEmpty,
	IsEnum,
	IsIn,
	MaxLength,
	MinLength,
	ValidateNested,
} from 'class-validator';
import { Alcohols } from '../enums/alcohols.enum';
import { Hobbies } from '../enums/hobbies.enum';

export class CreateAccountDto {
	@ApiProperty({
		description: 'Must be unique and alphanumeric',
		minLength: 8,
		maxLength: 16,
	})
	@IsAlphanumeric()
	@MinLength(8)
	@MaxLength(16)
	login: string;

	@ApiProperty({
		description: 'Must be alphanumeric',
		minLength: 8,
		maxLength: 16,
	})
	@IsAlphanumeric()
	@MinLength(8)
	@MaxLength(16)
	password: string;

	@ApiProperty({
		description: 'Must be alpha',
		minLength: 3,
		maxLength: 16,
	})
	@IsAlpha()
	@MinLength(3)
	@MaxLength(16)
	name: string;

	@ApiProperty({
		enum: Hobbies,
		isArray: true,
		minItems: 1,
	})
	@IsArray()
	@IsEnum(Hobbies, { each: true })
	hobbies: Hobbies;

	@ApiProperty({
		minLength: 15,
		maxLength: 100,
	})
	@MinLength(15)
	@MaxLength(100)
	description: string;

	@ApiProperty({
		enum: Alcohols,
		isArray: true,
		minItems: 1,
	})
	@IsArray()
	@IsEnum(Alcohols, { each: true })
	alcohols: Alcohols;
}
