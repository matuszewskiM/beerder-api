import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, MaxLength, MinLength } from 'class-validator';

export class CreateAccountDto {
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
	@IsAlphanumeric()
	@MinLength(3)
	@MaxLength(16)
	nickname: string;
}
